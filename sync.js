/**
 * sync.js — fila local e sincronização automática
 *
 * Regras que este motor respeita:
 *  1. A tela nunca espera a rede. Grava local, responde na hora, enfileira o envio.
 *  2. Toda operação tem id próprio e é idempotente: reenviar duas vezes não duplica nada.
 *  3. Conflito é resolvido por updated_at (quem escreveu por último vence), e a
 *     comparação acontece no servidor, dentro da função SQL registrar_progresso.
 *  4. Erro de rede volta para a fila com espera crescente.
 *     Erro de dados (400, 422) NÃO volta: vai para o estado "falhou" e para de tentar,
 *     senão a fila entra em laço infinito consumindo bateria.
 */

import { salvar, apagar, lerTodos, setMeta, getMeta, uuid, agora } from "./store.js";
import { sb, usuarioId, sessaoValida } from "./auth.js";

const MAX_TENTATIVAS = 6;
const ESPERAS = [2_000, 5_000, 15_000, 60_000, 300_000, 900_000]; // até 15 min
let rodando = false;
let timer = null;

/* ---------------- entrada na fila ---------------- */

/**
 * Coloca uma operação na fila.
 * @param {string} tipo    "progresso" | "perfil" | "pontos"
 * @param {object} payload dados já prontos para o servidor
 * @param {string} chave   identidade lógica: operações com a mesma chave se substituem
 */
export async function enfileirar(tipo, payload, chave) {
  const item = {
    id: uuid(),
    chave: chave || `${tipo}:${uuid()}`,
    tipo,
    payload,
    criado_em: agora(),
    tentativas: 0,
    proxima_em: 0,
    estado: "pendente",
  };
  // Substitui pendência anterior da mesma chave: só o estado final interessa.
  const fila = await lerTodos("outbox");
  const antigo = fila.find((i) => i.chave === item.chave && i.estado === "pendente");
  if (antigo) await apagar("outbox", antigo.id);
  await salvar("outbox", item);
  agendar(0);
  return item.id;
}

/* ---------------- envio ---------------- */

const ENVIOS = {
  /** Progresso de uma ocasião/etapa. A função SQL decide se sobrescreve. */
  progresso: async (p) => sb.rpc("registrar_progresso", {
    p_occasion_id: p.occasion_id,
    p_status: p.status,
    p_pontos: p.pontos ?? 0,
    p_updated_at: p.updated_at,
  }),
  perfil: async (p) => sb.from("perfis").update(p.campos).eq("id", p.user_id),
  pontos: async (p) => sb.rpc("somar_pontos", { p_delta: p.delta, p_origem: p.origem }),
};

/**
 * Processa a fila inteira. Seguro para chamar várias vezes: só uma execução por vez.
 */
export async function sincronizar({ motivo = "manual" } = {}) {
  if (rodando) return { pulado: true };
  if (!navigator.onLine) return { offline: true };

  const uid = await usuarioId();
  if (!uid) return { semUsuario: true };        // visitante: fica tudo local
  if (!(await sessaoValida())) {                 // token vencido e sem renovar
    avisar({ estado: "sessao-expirada" });
    return { sessaoExpirada: true };
  }

  rodando = true;
  const resultado = { enviados: 0, adiados: 0, falhados: 0, motivo };
  try {
    const fila = (await lerTodos("outbox"))
      .filter((i) => i.estado === "pendente" && Date.parse(i.proxima_em || 0) <= Date.now())
      .sort((a, b) => a.criado_em.localeCompare(b.criado_em));

    avisar({ estado: "sincronizando", pendentes: fila.length });

    for (const item of fila) {
      try {
        const envio = ENVIOS[item.tipo];
        if (!envio) { await marcarFalha(item, "tipo desconhecido"); resultado.falhados++; continue; }

        const { error } = await envio(item.payload);
        if (error) throw Object.assign(new Error(error.message), { status: error.status || error.code });

        await apagar("outbox", item.id);        // só sai da fila com confirmação
        resultado.enviados++;
      } catch (e) {
        if (ehErroDeRede(e)) {                   // sem sinal no meio do caminho
          await adiar(item);
          resultado.adiados++;
          break;                                 // para a rodada: a rede caiu
        }
        if (ehErroPermanente(e)) {               // dado inválido, RLS, coluna errada
          await marcarFalha(item, e.message);
          resultado.falhados++;
        } else {
          await adiar(item);
          resultado.adiados++;
        }
      }
    }
    await setMeta("ultima_sync", agora());
  } finally {
    rodando = false;
  }

  const restantes = (await lerTodos("outbox")).filter((i) => i.estado === "pendente");
  avisar({ estado: restantes.length ? "pendente" : "em-dia", pendentes: restantes.length, ...resultado });
  if (restantes.length) agendar(proximaEspera(restantes));
  return resultado;
}

async function adiar(item) {
  item.tentativas++;
  if (item.tentativas >= MAX_TENTATIVAS) return marcarFalha(item, "tentativas esgotadas");
  const espera = ESPERAS[Math.min(item.tentativas - 1, ESPERAS.length - 1)];
  const jitter = Math.random() * espera * 0.3;   // evita todo mundo voltando junto
  item.proxima_em = new Date(Date.now() + espera + jitter).toISOString();
  await salvar("outbox", item);
}

async function marcarFalha(item, motivo) {
  item.estado = "falhou";
  item.erro = motivo;
  item.falhou_em = agora();
  await salvar("outbox", item);                  // fica guardado para diagnóstico
}

function ehErroDeRede(e) {
  return !navigator.onLine || /failed to fetch|network|timeout|aborted/i.test(e.message || "");
}
function ehErroPermanente(e) {
  const s = Number(e.status);
  if (s >= 400 && s < 500 && s !== 408 && s !== 429) return true;   // 401 tratado antes
  return /violates row-level security|invalid input|does not exist/i.test(e.message || "");
}
function proximaEspera(pendentes) {
  const t = pendentes.map((i) => Date.parse(i.proxima_em || 0)).filter(Boolean);
  if (!t.length) return 5_000;
  return Math.max(2_000, Math.min(...t) - Date.now());
}
function agendar(ms) {
  clearTimeout(timer);
  timer = setTimeout(() => sincronizar({ motivo: "agendado" }), Math.max(0, ms));
}

/* ---------------- gatilhos ---------------- */

export function iniciarSincronizacao() {
  addEventListener("online",  () => sincronizar({ motivo: "online" }));
  addEventListener("offline", () => avisar({ estado: "offline" }));

  // Voltar para o app depois de trocar de aba é o momento mais provável de ter rede.
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") sincronizar({ motivo: "voltou" });
  });

  // Última chance antes de o sistema descartar a página.
  addEventListener("pagehide", () => { navigator.serviceWorker?.ready.then((r) => r.sync?.register("mosaico-sync")).catch(() => {}); });

  // Background Sync: o Service Worker reenvia mesmo com o app fechado (Android/Chrome).
  navigator.serviceWorker?.ready
    .then((reg) => reg.sync?.register("mosaico-sync"))
    .catch(() => {});

  sincronizar({ motivo: "abertura" });
  setInterval(() => sincronizar({ motivo: "periodico" }), 5 * 60_000);
}

/* ---------------- estado para a interface ---------------- */

const ouvintes = new Set();
export function aoMudarSync(fn) { ouvintes.add(fn); return () => ouvintes.delete(fn); }
function avisar(estado) { ouvintes.forEach((fn) => { try { fn(estado); } catch (e) {} }); }

export async function statusFila() {
  const fila = await lerTodos("outbox");
  return {
    pendentes: fila.filter((i) => i.estado === "pendente").length,
    falhados: fila.filter((i) => i.estado === "falhou").length,
    ultima_sync: await getMeta("ultima_sync"),
  };
}

/** Reenfileira o que falhou: use num botão "tentar de novo" na tela de conta. */
export async function reenviarFalhados() {
  const fila = await lerTodos("outbox");
  for (const item of fila.filter((i) => i.estado === "falhou")) {
    item.estado = "pendente"; item.tentativas = 0; item.proxima_em = 0; delete item.erro;
    await salvar("outbox", item);
  }
  return sincronizar({ motivo: "reenvio" });
}
