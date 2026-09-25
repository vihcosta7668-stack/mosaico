/**
 * store.js — camada local (IndexedDB)
 *
 * Três armazéns:
 *   progresso : estado atual de cada ocasião/etapa. É a FONTE DE VERDADE da tela.
 *   outbox    : fila de operações que ainda não chegaram ao servidor.
 *   meta      : chaves soltas (id do usuário, e-mail, último pull, sotaque preferido).
 *
 * Por que IndexedDB e não localStorage:
 *   - localStorage é síncrono e trava a interface;
 *   - tem limite baixo (~5 MB) e só guarda texto;
 *   - não tem índice nem transação, e a fila de sincronização precisa das duas coisas.
 * O localStorage fica só para o token de sessão, que a biblioteca de auth gerencia.
 */

const BANCO = "mosaico";
const VERSAO = 1;

let _db = null;

export function abrir() {
  if (_db) return Promise.resolve(_db);
  return new Promise((ok, erro) => {
    const req = indexedDB.open(BANCO, VERSAO);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("progresso")) {
        // chave = `${occasion_id}` — um registro por ocasião
        const p = db.createObjectStore("progresso", { keyPath: "occasion_id" });
        p.createIndex("updated_at", "updated_at");
        p.createIndex("status", "status");
      }
      if (!db.objectStoreNames.contains("outbox")) {
        const o = db.createObjectStore("outbox", { keyPath: "id" });
        o.createIndex("criado_em", "criado_em");
        o.createIndex("estado", "estado"); // pendente | falhou
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "chave" });
      }
    };
    req.onsuccess = () => { _db = req.result; ok(_db); };
    req.onerror = () => erro(req.error);
  });
}

function tx(armazem, modo, fn) {
  return abrir().then((db) => new Promise((ok, erro) => {
    const t = db.transaction(armazem, modo);
    const req = fn(t.objectStore(armazem));
    t.oncomplete = () => ok(req && "result" in req ? req.result : undefined);
    t.onerror = () => erro(t.error);
    t.onabort = () => erro(t.error);
  }));
}

export const salvar  = (armazem, valor) => tx(armazem, "readwrite", (s) => s.put(valor));
export const apagar  = (armazem, chave) => tx(armazem, "readwrite", (s) => s.delete(chave));
export const ler     = (armazem, chave) => tx(armazem, "readonly",  (s) => s.get(chave));
export const lerTodos = (armazem)       => tx(armazem, "readonly",  (s) => s.getAll());
export const limpar  = (armazem)        => tx(armazem, "readwrite", (s) => s.clear());

/** Grava vários registros numa única transação (usado no merge depois do pull). */
export function salvarVarios(armazem, valores) {
  return abrir().then((db) => new Promise((ok, erro) => {
    const t = db.transaction(armazem, "readwrite");
    const s = t.objectStore(armazem);
    valores.forEach((v) => s.put(v));
    t.oncomplete = ok;
    t.onerror = () => erro(t.error);
  }));
}

/* ---------- meta: pares chave/valor ---------- */
export const setMeta = (chave, valor) => salvar("meta", { chave, valor });
export const getMeta = (chave) => ler("meta", chave).then((r) => (r ? r.valor : null));

/** Identificador único e estável, gerado no cliente (a fila precisa ser idempotente). */
export function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Relógio em ISO. O servidor também carimba, mas quem decide o conflito é este aqui. */
export const agora = () => new Date().toISOString();
