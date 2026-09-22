# Mosaico — camada de dados (PWA offline-first)

```
index.html            tela (não conhece banco nem fila)
sw.js                 cache do app + Background Sync
js/store.js           IndexedDB: progresso, outbox, meta
js/auth.js            Supabase + sessão
js/sync.js            fila e sincronização automática
js/progresso.js       API que a tela usa
sql/schema.sql        tabelas, RLS e função de conflito
```

## 1. Supabase

1. Crie o projeto em supabase.com e rode `sql/schema.sql` no SQL Editor.
2. Em **Authentication → Providers**, deixe Email ligado. Para testar rápido, desligue "Confirm email".
3. Em **Authentication → URL Configuration**, coloque a URL do GitHub Pages em *Site URL* e em *Redirect URLs*. Sem isso o link mágico volta para `localhost`.
4. Em **Settings → API**, copie *Project URL* e a chave *anon* para `js/auth.js`.

A chave anon pode ficar no código: ela só permite o que a RLS autoriza. A chave `service_role` **nunca** entra no app.

## 2. index.html

```html
<script type="module">
  import { entrar, cadastrar, aoMudarSessao, estaLogado } from "./js/auth.js";
  import { iniciarSincronizacao, aoMudarSync } from "./js/sync.js";
  import { concluirEtapa, sincronizarDoServidor, adotarProgressoLocal, resumo } from "./js/progresso.js";

  iniciarSincronizacao();

  aoMudarSessao(async (evento) => {
    if (evento === "SIGNED_IN") {
      await adotarProgressoLocal();      // progresso feito antes do login não se perde
      await sincronizarDoServidor({ completo: true });
      renderizar();
    }
  });

  // indicador discreto no topo: "salvo" / "salvo no aparelho, envia depois"
  aoMudarSync(({ estado, pendentes }) => {
    document.getElementById("selo").textContent =
      estado === "offline"  ? "offline · salvo aqui" :
      estado === "pendente" ? `${pendentes} para enviar` :
      estado === "sincronizando" ? "enviando…" : "tudo salvo";
  });

  // no fim de cada etapa da lição:
  await concluirEtapa("ie:restaurante:shadowing", { pontos: 10, sotaque_id: "ie", categoria: "viagem" });
</script>
```

Regra de ouro: **nenhuma tela faz `await` de rede.** Ela chama `concluirEtapa`, que grava local e devolve na hora.

## 3. sw.js — reenvio com o app fechado

Acrescente ao Service Worker atual:

```js
self.addEventListener("sync", (e) => {
  if (e.tag === "mosaico-sync") e.waitUntil(avisarAbas());
});
async function avisarAbas() {
  const abas = await self.clients.matchAll({ includeUncontrolled: true });
  abas.forEach((c) => c.postMessage({ tipo: "sincronizar" }));
  // Sem aba aberta, a fila sai na próxima abertura: o dado já está seguro no IndexedDB.
}
```

E no app:

```js
navigator.serviceWorker?.addEventListener("message", (e) => {
  if (e.data?.tipo === "sincronizar") sincronizar({ motivo: "sw" });
});
```

Background Sync funciona em Chrome/Android. No iPhone não existe: lá a fila sai quando o app é aberto de novo. Por isso o dado **precisa** estar no IndexedDB antes de qualquer tentativa de envio.

## 4. Login sem obrigar cadastro

Deixe o app usável como visitante: tudo grava no IndexedDB com `origem: "local"`. Peça a conta só quando fizer diferença ("guardar seu progresso e usar em outro celular"). No login, `adotarProgressoLocal()` reenvia o que já existia.

## 5. Testes que valem a pena

| Teste | Como | Esperado |
|---|---|---|
| Offline puro | DevTools → Network → Offline, concluir 3 etapas | Tela responde, `outbox` com 3 itens |
| Volta da rede | Desligar o Offline | Fila zera sozinha em segundos |
| Reenvio duplicado | Rodar `sincronizar()` duas vezes seguidas | Nenhuma linha duplicada (chave `user_id + occasion_id`) |
| Conflito | Concluir no celular offline, depois algo diferente no note | Vence o `updated_at` maior |
| Token vencido | Esperar expirar ou apagar a sessão | Fila fica intacta, volta a enviar após novo login |
| RLS | No SQL Editor, `select * from user_progress` com outro usuário | Só as linhas do próprio usuário |


---

# Pacote pronto para o GitHub Pages

Este diretório já é o app inteiro. Suba **os arquivos soltos** na raiz do repositório
(não a pasta, não o zip), ligue o Pages em Settings → Pages → main / root.

```
index.html              app completo (telas, áudios embutidos, lições)
manifest.webmanifest    nome, ícones, abertura em tela cheia
sw.js                   cache offline + Background Sync
js/bridge.js            liga a tela aos módulos
js/store.js             IndexedDB
js/auth.js              Supabase (COLE SUAS CHAVES AQUI)
js/sync.js              fila e sincronização
js/progresso.js         API de progresso
js/telaAuth.js          versão em módulo das telas de conta (referência para
                        quando você quebrar o index.html em arquivos)
css/auth.css            estilos das telas de conta (já embutidos no index.html)
sql/schema.sql          rodar no SQL Editor do Supabase
icon-192.png  icon-512.png  apple-touch-icon.png
```

## Dois modos, automáticos

| Situação | O que acontece |
|---|---|
| **Sem as chaves do Supabase** (como está agora) | O app funciona inteiro. Progresso, nível e sotaque escolhido ficam no IndexedDB. As telas de conta avisam "modo local". A fila guarda tudo o que seria enviado. |
| **Com as chaves preenchidas** | Login, cadastro e link por e-mail passam a funcionar. A fila que já existia é enviada no primeiro login, sem perder nada do que foi feito antes. |

A troca é só colar `SUPABASE_URL` e `SUPABASE_KEY` (a chave publicável, `sb_publishable_...`) em `js/auth.js`. Nenhuma outra linha muda. O passo a passo completo está em `TUTORIAL-SUPABASE.md`.

## Regra de arquitetura que este pacote respeita

**A camada local nunca depende da camada de rede.** `store.js`, `sync.js` e `progresso.js`
carregam sempre; `auth.js`, que depende da biblioteca do Supabase vinda de CDN, é
carregado sob demanda. Se a CDN estiver fora do ar ou o celular abrir o app pela
primeira vez sem internet, o app continua salvando normalmente — só a fila não esvazia.

Isso foi encontrado num teste real: com a CDN bloqueada, a versão anterior parava de
gravar o progresso.

## Depois de subir

1. Abra a URL no celular e instale (Android: menu → Instalar app; iPhone: Compartilhar → Adicionar à Tela de Início).
2. Conclua uma etapa, feche o app, abra de novo: o progresso tem que estar lá.
3. Ligue o modo avião e repita: tem que continuar funcionando.
4. Quando ligar o Supabase, confira em Table Editor → `user_progress` se as linhas chegaram.

Para atualizar o app depois: suba o `index.html` novo e troque `mosaico-v1` por `mosaico-v2` em `sw.js`.
