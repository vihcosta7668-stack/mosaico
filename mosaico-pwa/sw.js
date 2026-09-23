// Mosaico — cache do app e reenvio em segundo plano.
// Troque a VERSAO sempre que subir arquivos novos.
const VERSAO = "mosaico-v2";
const ARQUIVOS = [
  "./", "index.html", "manifest.webmanifest",
  "conteudo/situacoes.js",
  "js/bridge.js", "js/store.js", "js/auth.js", "js/sync.js", "js/progresso.js",
  "icon-192.png", "icon-512.png", "apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  // addAll falha inteiro se um arquivo faltar: guarda um a um para ser tolerante
  e.waitUntil(caches.open(VERSAO).then((c) =>
    Promise.allSettled(ARQUIVOS.map((a) => c.add(a)))));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) =>
    Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // chamadas ao Supabase nunca entram no cache
  if (url.hostname.endsWith("supabase.co")) return;

  // página: rede primeiro (pega atualizações), cache se estiver offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then((r) => { const c = r.clone(); caches.open(VERSAO).then((x) => x.put("index.html", c)); return r; })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  // resto (módulos, ícones, fontes, biblioteca da CDN): cache primeiro
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(VERSAO).then((x) => x.put(req, c)); }
    return r;
  }).catch(() => hit)));
});

// Background Sync (Android/Chrome): avisa as abas para esvaziarem a fila.
self.addEventListener("sync", (e) => {
  if (e.tag === "mosaico-sync") e.waitUntil(avisarAbas());
});
async function avisarAbas() {
  const abas = await self.clients.matchAll({ includeUncontrolled: true });
  abas.forEach((c) => c.postMessage({ tipo: "sincronizar" }));
  // Sem aba aberta, a fila sai na próxima abertura: o dado já está salvo no IndexedDB.
}
