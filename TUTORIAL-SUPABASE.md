# Supabase do zero — tutorial para o Mosaico

Guia para ligar o app a um banco de dados e ter login de usuários. Não precisa saber nada de servidor. Leva cerca de 30 minutos, e o app continua funcionando mesmo se você parar no meio.

---

## O que é o Supabase, em duas linhas

É um pacote pronto com banco de dados, sistema de login e API, tudo acessível pela internet. Você não instala nem administra servidor: cria o projeto pelo site, cola duas linhas no código, e pronto. O plano gratuito é suficiente para todo o teste do Mosaico.

---

## Passo 1 — Criar a conta

1. Acesse **supabase.com** e clique em **Start your project**.
2. Entre com a conta do **GitHub** (a mesma que você usa para o Pages). É o caminho mais curto.
3. Ele vai pedir para criar uma **organização**. Use o nome que quiser, por exemplo LeafTek. Escolha o plano **Free**.

---

## Passo 2 — Criar o projeto

Clique em **New project** e preencha:

| Campo | O que colocar |
|---|---|
| **Name** | `mosaico` |
| **Database Password** | Clique em *Generate a password* e **guarde essa senha** no seu gerenciador de senhas |
| **Region** | **South America (São Paulo)** |

Sobre a senha do banco: você não vai usá-la no app (o app usa chaves, não senha). Ela serve para conectar direto no Postgres, por exemplo por um cliente SQL. Guarde mesmo assim, porque recuperá-la depois dá trabalho.

Sobre a região: escolher São Paulo reduz o tempo de resposta para quem está no Brasil. Como o Mosaico é offline-first, isso importa pouco, mas não custa nada acertar.

Clique em **Create new project** e espere de 2 a 3 minutos enquanto ele é criado.

---

## Passo 3 — Criar as tabelas

Aqui você vai rodar o arquivo `sql/schema.sql` que está no pacote do app. Ele cria três tabelas, liga a segurança por usuário e cria a função que resolve conflitos de sincronização.

1. No menu lateral, clique em **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo `sql/schema.sql` no computador, **copie tudo** e cole na caixa.
4. Clique em **Run** (ou Ctrl+Enter).

Deve aparecer **Success. No rows returned**. É isso mesmo: comandos de criação não devolvem linhas.

**Conferindo:** vá em **Table Editor** no menu lateral. Devem estar lá `perfis`, `occasions` e `user_progress`, todas vazias e com um cadeado indicando que a segurança por linha está ligada.

---

## Passo 4 — Configurar o login

No menu lateral, **Authentication**.

**4.1 — Ativar e-mail e senha**

Em **Sign In / Providers**, confirme que **Email** está ligado.

Logo abaixo existe a opção **Confirm email**. Enquanto você estiver testando, **desligue**: assim a conta entra na hora, sem precisar abrir o e-mail a cada teste. Ligue de volta antes de abrir o app para outras pessoas, senão qualquer um cadastra e-mail de terceiros.

**4.2 — Dizer ao Supabase onde o app mora**

Em **URL Configuration**:

- **Site URL**: `https://accoutsssbm.github.io/mosaico/`
- **Redirect URLs**: clique em *Add URL* e coloque a mesma coisa, com `**` no fim:
  `https://accoutsssbm.github.io/mosaico/**`

Sem isso, o link de acesso por e-mail leva a pessoa para um endereço errado e o login não completa. É o erro mais comum de quem está começando.

---

## Passo 5 — Copiar as chaves

No menu lateral, **Settings** (a engrenagem) → **API Keys**.

Você precisa de dois valores:

1. **Project URL** — algo como `https://abcdefgh.supabase.co`
2. **Publishable key** — começa com `sb_publishable_...`

> **Atenção às mudanças recentes.** O Supabase está substituindo as chaves antigas (`anon` e `service_role`) pelas novas (publicável e secreta), e as antigas serão desativadas até o fim de 2026. Projetos criados agora já vêm só com as novas. Se o seu projeto mostrar as duas opções, use a **publicável**.

**A chave publicável pode ficar no código do app, e isso não é descuido.** Quem impede um usuário de ler dados de outro é a segurança por linha (RLS) que o `schema.sql` ligou. A chave secreta (`sb_secret_...`) é outra história: ela ignora toda a segurança e **nunca** pode entrar no app, em nenhuma circunstância.

---

## Passo 6 — Colar as chaves no app

Abra `js/auth.js` e troque as duas primeiras linhas:

```js
export const SUPABASE_URL = "https://abcdefgh.supabase.co";
export const SUPABASE_KEY = "sb_publishable_xxxxxxxxxxxxx";
```

Salve o arquivo.

É só isso. O app detecta sozinho que agora existe servidor: as telas de login saem do "modo local", a sincronização liga, e a fila que já tinha sido acumulada é enviada no primeiro login.

---

## Passo 7 — Subir a versão nova

1. No repositório do GitHub, suba o `js/auth.js` novo por cima do antigo.
2. Abra o `sw.js` e troque `mosaico-v1` por `mosaico-v2`. **Esse passo não é opcional**: sem ele, os celulares que já abriram o app continuam usando a versão guardada no cache e nada muda.
3. Espere 1 ou 2 minutos e abra o app.

---

## Passo 8 — Testar de verdade

Faça nesta ordem, conferindo cada resultado:

**1. Criar conta pelo app.** Use um e-mail real seu.
→ No painel, em **Authentication → Users**, a pessoa deve aparecer.
→ Em **Table Editor → perfis**, deve existir uma linha com o sotaque que você escolheu na tela de cadastro. Essa linha foi criada sozinha, pelo gatilho do `schema.sql`.

**2. Concluir uma etapa no app.**
→ Em **Table Editor → user_progress**, deve surgir uma linha com o `occasion_id` (algo como `uk-rp:ouvir`).

**3. Ligar o modo avião e concluir mais duas etapas.**
→ O app continua funcionando normalmente. Na aba Progresso, o campo "Na fila para enviar" mostra 2.

**4. Desligar o modo avião.**
→ Em alguns segundos a fila zera sozinha e as duas linhas aparecem no banco.

**5. Entrar com a mesma conta em outro aparelho, ou no computador.**
→ O progresso deve aparecer lá também.

Se os cinco passarem, a arquitetura está funcionando de ponta a ponta.

---

## Problemas comuns

| O que aparece | O que é | Como resolver |
|---|---|---|
| `Invalid API key` | Chave errada ou incompleta | Copie de novo, inteira, sem espaços nas pontas |
| `new row violates row-level security policy` | A pessoa não está logada, ou a política não foi criada | Confira se o `schema.sql` rodou inteiro; refaça o login no app |
| O e-mail de confirmação não chega | O serviço de e-mail gratuito do Supabase é limitado e cai em spam | Veja o spam. Para testar, desligue *Confirm email* |
| O link do e-mail leva a uma página de erro | Falta a URL em *Redirect URLs* | Volte ao passo 4.2 |
| `Failed to fetch` no celular | Sem internet, ou projeto pausado | O app segue funcionando offline. Veja o item abaixo sobre pausa |
| O app não mudou depois de subir arquivo | O cache do Service Worker | Troque a versão no `sw.js` e recarregue |
| Nada é salvo no banco, mas o app funciona | As chaves não foram coladas, ou tem erro de digitação | Abra o app no computador, aperte F12 e veja o aviso no console |

---

## Três coisas para saber sobre o plano gratuito

**Projetos gratuitos são pausados depois de 7 dias sem uso.** O app não fica inacessível — ele continua funcionando offline —, mas a sincronização para até você restaurar o projeto pelo painel, com um clique. Se o Mosaico virar algo sério, o plano Pro (US$ 25 por mês) tira essa pausa.

**Os limites são generosos para testar:** 500 MB de banco, 50 mil usuários ativos por mês e 2 projetos gratuitos. O progresso de um usuário ocupa alguns kilobytes, então 500 MB são milhares de pessoas.

**Rode o Advisor de vez em quando.** No menu lateral, em **Advisors**, o Supabase aponta tabelas sem segurança ativada e outros riscos. É um bom hábito antes de abrir o app para outras pessoas.

---

## Checklist final

- [ ] Projeto criado na região São Paulo, senha do banco guardada
- [ ] `schema.sql` rodou e as três tabelas aparecem no Table Editor
- [ ] Email ligado em Authentication; *Confirm email* desligado só durante os testes
- [ ] Site URL e Redirect URLs apontando para o GitHub Pages
- [ ] Project URL e chave publicável coladas em `js/auth.js`
- [ ] Versão trocada no `sw.js` e arquivos subidos
- [ ] Os cinco testes do passo 8 passaram
- [ ] *Confirm email* religado antes de convidar outras pessoas
