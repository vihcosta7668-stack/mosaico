/**
 * situacoes.js — o conteúdo do Mosaico
 *
 * TRÊS EIXOS, e nunca se misturam:
 *
 *   SITUAÇÃO  o que se aprende .... escrita UMA vez, serve a todos os sotaques
 *   MÉTODO    como se aprende ..... as 6 etapas fixas de toda lição
 *   SOTAQUE   como aquilo soa ..... camada fina por cima: som, palavra local, expressão
 *
 * Por que assim: escrever 12 situações × 15 sotaques daria 180 lições para produzir.
 * Com a camada, são 12 lições + 15 camadas curtas. O mesmo conteúdo, um quinze avos
 * do trabalho — e quando você corrige uma frase, ela se corrige em todos os sotaques.
 *
 * As 6 etapas, e o método que cada uma aplica:
 *   1. Ouvir     → input compreensível (Krashen): diálogo com linha EN e linha PT
 *   2. Sotaque   → explicação guiada: os traços de som dentro DAQUELA situação
 *   3. Comparar  → discriminação auditiva: a mesma fala em dois sotaques
 *   4. Imitar    → shadowing: repetir junto, gravar, comparar
 *   5. Cartões   → repetição espaçada: os blocos prontos da situação
 *   6. Missão    → tarefa real (TBLT): resolver a situação sem ajuda
 */

/* ---------------------------------------------------------------- categorias */
export const CATEGORIAS = [
  { id: "viagem",  nome: "Viagem" },
  { id: "trabalho", nome: "Trabalho" },
  { id: "diaadia", nome: "Dia a dia" },
];

/* ---------------------------------------------------------------- situações
 * Campos:
 *   objetivo   o que a pessoa consegue fazer ao terminar (sempre um verbo de ação)
 *   dialogo    4 a 6 turnos, linguagem real, não de livro didático
 *   chave      frases que valem decorar como bloco inteiro
 *   chunks     pedaços prontos para os cartões
 *   missao     uma decisão com 3 saídas: 1 boa, 2 plausíveis e erradas
 */
export const SITUACOES = [
{
  id: "restaurante", cat: "viagem", nivel: "A2", titulo: "No restaurante",
  objetivo: "Pedir, tirar dúvida sobre um prato e fechar a conta sem travar.",
  dialogo: [
    { q: "garçom", en: "Evening. Are you ready to order?", pt: "Boa noite. Já escolheram?" },
    { q: "você",   en: "Almost. What's the soup of the day?", pt: "Quase. Qual é a sopa do dia?" },
    { q: "garçom", en: "Leek and potato. It comes with bread.", pt: "Alho-poró com batata. Vem com pão." },
    { q: "você",   en: "I'll have that, and a sparkling water.", pt: "Vou querer, e uma água com gás." },
    { q: "garçom", en: "Anything else for you?", pt: "Mais alguma coisa?" },
    { q: "você",   en: "That's it for now, thanks.", pt: "Por enquanto é isso, obrigada." },
  ],
  chave: [
    { en: "I'll have the soup, please.", pt: "Vou querer a sopa, por favor.", n: "“I'll have” é como se pede: mais natural que “I want”" },
    { en: "What do you recommend?", pt: "O que você recomenda?", n: "resolve qualquer cardápio incompreensível" },
    { en: "Could we get the bill, please?", pt: "Pode trazer a conta, por favor?", n: "a palavra para “conta” muda de país para país" },
    { en: "Is there anything without dairy?", pt: "Tem alguma coisa sem leite?", n: "troque “dairy” pelo que você não come" },
  ],
  chunks: [
    { en: "I'll have…", pt: "vou querer…" },
    { en: "for starters", pt: "de entrada" },
    { en: "to go / takeaway", pt: "para viagem" },
    { en: "that's it for now", pt: "por enquanto é isso" },
  ],
  missao: {
    cena: "O garçom pergunta se está tudo bem com a comida, mas seu prato veio frio.",
    fala: "How's everything tasting?",
    ops: [
      ["Sorry, could you heat this up? It came out cold.", true, "Educado e resolve o problema."],
      ["It's bad. Change it.", false, "Direto demais: soa agressivo em inglês."],
      ["Yes, fine, thank you.", false, "Você some com o problema e come frio."],
    ],
  },
},
{
  id: "aeroporto", cat: "viagem", nivel: "A2", titulo: "No aeroporto",
  objetivo: "Fazer check-in, entender o que o agente pergunta e resolver bagagem.",
  dialogo: [
    { q: "agente", en: "Good morning. Passport and booking, please.", pt: "Bom dia. Passaporte e reserva, por favor." },
    { q: "você",   en: "Here you go. I'm checking one bag.", pt: "Aqui está. Vou despachar uma mala." },
    { q: "agente", en: "Did you pack the bag yourself?", pt: "Você mesma fez a mala?" },
    { q: "você",   en: "Yes, I did.", pt: "Sim, eu mesma." },
    { q: "agente", en: "You're at gate twelve, boarding at ten past six.", pt: "Portão doze, embarque às seis e dez." },
    { q: "você",   en: "Sorry, which gate was that?", pt: "Desculpe, qual portão?" },
  ],
  chave: [
    { en: "I'm checking one bag.", pt: "Vou despachar uma mala.", n: "check in a bag = despachar; carry-on = bagagem de mão" },
    { en: "Sorry, could you say that again?", pt: "Desculpe, pode repetir?", n: "a frase mais útil de todas as que existem" },
    { en: "Is the flight on time?", pt: "O voo está no horário?", n: "delayed = atrasado" },
    { en: "Where do I pick up my luggage?", pt: "Onde eu pego minha bagagem?", n: "baggage claim = esteira de bagagem" },
  ],
  chunks: [
    { en: "here you go", pt: "aqui está" },
    { en: "carry-on", pt: "bagagem de mão" },
    { en: "boarding pass", pt: "cartão de embarque" },
    { en: "running late", pt: "atrasada" },
  ],
  missao: {
    cena: "No embarque, o agente fala rápido e você não entendeu o número do portão.",
    fala: "You'll be boarding at gate B fourteen, just past security.",
    ops: [
      ["Sorry, gate B fourteen? Could you repeat that?", true, "Repete o que entendeu e confirma: é assim que se faz."],
      ["Yes, okay, thank you.", false, "Você vai acabar no portão errado."],
      ["I don't speak English.", false, "Fecha a conversa e não resolve nada."],
    ],
  },
},
{
  id: "reuniao", cat: "trabalho", nivel: "B1", titulo: "Reunião online",
  objetivo: "Entrar na conversa, discordar com educação e remarcar quando precisar.",
  dialogo: [
    { q: "colega", en: "Can everyone hear me alright?", pt: "Todo mundo está me ouvindo bem?" },
    { q: "você",   en: "Loud and clear. Go ahead.", pt: "Perfeitamente. Pode seguir." },
    { q: "colega", en: "So we're pushing the deadline to Friday.", pt: "Então vamos empurrar o prazo para sexta." },
    { q: "você",   en: "Can I jump in? Friday is tight on our side.", pt: "Posso entrar aqui? Sexta é apertado do nosso lado." },
    { q: "colega", en: "Fair enough. What works for you?", pt: "Faz sentido. O que funciona para você?" },
    { q: "você",   en: "Monday would give us room to test.", pt: "Segunda nos daria espaço para testar." },
  ],
  chave: [
    { en: "Can I jump in here?", pt: "Posso entrar aqui?", n: "o jeito natural de pedir a palavra sem interromper mal" },
    { en: "Just to make sure I understood…", pt: "Só para eu confirmar se entendi…", n: "salva qualquer mal-entendido de call" },
    { en: "That's tight on our side.", pt: "Isso está apertado do nosso lado.", n: "discorda sem dizer “no”" },
    { en: "Let's take that offline.", pt: "Vamos tratar isso separado depois.", n: "tira um assunto longo da reunião" },
  ],
  chunks: [
    { en: "loud and clear", pt: "ouvindo perfeitamente" },
    { en: "fair enough", pt: "faz sentido, tudo bem" },
    { en: "what works for you?", pt: "o que funciona para você?" },
    { en: "circle back", pt: "retomar depois" },
  ],
  missao: {
    cena: "Pedem um prazo que você sabe que não dá. Você precisa discordar sem fechar a porta.",
    fala: "Could you have it ready by Wednesday?",
    ops: [
      ["Wednesday is tight. Could we do Friday and keep the scope?", true, "Discorda, explica e oferece saída."],
      ["No, impossible.", false, "Em inglês isso soa bem mais duro do que em português."],
      ["Yes, no problem.", false, "Você compra um prazo que não vai cumprir."],
    ],
  },
},
/* --- em produção: a estrutura já prevê, o conteúdo ainda está sendo escrito --- */
{ id: "hotel",     cat: "viagem",   nivel: "A2", titulo: "No hotel",            emProducao: true },
{ id: "transporte",cat: "viagem",   nivel: "A2", titulo: "Transporte urbano",   emProducao: true },
{ id: "compras",   cat: "viagem",   nivel: "A2", titulo: "Compras",             emProducao: true },
{ id: "telefone",  cat: "trabalho", nivel: "B1", titulo: "Telefonema difícil",  emProducao: true },
{ id: "entrevista",cat: "trabalho", nivel: "B1", titulo: "Entrevista de emprego",emProducao: true },
{ id: "apresentar",cat: "trabalho", nivel: "B2", titulo: "Apresentar um projeto",emProducao: true },
{ id: "direcoes",  cat: "diaadia",  nivel: "A1", titulo: "Pedir informação",    emProducao: true },
{ id: "conversa",  cat: "diaadia",  nivel: "A2", titulo: "Conversa curta",      emProducao: true },
{ id: "farmacia",  cat: "diaadia",  nivel: "A2", titulo: "Farmácia e saúde",    emProducao: true },
];

/* ------------------------------------------------------------ camada de sotaque
 * Só o que MUDA naquela situação, naquele lugar:
 *   troca  palavra ou frase diferente da forma padrão (o que mais confunde na vida real)
 *   som    traço de pronúncia que aparece justamente nessas frases
 *   expr   expressão local que um nativo usaria ali
 * Sotaque sem camada escrita usa a forma padrão e o app avisa: "variações em pesquisa".
 */
export const VARIANTES = {
  "us-geral": {
    restaurante: {
      troca: [{ padrao: "Could we get the bill, please?", local: "Could we get the check, please?", pt: "Pode trazer a conta?", n: "nos EUA é check; bill soa britânico" },
              { padrao: "to go / takeaway", local: "to go", pt: "para viagem", n: "takeaway é britânico" }],
      som: "O T de “water” e “tasting” vira um D rápido: “uórer”, “têisding”.",
      expr: [{ en: "How's everything tasting?", pt: "Está tudo bom? (pergunta padrão do garçom)" }],
    },
    aeroporto: { troca: [{ padrao: "Where do I pick up my luggage?", local: "Where's baggage claim?", pt: "Onde é a esteira de bagagem?", n: "baggage claim é a placa que você vai ver" }],
      som: "“Twenty” costuma sair “tuêni”: o T depois do N some.", expr: [{ en: "carry-on", pt: "bagagem de mão" }] },
    reuniao: { troca: [], som: "“Deadline” e “Friday” com o R bem marcado.", expr: [{ en: "touch base", pt: "dar um alô, alinhar rapidinho" }] },
  },
  "uk-rp": {
    restaurante: {
      troca: [{ padrao: "Could we get the bill, please?", local: "Could we have the bill, please?", pt: "Pode trazer a conta?", n: "no Reino Unido é bill, e “have” soa mais educado que “get”" },
              { padrao: "Is there anything without dairy?", local: "Have you got anything without dairy?", pt: "Tem algo sem leite?", n: "“have you got” é a forma britânica" }],
      som: "“Water” com T seco e sem R no fim: “uóta”. “Starters” vira “státa-s”.",
      expr: [{ en: "Are you still working on that?", pt: "(não se usa aqui) — no Reino Unido: “Have you finished?”" }],
    },
    aeroporto: { troca: [{ padrao: "I'm checking one bag.", local: "I've got one bag to check in.", pt: "Tenho uma mala para despachar.", n: "“have got” de novo" }],
      som: "“Gate” e “eight” com vogal fechada; “past” com A longo: “pást”.", expr: [{ en: "queue", pt: "fila (nos EUA seria line)" }] },
    reuniao: { troca: [], som: "“Schedule” costuma sair “chédiul”, não “skédul”.", expr: [{ en: "Shall we make a start?", pt: "Vamos começar?" }] },
  },
  "ie": {
    restaurante: {
      troca: [{ padrao: "That's it for now, thanks.", local: "That's grand, thanks.", pt: "Tá ótimo, obrigada.", n: "grand na Irlanda = tudo certo" }],
      som: "O TH de “thanks” e “anything” vira T: “tanks”, “anyting”.",
      expr: [{ en: "grand", pt: "ótimo, tudo certo" }, { en: "What's the craic?", pt: "E aí, quais as novidades?" }],
    },
    aeroporto: { troca: [], som: "“Three” soa “tree”: cuidado ao confirmar número de portão.", expr: [{ en: "your man", pt: "aquele cara ali" }] },
    reuniao: { troca: [], som: "O R aparece no fim das palavras, diferente do britânico.", expr: [{ en: "I'm after sending it", pt: "Acabei de enviar" }] },
  },
  "au": {
    restaurante: {
      troca: [{ padrao: "Could we get the bill, please?", local: "Could we get the bill when you're ready?", pt: "Pode trazer a conta quando puder?", n: "na Austrália é bill, e o tom é mais informal" }],
      som: "“Day” e “mate” com o ditongo bem aberto, quase “dai”.",
      expr: [{ en: "no worries", pt: "sem problema" }, { en: "cheers", pt: "valeu" }],
    },
    aeroporto: { troca: [], som: "Frases afirmativas podem subir no fim, sem ser pergunta.", expr: [{ en: "arvo", pt: "tarde" }] },
    reuniao: { troca: [], som: "Palavras encurtadas: “afternoon” vira “arvo” até em contexto de trabalho.", expr: [{ en: "good on ya", pt: "mandou bem" }] },
  },
  "sco": {
    restaurante: {
      troca: [{ padrao: "I'll have the soup, please.", local: "I'll take the soup, please.", pt: "Vou querer a sopa.", n: "“take” é comum na Escócia" }],
      som: "O R é batido, como em “caro”: “starters”, “water”.",
      expr: [{ en: "wee", pt: "pequeno (aparece o tempo todo)" }, { en: "aye", pt: "sim" }],
    },
    aeroporto: { troca: [], som: "“Gate” com vogal pura, sem ditongo.", expr: [{ en: "cheers, aye", pt: "valeu" }] },
    reuniao: { troca: [], som: "Ritmo mais rápido e R batido em “Friday”, “ready”.", expr: [{ en: "I'm needing…", pt: "Estou precisando… (forma escocesa)" }] },
  },
};

/** Conteúdo pronto de uma situação para um sotaque, já com a camada aplicada. */
export function montar(situacaoId, sotaqueId) {
  const base = SITUACOES.find((s) => s.id === situacaoId);
  if (!base || base.emProducao) return null;
  const v = (VARIANTES[sotaqueId] || {})[situacaoId] || null;
  const trocar = (en) => {
    const t = v && (v.troca || []).find((x) => x.padrao === en);
    return t ? { en: t.local, trocado: t } : { en, trocado: null };
  };
  return {
    ...base,
    variantes: v,
    temCamada: !!v,
    chave: base.chave.map((f) => { const r = trocar(f.en); return { ...f, en: r.en, trocado: r.trocado }; }),
    chunks: base.chunks.map((c) => { const r = trocar(c.en); return { ...c, en: r.en }; }),
    expr: (v && v.expr) || [],
  };
}
