/**
 * telaAuth.js — boas-vindas, cadastro, login e conta
 *
 * Princípios desta tela:
 *  - Ninguém é obrigado a criar conta para usar o app. "Continuar sem conta"
 *    é uma opção de primeira classe, não um link escondido.
 *  - Sem internet, a tela não trava nem mente: avisa e libera o uso local.
 *  - Toda mensagem de erro é em português e diz o que fazer.
 *
 * Uso:
 *   import { montarAuth } from "./telaAuth.js";
 *   montarAuth(document.getElementById("view"), { aoEntrar: iniciarApp, aoPular: iniciarApp });
 */

import { entrar, cadastrar, entrarComLink, sair, sb, usuarioId } from "./auth.js";
import { setMeta, getMeta } from "./store.js";
import { statusFila, sincronizar, reenviarFalhados, aoMudarSync } from "./sync.js";
import { sincronizarDoServidor, adotarProgressoLocal, resumo } from "./progresso.js";

const SOTAQUES = [
  ["us-geral", "Americano"], ["uk-rp", "Britânico"], ["ie", "Irlandês"],
  ["au", "Australiano"], ["sco", "Escocês"],
];

const MOSAICO = `<svg class="mos" viewBox="0 0 100 100" aria-hidden="true"><g fill="currentColor">
  <rect x="22" y="22" width="25" height="25" rx="5"/><path d="M53 47V22a25 25 0 0 1 25 25z"/>
  <circle cx="34.5" cy="65.5" r="12.5"/>
  <rect x="54" y="60" width="5.5" height="11" rx="2.75"/><rect x="62.75" y="53" width="5.5" height="25" rx="2.75"/>
  <rect x="71.5" y="57" width="5.5" height="17" rx="2.75"/></g></svg>`;

let alvo = null;
let opcoes = {};
let escolhido = "us-geral";

export function montarAuth(elemento, opts = {}) {
  alvo = elemento;
  opcoes = opts;
  telaBoasVindas();
}

/* ============================ telas ============================ */

function telaBoasVindas() {
  alvo.innerHTML = `
    <div class="auth">
      <div class="auth-topo">${MOSAICO}<h1>Mosaico</h1>
        <p>Os sotaques do inglês, do jeito que se fala.</p></div>
      ${avisoOffline()}
      <div class="auth-acoes">
        <button class="cta" data-ir="cadastro">Criar conta</button>
        <button class="ghost" data-ir="login">Já tenho conta</button>
        <button class="linkbtn" data-ir="pular">Continuar sem conta</button>
      </div>
      <p class="auth-nota">Sem conta, seu progresso fica salvo só neste aparelho.
        Com conta, ele acompanha você em qualquer celular.</p>
    </div>`;
  ligar();
}

function telaCadastro() {
  alvo.innerHTML = `
    <div class="auth">
      ${voltar("boas")}
      <h2 class="big">Criar conta</h2>
      <p class="sub">Leva menos de um minuto. Depois disso o progresso é seu, não do aparelho.</p>
      ${avisoOffline()}
      <form id="form" novalidate>
        ${campo("email", "E-mail", "email", "voce@exemplo.com", "email")}
        ${campo("senha", "Senha", "password", "mínimo de 8 caracteres", "new-password")}
        <fieldset class="campo">
          <legend>Por qual sotaque quer começar?</legend>
          <div class="chips chips-auth">
            ${SOTAQUES.map(([id, nome]) => `<button type="button" data-sot="${id}" class="${id === escolhido ? "on" : ""}">${nome}</button>`).join("")}
          </div>
        </fieldset>
        <div class="auth-erro" id="erro" role="alert" aria-live="polite" hidden></div>
        <button class="cta" id="enviar" type="submit">Criar conta</button>
      </form>
      <button class="linkbtn" data-ir="login">Já tenho conta</button>
    </div>`;
  ligar();
  alvo.querySelectorAll("[data-sot]").forEach((b) => b.onclick = () => {
    escolhido = b.dataset.sot;
    alvo.querySelectorAll("[data-sot]").forEach((x) => x.classList.toggle("on", x === b));
  });
  alvo.querySelector("#form").onsubmit = async (e) => {
    e.preventDefault();
    const email = valor("email"), senha = valor("senha");
    if (!emailValido(email)) return erro("Confira o e-mail: parece estar incompleto.");
    if (senha.length < 8) return erro("A senha precisa de pelo menos 8 caracteres.");
    if (!navigator.onLine) return erro("Sem internet agora. Você pode continuar sem conta e criar depois — nada se perde.");
    await comCarregando("enviar", "Criando…", async () => {
      await cadastrar(email, senha, escolhido);
      await setMeta("sotaque_preferido", escolhido);
      const { data } = await sb.auth.getSession();
      if (!data?.session) return telaConfirmar(email);   // confirmação por e-mail ligada
      await depoisDeEntrar();
    });
  };
}

function telaLogin() {
  alvo.innerHTML = `
    <div class="auth">
      ${voltar("boas")}
      <h2 class="big">Entrar</h2>
      <p class="sub">Seu progresso volta exatamente de onde parou.</p>
      ${avisoOffline()}
      <form id="form" novalidate>
        ${campo("email", "E-mail", "email", "voce@exemplo.com", "email")}
        ${campo("senha", "Senha", "password", "sua senha", "current-password")}
        <div class="auth-erro" id="erro" role="alert" aria-live="polite" hidden></div>
        <button class="cta" id="enviar" type="submit">Entrar</button>
      </form>
      <button class="ghost" id="link">Entrar por link no e-mail</button>
      <button class="linkbtn" data-ir="cadastro">Criar uma conta</button>
    </div>`;
  ligar();
  alvo.querySelector("#form").onsubmit = async (e) => {
    e.preventDefault();
    const email = valor("email"), senha = valor("senha");
    if (!emailValido(email)) return erro("Confira o e-mail: parece estar incompleto.");
    if (!senha) return erro("Digite a senha.");
    if (!navigator.onLine) return erro("Sem internet. Dá para continuar sem conta e entrar depois.");
    await comCarregando("enviar", "Entrando…", async () => {
      await entrar(email, senha);
      await depoisDeEntrar();
    });
  };
  alvo.querySelector("#link").onclick = async () => {
    const email = valor("email");
    if (!emailValido(email)) return erro("Digite o e-mail primeiro: o link vai para ele.");
    await comCarregando("link", "Enviando…", async () => {
      await entrarComLink(email);
      telaConfirmar(email, true);
    });
  };
}

function telaConfirmar(email, link = false) {
  alvo.innerHTML = `
    <div class="auth">
      <div class="auth-topo">${MOSAICO}
        <h2 class="big">Confira seu e-mail</h2>
        <p class="sub">Mandamos ${link ? "um link de acesso" : "uma confirmação"} para <b>${escapar(email)}</b>.
          ${link ? "Abra o link no mesmo celular." : "Confirme e volte aqui para entrar."}</p></div>
      <button class="cta" data-ir="${link ? "boas" : "login"}">Voltar</button>
      <p class="auth-nota">Não chegou? Veja a caixa de spam ou tente de novo em alguns minutos.</p>
    </div>`;
  ligar();
}

/** Tela de conta: fica dentro do app, na aba Progresso. */
export async function telaConta(elemento) {
  const uid = await usuarioId();
  const email = await getMeta("email");
  const fila = await statusFila();
  const r = await resumo();
  elemento.innerHTML = `
    <div class="conta">
      <p class="eyebrow">Conta</p>
      <h2 class="big">${uid ? escapar(email || "Sua conta") : "Sem conta"}</h2>
      ${uid ? "" : `<p class="sub">Seu progresso está salvo só neste aparelho. Criar conta leva um minuto e leva tudo junto.</p>
        <button class="cta" id="criar">Criar conta</button>`}
      <div class="linhas">
        <div><span>Etapas concluídas</span><b>${r.concluidos}</b></div>
        <div><span>Pontos</span><b>${r.pontos}</b></div>
        <div><span>Na fila para enviar</span><b id="pend">${fila.pendentes}</b></div>
        <div><span>Última sincronização</span><b>${quando(fila.ultima_sync)}</b></div>
      </div>
      ${fila.falhados ? `<div class="auth-erro">${fila.falhados} envio(s) travado(s).
        <button class="linkbtn" id="retry">Tentar de novo</button></div>` : ""}
      ${uid ? `<button class="ghost" id="sinc">Sincronizar agora</button>
               <button class="linkbtn" id="sair">Sair da conta</button>` : ""}
    </div>`;
  const q = (s) => elemento.querySelector(s);
  q("#criar") && (q("#criar").onclick = () => opcoes.aoPedirConta?.());
  q("#retry") && (q("#retry").onclick = () => reenviarFalhados().then(() => telaConta(elemento)));
  q("#sinc") && (q("#sinc").onclick = async (e) => {
    e.target.disabled = true; e.target.textContent = "Sincronizando…";
    await sincronizar({ motivo: "botao" });
    await sincronizarDoServidor();
    telaConta(elemento);
  });
  q("#sair") && (q("#sair").onclick = async () => {
    const pend = (await statusFila()).pendentes;
    const msg = pend ? `Você tem ${pend} item(ns) esperando envio. Sair agora mantém tudo salvo no aparelho e envia no próximo login. Sair mesmo?`
                     : "Quer sair da conta?";
    if (!confirm(msg)) return;
    await sair();
    opcoes.aoSair?.();
  });
}

/* ============================ apoio ============================ */

async function depoisDeEntrar() {
  await adotarProgressoLocal();                       // nada do visitante se perde
  await sincronizarDoServidor({ completo: true });    // traz o que já existia na conta
  sincronizar({ motivo: "pos-login" });
  opcoes.aoEntrar?.();
}

function ligar() {
  alvo.querySelectorAll("[data-ir]").forEach((b) => b.onclick = () => {
    const d = b.dataset.ir;
    if (d === "pular") return opcoes.aoPular?.();
    ({ boas: telaBoasVindas, login: telaLogin, cadastro: telaCadastro }[d] || telaBoasVindas)();
  });
  atualizarAvisoRede();
}

function campo(id, rotulo, tipo, dica, autocomplete) {
  const senha = tipo === "password";
  return `<div class="campo">
    <label for="${id}">${rotulo}</label>
    <div class="campo-linha">
      <input id="${id}" type="${tipo}" placeholder="${dica}" autocomplete="${autocomplete}"
        ${tipo === "email" ? 'inputmode="email" autocapitalize="none" spellcheck="false"' : ""}>
      ${senha ? `<button type="button" class="olho" data-olho="${id}" aria-label="Mostrar senha">mostrar</button>` : ""}
    </div></div>`;
}

function voltar(destino) {
  return `<button class="voltar" data-ir="${destino}" aria-label="Voltar">
    <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>`;
}

const valor = (id) => (alvo.querySelector("#" + id)?.value || "").trim();
const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const escapar = (t) => String(t).replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));

function erro(msg) {
  const el = alvo.querySelector("#erro");
  if (!el) return alert(msg);
  el.textContent = msg; el.hidden = false;
  el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

/** Botão vira "carregando", volta ao normal no fim, e erro nunca fica preso. */
async function comCarregando(id, texto, fn) {
  const b = alvo.querySelector("#" + id);
  const antes = b.textContent;
  b.disabled = true; b.textContent = texto;
  try {
    await fn();
  } catch (e) {
    erro(e.semRede ? "Não deu para falar com o servidor. Tente de novo em instantes." : e.message);
  } finally {
    if (alvo.contains(b)) { b.disabled = false; b.textContent = antes; }
  }
}

function avisoOffline() {
  return `<div class="auth-offline" id="offline" ${navigator.onLine ? "hidden" : ""}>
    Sem internet. Entrar e criar conta precisam de rede — mas você pode usar o app agora e conectar depois.</div>`;
}
function atualizarAvisoRede() {
  const el = alvo.querySelector("#offline");
  if (el) el.hidden = navigator.onLine;
}
addEventListener("online", atualizarAvisoRede);
addEventListener("offline", atualizarAvisoRede);

// mostrar/ocultar senha
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-olho]");
  if (!b) return;
  const i = document.getElementById(b.dataset.olho);
  const ver = i.type === "password";
  i.type = ver ? "text" : "password";
  b.textContent = ver ? "ocultar" : "mostrar";
  b.setAttribute("aria-label", ver ? "Ocultar senha" : "Mostrar senha");
});

function quando(iso) {
  if (!iso) return "nunca";
  const min = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  if (min < 1440) return `há ${Math.round(min / 60)} h`;
  return `há ${Math.round(min / 1440)} d`;
}

// o selo de sincronização da tela de conta se atualiza sozinho
aoMudarSync(({ pendentes }) => {
  const el = document.getElementById("pend");
  if (el && typeof pendentes === "number") el.textContent = pendentes;
});
