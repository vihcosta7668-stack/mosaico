/**
 * progresso.js — o que a interface chama
 *
 * A tela não conhece Supabase, IndexedDB nem fila. Ela chama três funções:
 *   concluirEtapa(), lerProgresso() e sincronizarDoServidor().
 * Trocar Supabase por Firebase depois não encosta em nenhum arquivo de tela.
 */

import { salvar, ler, lerTodos, salvarVarios, setMeta, getMeta, agora } from "./store.js";
import { enfileirar } from "./sync.js";
import { sb, usuarioId } from "./auth.js";

/**
 * Marca uma etapa/ocasião como concluída. Grava local na hora, enfileira o envio.
 * @param {string} occasionId  ex.: "ie:restaurante:shadowing"
 * @param {object} extra       { status, pontos, sotaque_id, categoria }
 */
export async function concluirEtapa(occasionId, extra = {}) {
  const atual = (await ler("progresso", occasionId)) || {};
  const registro = {
    occasion_id: occasionId,
    status: extra.status || "concluido",
    pontos: Math.max(atual.pontos || 0, extra.pontos || 0),
    sotaque_id: extra.sotaque_id || atual.sotaque_id || null,
    categoria: extra.categoria || atual.categoria || null,
    updated_at: agora(),
    origem: "local",
  };

  await salvar("progresso", registro);                     // (1) a tela já pode reagir
  await enfileirar("progresso", registro, `progresso:${occasionId}`); // (2) fila
  return registro;
}

export async function lerProgresso(occasionId) {
  return (await ler("progresso", occasionId)) || null;
}

export async function todoProgresso() {
  return await lerTodos("progresso");
}

export async function resumo() {
  const todos = await lerTodos("progresso");
  const concluidos = todos.filter((p) => p.status === "concluido");
  return {
    concluidos: concluidos.length,
    pontos: todos.reduce((s, p) => s + (p.pontos || 0), 0),
    porSotaque: concluidos.reduce((acc, p) => {
      if (p.sotaque_id) acc[p.sotaque_id] = (acc[p.sotaque_id] || 0) + 1;
      return acc;
    }, {}),
  };
}

/**
 * Puxa o que está no servidor e funde com o local, campo a campo, por updated_at.
 * Rodar: depois do login, e de vez em quando (troca de aparelho).
 * Nunca apaga registro local que ainda está na fila: ele é mais novo por definição.
 */
export async function sincronizarDoServidor({ completo = false } = {}) {
  const uid = await usuarioId();
  if (!uid || !navigator.onLine) return { pulado: true };

  const desde = completo ? null : await getMeta("ultimo_pull");
  let q = sb.from("user_progress")
    .select("occasion_id,status,pontos,sotaque_id,categoria,updated_at")
    .eq("user_id", uid);
  if (desde) q = q.gt("updated_at", desde);                 // pull incremental

  const { data, error } = await q;
  if (error) return { erro: error.message };

  const mesclados = [];
  for (const remoto of data || []) {
    const local = await ler("progresso", remoto.occasion_id);
    if (!local || Date.parse(remoto.updated_at) > Date.parse(local.updated_at)) {
      mesclados.push({ ...remoto, origem: "servidor" });
    }
    // Se o local for mais novo, ele continua na fila e vence no próximo envio.
  }
  if (mesclados.length) await salvarVarios("progresso", mesclados);
  await setMeta("ultimo_pull", agora());
  return { baixados: data?.length || 0, aplicados: mesclados.length };
}

/**
 * Primeiro login num aparelho que já tinha progresso de visitante:
 * o local é adotado como do usuário e reenviado, em vez de ser descartado.
 */
export async function adotarProgressoLocal() {
  const todos = await lerTodos("progresso");
  for (const p of todos.filter((x) => x.origem === "local")) {
    await enfileirar("progresso", p, `progresso:${p.occasion_id}`);
  }
  return todos.length;
}
