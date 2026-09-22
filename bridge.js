/**
 * bridge.js — liga a interface (script clássico do index.html) aos módulos.
 *
 * Por que existe: o app da tela é um script comum e não pode usar `import`.
 * Esta ponte carrega os módulos, expõe `window.MOSAICO` e avisa por evento.
 *
 * Se a biblioteca do Supabase não carregar (primeira abertura offline, CDN fora do ar),
 * o app NÃO quebra: ele segue em modo local e tenta de novo na próxima abertura.
 */

const pronto = (detalhe) => {
  window.MOSAICO = detalhe;
  window.dispatchEvent(new CustomEvent("mosaico-pronto", { detail: detalhe }));
};

try {
  // camada local: não depende de rede nem de CDN, então carrega sempre
  const store = await import("./store.js");
  const sync  = await import("./sync.js");
  const prog  = await import("./progresso.js");

  let auth = null;
  try {
    auth = await import("./auth.js");     // só esta linha depende da CDN
  } catch (e) {
    console.warn("[Mosaico] servidor indisponível; o app segue salvando no aparelho:", e.message);
  }

  const configurado = !!(auth && auth.CONFIGURADO);
  if (configurado) {
    sync.iniciarSincronizacao();
    auth.aoMudarSessao((evento) => {
      window.dispatchEvent(new CustomEvent("mosaico-sessao", { detail: { evento } }));
    });
    navigator.serviceWorker?.addEventListener("message", (e) => {
      if (e.data?.tipo === "sincronizar") sync.sincronizar({ motivo: "sw" });
    });
  }

  pronto({ configurado, store, auth, sync, prog });
} catch (e) {
  console.error("[Mosaico] falha ao carregar os módulos:", e);
  pronto({ configurado: false, erro: e.message });
}
