/**
 * auth.js — conexão com o Supabase e sessão do usuário
 *
 * Por que Supabase e não Firebase, para este caso:
 *   - Postgres de verdade: o modelo (users, occasions, user_progress) é relacional;
 *   - Row Level Security resolve "cada um só vê o que é seu" no banco, não no app;
 *   - `upsert` e função SQL permitem resolver conflito de sincronização no servidor;
 *   - a chave anônima pode ficar no código do cliente, porque quem protege é a RLS.
 * Se preferir Firebase, só as funções deste arquivo e de sync.js mudam. O resto fica igual.
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { setMeta, getMeta, limpar } from "./store.js";

/* Cole os dois valores abaixo (Dashboard → Settings → API Keys).
   A chave PUBLICÁVEL (sb_publishable_...) pode ficar aqui no código: quem protege
   os dados é a RLS do banco. A chave SECRETA (sb_secret_...) NUNCA entra no app.
   Projetos criados a partir de novembro de 2025 só têm as chaves novas; projetos
   antigos ainda aceitam a chave anon, que funciona igual aqui. */
export const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
export const SUPABASE_KEY = "SUA-CHAVE-PUBLICAVEL";

/** Nome antigo mantido para compatibilidade com código que ainda o use. */
export const SUPABASE_ANON_KEY = SUPABASE_KEY;

/** Enquanto as chaves forem as de exemplo, o app roda em modo local (sem conta). */
export const CONFIGURADO = !SUPABASE_URL.includes("SEU-PROJETO") && !SUPABASE_KEY.includes("SUA-CHAVE");

export const sb = CONFIGURADO ? createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,      // mantém a sessão no localStorage entre aberturas
    autoRefreshToken: true,    // renova o token sozinho quando há rede
    detectSessionInUrl: true,  // necessário para link mágico e login social
  },
  global: { headers: { "x-app": "mosaico-pwa" } },
}) : null;

function exigeConfig() {
  if (!CONFIGURADO) {
    const e = new Error("O app ainda não está ligado a um servidor. Use sem conta por enquanto.");
    e.semServidor = true;
    throw e;
  }
}

/* ---------------- cadastro e login ---------------- */

export async function cadastrar(email, senha, sotaquePreferido) {
  exigeConfig();
  const { data, error } = await sb.auth.signUp({
    email,
    password: senha,
    options: {
      data: { sotaque_preferido: sotaquePreferido },
      // Diz explicitamente para onde voltar após confirmar o e-mail — não
      // depende só do Site URL do painel, que pode ficar defasado em cache.
      emailRedirectTo: location.href.split("#")[0].split("?")[0],
    },
  });
  if (error) throw traduzErro(error);
  // Se a confirmação por e-mail estiver ligada, data.session vem nula: avise na tela.
  if (data.session) await guardarSessao(data.session);
  return data;
}

export async function entrar(email, senha) {
  exigeConfig();
  const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
  if (error) throw traduzErro(error);
  await guardarSessao(data.session);
  return data;
}

/** Link mágico: bom para celular, evita senha esquecida. */
export async function entrarComLink(email) {
  exigeConfig();
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.href.split("#")[0] },
  });
  if (error) throw traduzErro(error);
}

export async function sair({ apagarLocal = false } = {}) {
  if (sb) await sb.auth.signOut().catch(() => {});
  await setMeta("user_id", null);
  await setMeta("email", null);
  // Só apague o progresso local se outra pessoa for usar o aparelho.
  if (apagarLocal) { await limpar("progresso"); await limpar("outbox"); }
}

/* ---------------- sessão ---------------- */

/**
 * Guarda id e e-mail no IndexedDB. Offline o app não consegue perguntar
 * ao servidor quem está logado, então ele lê daqui.
 */
async function guardarSessao(session) {
  if (!session) return;
  await setMeta("user_id", session.user.id);
  await setMeta("email", session.user.email);
}

/** Id do usuário: primeiro a sessão viva, depois o que está gravado localmente. */
export async function usuarioId() {
  if (!sb) return await getMeta("user_id");
  const { data } = await sb.auth.getSession();
  if (data?.session) { await guardarSessao(data.session); return data.session.user.id; }
  return await getMeta("user_id"); // modo offline
}

export async function estaLogado() {
  return !!(await usuarioId());
}

/** Dispara em login, logout e renovação de token. */
export function aoMudarSessao(callback) {
  if (!sb) return { data: { subscription: { unsubscribe() {} } } };
  return sb.auth.onAuthStateChange(async (evento, session) => {
    if (session) await guardarSessao(session);
    callback(evento, session);
  });
}

/**
 * Garante um token válido antes de sincronizar.
 * Devolve false quando o refresh falhou de verdade (senha trocada, conta removida):
 * nesse caso a fila NÃO deve ser descartada, só adiada até o próximo login.
 */
export async function sessaoValida() {
  if (!sb) return false;
  const { data, error } = await sb.auth.getSession();
  if (error || !data?.session) return false;
  const expiraEm = (data.session.expires_at || 0) * 1000;
  if (expiraEm - Date.now() > 60_000) return true;
  const { data: novo, error: e2 } = await sb.auth.refreshSession();
  if (e2 || !novo?.session) return false;
  await guardarSessao(novo.session);
  return true;
}

/* ---------------- perfil ---------------- */

export async function salvarPreferencia(sotaquePreferido) {
  await setMeta("sotaque_preferido", sotaquePreferido); // vale offline na hora
  const uid = await usuarioId();
  if (!uid || !navigator.onLine) return { adiado: true };
  const { error } = await sb.from("perfis")
    .update({ sotaque_preferido: sotaquePreferido })
    .eq("id", uid);
  if (error) return { adiado: true, erro: error.message };
  return { adiado: false };
}

function traduzErro(error) {
  const msg = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "User already registered": "Esse e-mail já tem cadastro.",
    "Email not confirmed": "Confirme o e-mail antes de entrar.",
  }[error.message] || "Não foi possível completar a ação. Tente de novo.";
  const e = new Error(msg);
  e.original = error;
  e.semRede = /fetch|network/i.test(error.message || "");
  return e;
}
