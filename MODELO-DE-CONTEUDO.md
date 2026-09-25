# Modelo de conteúdo do Mosaico

Como o conteúdo é organizado, como ele é pesquisado e em que ordem produzir.

---

## 1. Os três eixos

| Eixo | O que é | Quantos | Quem escreve |
|---|---|---|---|
| **Situação** | O que se aprende: "No restaurante", "Reunião online" | 12 | Você, uma vez só |
| **Método** | Como se aprende: as 6 etapas de toda lição | 6 fixos | Já definido |
| **Sotaque** | Como aquilo soa naquele lugar | 15 | Camada curta por sotaque |

**A regra que sustenta o projeto:** a situação é escrita **uma vez** e o sotaque acrescenta só o que muda nela — uma palavra diferente, um traço de som, uma expressão local.

12 situações × 15 sotaques dariam 180 lições para escrever. Com a camada, são 12 lições e 15 camadas curtas. Quando você corrigir uma frase do restaurante, ela se corrige em todos os sotaques de uma vez.

## 2. As 6 etapas, e o método de cada uma

Toda lição, de qualquer situação, em qualquer sotaque, tem a mesma espinha:

| # | Etapa | Método | O que acontece |
|---|---|---|---|
| 1 | **Ouvir** | Input compreensível (Krashen) | O diálogo inteiro, linha em inglês e linha em português. Dá para esconder a tradução |
| 2 | **Sotaque** | Explicação guiada | Os traços de som **dentro daquelas frases**, não no abstrato |
| 3 | **Comparar** | Discriminação auditiva | A mesma fala em dois sotaques, e a palavra que muda (*bill × check*) |
| 4 | **Imitar** | Shadowing | Falar junto, gravar, ouvir nativo → você |
| 5 | **Cartões** | Repetição espaçada | Os blocos prontos da situação e as expressões locais |
| 6 | **Missão** | Tarefa real (TBLT) | Resolver a situação sozinho, com 3 saídas plausíveis |

A ordem não é decorativa: entender vem antes de imitar, imitar vem antes de produzir. Pular a etapa 1 para ir direto à 4 é o erro clássico de quem estuda pronúncia isolada e depois não entende ninguém.

## 3. O caminho do aluno

```
escolhe o sotaque  →  vê as situações desse sotaque  →  abre uma situação  →  6 etapas  →  próxima situação
```

A primeira situação de qualquer sotaque é sempre **Fundamentos**: os três traços que definem aquele jeito de falar. Depois dela, a pessoa escolhe a situação pela necessidade dela — quem vai viajar começa por aeroporto, quem trabalha com estrangeiros começa por reunião.

Trocar de sotaque não zera nada: o progresso é por situação **e** por sotaque.

## 4. Identificadores

```
situação        restaurante
sotaque         ie
etapa           ouvir
occasion_id     ie:restaurante:ouvir      ← é isto que vai para o banco
```

Sempre minúsculo, sem acento, sem espaço. O `sotaque_id` é a primeira parte, o que permite relatórios por sotaque sem coluna extra (o `schema.sql` já extrai isso sozinho).

## 5. Como pesquisar cada camada

**Para a situação** (o que se diz):
- Parta de uma transcrição real, não da sua memória de inglês escolar. Vídeos de vlog em supermercado, aeroporto e restaurante dão a linguagem como ela é.
- Corpora abertos ajudam a checar se uma frase é mesmo frequente: COCA, BNC e o Google Books Ngram servem para confirmar se as pessoas dizem *"could we get the bill"* ou *"may we have the bill"*.
- Escreva o diálogo com 4 a 6 turnos. Mais que isso ninguém termina no celular.
- Toda frase precisa passar neste teste: **um brasileiro que está lá realmente precisaria dizer isso?** Se não, corte.

**Para o sotaque** (como soa):
- Descrição fonética: Wikipedia tem verbetes sérios sobre variedades do inglês, com IPA. Use como ponto de partida, não como fonte final.
- Áudio real: arquivos de dialetos (como o IDEA, International Dialects of English Archive) e entrevistas locais no YouTube. **Confira a licença** antes de usar qualquer áudio no app.
- Palavra local: é o que mais confunde na vida real. *bill* × *check*, *queue* × *line*, *takeaway* × *to go*. Cada uma dessas vale mais que dez regras de fonética.
- **Revisão por nativo, sempre.** Cada camada de sotaque precisa passar pelos olhos de alguém daquele lugar antes de ir ao ar. É o passo que separa "app de sotaques" de caricatura.

**Para a missão** (a decisão):
- As duas opções erradas precisam ser **plausíveis**, não bobas. Uma que é gramaticalmente correta mas rude, outra que é educada mas não resolve o problema. É aí que o aluno aprende o que a gramática não ensina.

## 6. Ordem de produção

1. **Fundamentos dos 3 sotaques de lançamento** — já existe no app.
2. **3 situações completas**, com camada nesses 3 sotaques: restaurante, aeroporto, reunião. Cobrem viagem e trabalho, que são os dois motivos reais de quem paga por um app de inglês.
3. **Áudio gravado por nativo** dessas 3 situações × 3 sotaques. É o maior custo, e só vale a pena depois que o texto estiver revisado.
4. Só então **mais situações**, uma por semana.
5. Só então **mais sotaques**, uma camada por semana.

Largura antes de profundidade dá um app raso em 15 lugares. Profundidade antes de largura dá um app que alguém usa de verdade em 3.

## 7. Checklist por situação

- [ ] Diálogo de 4 a 6 turnos, linguagem falada de verdade
- [ ] 4 frases-chave, cada uma com nota explicando o uso
- [ ] 4 blocos prontos para os cartões
- [ ] Missão com 1 saída boa e 2 plausíveis e erradas
- [ ] Tradução conferida por alguém que não escreveu o original
- [ ] Camada de cada sotaque: troca de palavra, traço de som, expressão local
- [ ] Revisão por nativo de cada sotaque
- [ ] Áudio gerado ou gravado, ouvido do começo ao fim antes de publicar


---

## 8. Onde cada coisa mora

| O quê | Onde | Por quê |
|---|---|---|
| Texto das situações: diálogo, frases, chunks, missão | `conteudo/situacoes.js` | Viaja com o app: abre offline, sem custo de banda, sem espera |
| Camada de cada sotaque: troca, som, expressão | `conteudo/situacoes.js`, no objeto `VARIANTES` | Mesma razão, e fica ao lado da situação que ela modifica |
| Áudio | Embutido no `index.html` pelo gerador | Toca instantâneo e funciona sem rede |
| Índice das situações: id, título, categoria, nível | Supabase, tabela `occasions` | Permite relatório e ligar/desligar situação sem republicar o app |
| Progresso da pessoa | Supabase, tabela `user_progress` | É o único dado que muda por usuário |

**Regra:** conteúdo é código, progresso é banco. Tudo que é igual para todo mundo viaja com o app e entra no Git; só o que é de cada pessoa vai para o servidor.

### Para escrever uma situação nova

1. Abra `conteudo/situacoes.js` e acrescente o objeto no array `SITUACOES` (ou tire o `emProducao: true` de uma que já está listada).
2. Se ela mudar em algum sotaque, acrescente a entrada em `VARIANTES[sotaque][situacao]`.
3. Rode `python3 build.py` para regenerar o `index.html`.
4. Gere o áudio das frases novas e acrescente ao `index.html`.
5. Acrescente a linha em `sql/seed-occasions.sql` e rode no Supabase.
6. Suba os arquivos e troque a versão no `sw.js`.

O passo 3 existe porque o `index.html` é **gerado**, nunca editado à mão. Editar os dois lugares é o caminho mais curto para eles discordarem entre si.
