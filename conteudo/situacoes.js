/**
 * situacoes.js — o conteúdo do Mosaico (12 situações completas)
 *
 * TRÊS EIXOS, e nunca se misturam:
 *   SITUAÇÃO  o que se aprende .... escrita UMA vez, serve a todos os sotaques
 *   MÉTODO    como se aprende ..... as 6 etapas fixas de toda lição
 *   SOTAQUE   como aquilo soa ..... camada fina por cima: som, palavra local, expressão
 *
 * Cada situação tem um BANCO de 3 missões (campo `missoes`). A etapa Missão
 * sorteia uma a cada abertura da lição — por isso a mesma situação não repete
 * sempre o mesmo cenário. A função embaralhar() também randomiza a ordem das
 * opções de resposta, a frase e os dois traços usados no Comparar, e a ordem
 * dos cartões — nada aparece sempre na mesma posição.
 */

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
  missoes: [
    { cena: "O garçom pergunta se está tudo bem com a comida, mas seu prato veio frio.",
      fala: "How's everything tasting?",
      ops: [["Sorry, could you heat this up? It came out cold.", true, "Educado e resolve o problema."],
            ["It's bad. Change it.", false, "Direto demais: soa agressivo em inglês."],
            ["Yes, fine, thank you.", false, "Você some com o problema e come frio."]] },
    { cena: "Você pediu a carne bem passada, mas ela veio mal passada.",
      fala: "Is everything okay with your meal?",
      ops: [["Actually, I ordered this well done — could you fix it?", true, "Nomeia o pedido original e pede a correção, sem drama."],
            ["No.", false, "Não dá informação nenhuma para o garçom resolver."],
            ["It's fine, don't worry.", false, "Você aceita um prato que não pediu."]] },
    { cena: "A conta chegou com um item que vocês não pediram.",
      fala: "Here's your bill, whenever you're ready.",
      ops: [["I think there's a mistake — we didn't order this.", true, "Aponta o erro com calma, sem acusar."],
            ["This is wrong!", false, "Soa como bronca, não como correção."],
            ["Okay, thanks.", false, "Você paga por algo que não pediu."]] },
  ],
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
  missoes: [
    { cena: "No embarque, o agente fala rápido e você não entendeu o número do portão.",
      fala: "You'll be boarding at gate B fourteen, just past security.",
      ops: [["Sorry, gate B fourteen? Could you repeat that?", true, "Repete o que entendeu e confirma: é assim que se faz."],
            ["Yes, okay, thank you.", false, "Você vai acabar no portão errado."],
            ["I don't speak English.", false, "Fecha a conversa e não resolve nada."]] },
    { cena: "Sua mala não apareceu na esteira depois de 20 minutos.",
      fala: "Can I help you with something?",
      ops: [["Yes, my bag hasn't come out. Could you check for me?", true, "Explica o problema e pede ajuda de forma direta."],
            ["My bag is lost, this is terrible.", false, "Desabafa em vez de pedir ajuda concreta."],
            ["No, it's fine.", false, "Você vai embora sem resolver."]] },
    { cena: "O agente pergunta se você tem algo a declarar na alfândega.",
      fala: "Do you have anything to declare?",
      ops: [["No, just personal items.", true, "Resposta padrão, direta e verdadeira."],
            ["I don't know what that means.", false, "Trava a fila e não responde à pergunta."],
            ["Maybe.", false, "Deixa a resposta em aberto e gera mais perguntas."]] },
  ],
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
  missoes: [
    { cena: "Pedem um prazo que você sabe que não dá. Você precisa discordar sem fechar a porta.",
      fala: "Could you have it ready by Wednesday?",
      ops: [["Wednesday is tight. Could we do Friday and keep the scope?", true, "Discorda, explica e oferece saída."],
            ["No, impossible.", false, "Em inglês isso soa bem mais duro do que em português."],
            ["Yes, no problem.", false, "Você compra um prazo que não vai cumprir."]] },
    { cena: "Alguém propõe uma solução que você acha arriscada, mas o time parece animado.",
      fala: "So, are we all aligned on this approach?",
      ops: [["Mostly — can I flag one risk before we lock it in?", true, "Concorda em geral, mas levanta o ponto sem travar tudo."],
            ["I don't like this.", false, "Vago e sem justificativa: soa como birra."],
            ["Sure, sounds great.", false, "Você esconde uma preocupação real."]] },
    { cena: "Você entrou atrasada na call e perdeu o começo da explicação.",
      fala: "...and that's why we're moving the launch.",
      ops: [["Sorry I'm late — could you recap the launch decision?", true, "Assume o atraso e pede o resumo, sem enrolar."],
            ["What are you talking about?", false, "Soa como se estivesse questionando a decisão do grupo."],
            ["(fica calada e tenta adivinhar)", false, "Você segue a reunião sem entender metade do que foi decidido."]] },
  ],
},
{
  id: "hotel", cat: "viagem", nivel: "A2", titulo: "No hotel",
  objetivo: "Fazer check-in, pedir algo que falta no quarto e resolver um problema na conta.",
  dialogo: [
    { q: "recepção", en: "Welcome. Do you have a reservation?", pt: "Bem-vinda. Você tem uma reserva?" },
    { q: "você",     en: "Yes, under Oliveira. Two nights.", pt: "Sim, no nome Oliveira. Duas noites." },
    { q: "recepção", en: "Great. Could I see your ID and a card?", pt: "Ótimo. Posso ver seu documento e um cartão?" },
    { q: "você",     en: "Sure. Also, is breakfast included?", pt: "Claro. Também, o café da manhã está incluso?" },
    { q: "recepção", en: "It is, from seven to ten.", pt: "Está, das sete às dez." },
    { q: "você",     en: "Perfect, thank you.", pt: "Perfeito, obrigada." },
  ],
  chave: [
    { en: "I have a reservation under…", pt: "Tenho uma reserva no nome de…", n: "a forma padrão de começar o check-in" },
    { en: "Is breakfast included?", pt: "O café da manhã está incluso?", n: "pergunta que vale sempre fazer" },
    { en: "Could I get a late check-out?", pt: "Dá para eu fazer check-out mais tarde?", n: "nem sempre é grátis, mas custa perguntar" },
    { en: "The Wi-Fi isn't working in my room.", pt: "O Wi-Fi não está funcionando no meu quarto.", n: "o problema mais comum de hotel" },
  ],
  chunks: [
    { en: "under the name…", pt: "no nome de…" },
    { en: "check-in / check-out", pt: "entrada / saída" },
    { en: "do not disturb", pt: "não perturbe" },
    { en: "front desk", pt: "recepção" },
  ],
  missoes: [
    { cena: "Você chega ao quarto e a torneira não para de pingar, e não tem toalha extra.",
      fala: "Front desk, how can I help?",
      ops: [["Hi, my room's faucet is leaking and I need extra towels.", true, "Descreve os dois problemas de forma clara e objetiva."],
            ["Your hotel is bad.", false, "Reclamação genérica: não diz o que precisa ser resolvido."],
            ["Never mind.", false, "Você desiste e fica sem toalha."]] },
      { cena: "Você quer sair do quarto às 14h, mas o check-out padrão é ao meio-dia.",
      fala: "Checking out already?",
      ops: [["Not yet — could I get a late check-out until 2pm?", true, "Pede exatamente o que precisa, com o horário."],
            ["I want to stay longer.", false, "Vago: não diz até que horas."],
            ["What time is check-out?", false, "Pergunta o óbvio em vez de pedir a exceção."]] },
    { cena: "A conta final tem uma taxa de minibar que você não usou.",
      fala: "Here's your final bill.",
      ops: [["I think there's a minibar charge here I didn't use.", true, "Aponta o item específico com educação."],
            ["This bill is wrong.", false, "Não diz qual item está errado."],
            ["Okay.", false, "Você paga por algo que não consumiu."]] },
  ],
},
{
  id: "transporte", cat: "viagem", nivel: "A2", titulo: "Transporte urbano",
  objetivo: "Comprar passagem, confirmar a parada certa e agir quando perder a conexão.",
  dialogo: [
    { q: "você",     en: "Does this bus go downtown?", pt: "Esse ônibus vai para o centro?" },
    { q: "motorista",en: "Yes, get off at the third stop.", pt: "Vai, desça na terceira parada." },
    { q: "você",     en: "How much is the fare?", pt: "Quanto custa a passagem?" },
    { q: "motorista",en: "Two fifty. Card or cash?", pt: "Dois e cinquenta. Cartão ou dinheiro?" },
    { q: "você",     en: "Card, please.", pt: "Cartão, por favor." },
  ],
  chave: [
    { en: "Does this go to…?", pt: "Isso vai para…?", n: "funciona para ônibus, trem, metrô" },
    { en: "Which stop should I get off at?", pt: "Em qual parada eu desço?", n: "pergunta antes de embarcar, evita perder o ponto" },
    { en: "I think I missed my stop.", pt: "Acho que perdi minha parada.", n: "frase de socorro que resolve o resto" },
    { en: "Is this seat taken?", pt: "Esse lugar está ocupado?", n: "educado e direto" },
  ],
  chunks: [
    { en: "get off at…", pt: "descer em…" },
    { en: "one-way ticket", pt: "passagem de ida" },
    { en: "next stop", pt: "próxima parada" },
    { en: "connecting to…", pt: "fazendo conexão para…" },
  ],
  missoes: [
    { cena: "Você percebe que passou da sua parada e o ônibus continua andando.",
      fala: "Next stop, Fifth Avenue.",
      ops: [["Excuse me, I think I missed my stop — what should I do?", true, "Explica a situação e pede orientação."],
            ["Stop the bus!", false, "Soa como emergência quando não é."],
            ["(desce sem falar nada e se perde)", false, "Você resolve sozinha, sem ajuda, e pode piorar a situação."]] },
    { cena: "A máquina de cartão do ônibus não aceita seu cartão.",
      fala: "Card or cash?",
      ops: [["My card isn't going through — do you take cash?", true, "Explica o problema e pergunta a alternativa."],
            ["It's not working.", false, "Não deixa claro o que você precisa agora."],
            ["(fica parada sem pagar)", false, "Atrasa todo mundo sem resolver nada."]] },
    { cena: "Você não tem certeza se esse é o trem certo para o aeroporto.",
      fala: "All aboard!",
      ops: [["Wait — does this train go to the airport?", true, "Confirma antes de embarcar no trem errado."],
            ["Is this the airport?", false, "Pergunta errada: o trem ainda não chegou."],
            ["(embarca sem perguntar)", false, "Risco real de pegar o trem errado."]] },
  ],
},
{
  id: "compras", cat: "viagem", nivel: "A2", titulo: "Compras",
  objetivo: "Perguntar tamanho e preço, pedir para trocar e devolver um produto com defeito.",
  dialogo: [
    { q: "vendedor", en: "Can I help you find anything?", pt: "Posso ajudar a encontrar algo?" },
    { q: "você",     en: "Yes, do you have this in a medium?", pt: "Sim, tem isso em tamanho médio?" },
    { q: "vendedor", en: "Let me check in the back.", pt: "Deixa eu ver no estoque." },
    { q: "você",     en: "Thanks. Also, is this on sale?", pt: "Obrigada. Também, isso está em promoção?" },
    { q: "vendedor", en: "It is, twenty percent off.", pt: "Está, vinte por cento de desconto." },
  ],
  chave: [
    { en: "Do you have this in a size…?", pt: "Tem isso no tamanho…?", n: "troque o número ou P/M/G pelo seu" },
    { en: "How much is this?", pt: "Quanto custa isso?", n: "a pergunta mais básica e mais usada" },
    { en: "Can I return this if it doesn't fit?", pt: "Posso devolver se não servir?", n: "pergunte antes de comprar" },
    { en: "This is defective — can I exchange it?", pt: "Isso veio com defeito — posso trocar?", n: "frase de reclamação educada" },
  ],
  chunks: [
    { en: "on sale", pt: "em promoção" },
    { en: "try it on", pt: "experimentar" },
    { en: "receipt", pt: "nota, recibo" },
    { en: "refund", pt: "reembolso" },
  ],
  missoes: [
    { cena: "A blusa que você comprou ontem veio com um furo, e você quer trocar.",
      fala: "Hi, how can I help you today?",
      ops: [["Hi, this shirt has a hole — could I exchange it?", true, "Mostra o problema e pede a solução direta."],
            ["This is broken.", false, "Vago: “broken” não é bem o termo para tecido."],
            ["I don't want this anymore.", false, "Não menciona o defeito, parece arrependimento de compra."]] },
    { cena: "Você experimentou uma calça e o tamanho médio ficou apertado.",
      fala: "How did that fit?",
      ops: [["A bit tight — do you have a large?", true, "Dá o feedback exato e pede o próximo passo."],
            ["No.", false, "Não diz o que precisa mudar."],
            ["It's fine.", false, "Você compra algo que não serve direito."]] },
    { cena: "Você quer saber se pode parcelar a compra.",
      fala: "That'll be eighty dollars.",
      ops: [["Can I pay that in installments?", true, "Pergunta direto sobre a forma de pagamento."],
            ["Is that expensive?", false, "Não é uma pergunta útil para o vendedor responder."],
            ["(paga tudo sem perguntar)", false, "Perde a chance de parcelar, se existir a opção."]] },
  ],
},
{
  id: "telefone", cat: "trabalho", nivel: "B1", titulo: "Telefonema difícil",
  objetivo: "Atender uma ligação de trabalho, pedir para repetir e lidar com má conexão.",
  dialogo: [
    { q: "cliente", en: "Hi, is this a good time to talk?", pt: "Oi, é um bom momento para falar?" },
    { q: "você",    en: "Sure, go ahead.", pt: "Claro, pode falar." },
    { q: "cliente", en: "We're not happy with the delivery delay.", pt: "Não estamos satisfeitos com o atraso na entrega." },
    { q: "você",    en: "I understand. Let me check what happened.", pt: "Eu entendo. Deixa eu verificar o que aconteceu." },
    { q: "cliente", en: "Please call me back by end of day.", pt: "Por favor, me retorne até o fim do dia." },
  ],
  chave: [
    { en: "Is this a good time to talk?", pt: "É um bom momento para falar?", n: "abre a ligação sem invadir" },
    { en: "You're breaking up a little.", pt: "Sua ligação está cortando um pouco.", n: "diz isso em vez de fingir que entendeu" },
    { en: "Let me call you right back.", pt: "Deixa eu te ligar de volta.", n: "ganha tempo sem parecer que está fugindo" },
    { en: "I'll follow up by email.", pt: "Vou confirmar por e-mail.", n: "fecha a ligação com um próximo passo claro" },
  ],
  chunks: [
    { en: "hold on a second", pt: "espera um segundo" },
    { en: "let me put you on speaker", pt: "deixa eu colocar no viva-voz" },
    { en: "I'll get back to you", pt: "eu te retorno" },
    { en: "bad signal", pt: "sinal ruim" },
  ],
  missoes: [
    { cena: "A ligação está cortando e você perdeu metade do que o cliente disse.",
      fala: "...so as I was saying, the *crackle* delivery was *crackle* three days late.",
      ops: [["Sorry, you're breaking up — could you say that again?", true, "Avisa do problema técnico e pede para repetir."],
            ["Yes, I agree completely.", false, "Você concorda sem saber com o quê."],
            ["(finge que entendeu e desliga)", false, "Você perde uma reclamação importante do cliente."]] },
    { cena: "O cliente pede uma resposta que você não tem agora.",
      fala: "So, can you confirm the refund today?",
      ops: [["I need to check with my team — I'll call you back by 5pm.", true, "Não promete o que não pode cumprir, e dá um prazo."],
            ["Yes, sure.", false, "Você promete algo que talvez não consiga entregar."],
            ["I don't know.", false, "Deixa o cliente sem nenhum próximo passo."]] },
    { cena: "Você está no meio de outra coisa quando o telefone toca.",
      fala: "Hi, is this a good time to talk?",
      ops: [["Actually, could I call you back in ten minutes?", true, "Adia com educação, sem ignorar a ligação."],
            ["No.", false, "Seco demais, sem alternativa."],
            ["(atende e some no meio da ligação)", false, "Passa a impressão de descaso com o cliente."]] },
  ],
},
{
  id: "entrevista", cat: "trabalho", nivel: "B1", titulo: "Entrevista de emprego",
  objetivo: "Falar da própria experiência, responder sobre pontos fracos e negociar salário.",
  dialogo: [
    { q: "entrevistador", en: "Tell me a bit about your background.", pt: "Me conta um pouco da sua trajetória." },
    { q: "você",          en: "I've worked in reliability engineering for six years.", pt: "Trabalho com engenharia de confiabilidade há seis anos." },
    { q: "entrevistador", en: "What's a challenge you've faced recently?", pt: "Qual foi um desafio recente?" },
    { q: "você",          en: "Leading a team through a tight deadline.", pt: "Liderar um time num prazo apertado." },
    { q: "entrevistador", en: "Do you have any questions for us?", pt: "Você tem alguma pergunta para nós?" },
  ],
  chave: [
    { en: "I've worked in… for … years.", pt: "Trabalho com… há … anos.", n: "abre qualquer resposta sobre experiência" },
    { en: "One area I'm working on is…", pt: "Uma área que estou desenvolvendo é…", n: "responde “ponto fraco” sem se sabotar" },
    { en: "Could you tell me more about the team?", pt: "Pode me contar mais sobre o time?", n: "pergunta segura para o final" },
    { en: "What's the salary range for this role?", pt: "Qual é a faixa salarial da vaga?", n: "pergunta direto, sem rodeio" },
  ],
  chunks: [
    { en: "my background", pt: "minha trajetória" },
    { en: "a challenge I faced", pt: "um desafio que enfrentei" },
    { en: "I'm open to…", pt: "estou aberta a…" },
    { en: "next steps", pt: "próximos passos" },
  ],
  missoes: [
    { cena: "Perguntam qual é o seu maior ponto fraco.",
      fala: "What would you say is your biggest weakness?",
      ops: [["I sometimes take on too much — I'm working on delegating more.", true, "Honesto e mostra que está trabalhando nisso."],
            ["I don't have any weaknesses.", false, "Soa falso e pouco autoconsciente."],
            ["I'm bad at everything.", false, "Exagero que passa insegurança, não honestidade."]] },
    { cena: "O recrutador pergunta sua pretensão salarial.",
      fala: "What are your salary expectations?",
      ops: [["I'm looking at something in the range of X to Y.", true, "Dá uma faixa, mostra que pesquisou."],
            ["Whatever you think is fair.", false, "Perde a chance de ancorar a negociação."],
            ["I don't want to say.", false, "Pode soar evasivo demais."]] },
    { cena: "Chegou a hora de você fazer perguntas, e a mente ficou em branco.",
      fala: "Do you have any questions for us?",
      ops: [["Yes — what does success look like in this role after six months?", true, "Pergunta que mostra interesse real na vaga."],
            ["No, not really.", false, "Perde a chance de mostrar interesse."],
            ["How many vacation days do I get?", false, "Não é errado, mas é cedo demais para essa pergunta."]] },
  ],
},
{
  id: "apresentar", cat: "trabalho", nivel: "B2", titulo: "Apresentar um projeto",
  objetivo: "Abrir uma apresentação, lidar com uma pergunta difícil e fechar com um pedido claro.",
  dialogo: [
    { q: "você",   en: "Thanks for joining. I'll walk you through the results.", pt: "Obrigada por vir. Vou apresentar os resultados." },
    { q: "colega", en: "Sounds good, go ahead.", pt: "Beleza, pode seguir." },
    { q: "você",   en: "We reduced downtime by eighteen percent.", pt: "Reduzimos o tempo parado em dezoito por cento." },
    { q: "colega", en: "How confident are you in that number?", pt: "Quão confiante você está nesse número?" },
    { q: "você",   en: "Fairly — it's based on three months of data.", pt: "Bastante — é baseado em três meses de dados." },
  ],
  chave: [
    { en: "I'll walk you through…", pt: "Vou apresentar…", n: "abertura clássica de apresentação" },
    { en: "The key takeaway here is…", pt: "O ponto principal aqui é…", n: "usa antes de qualquer gráfico importante" },
    { en: "That's a fair question.", pt: "É uma pergunta justa.", n: "ganha tempo para pensar sem parecer despreparada" },
    { en: "What I'd like from this group is…", pt: "O que eu gostaria deste grupo é…", n: "fecha a apresentação com um pedido claro" },
  ],
  chunks: [
    { en: "walk you through", pt: "apresentar passo a passo" },
    { en: "key takeaway", pt: "ponto principal" },
    { en: "next slide, please", pt: "próximo slide, por favor" },
    { en: "happy to take questions", pt: "aberta a perguntas" },
  ],
  missoes: [
    { cena: "Alguém questiona um número que você não tem 100% de certeza.",
      fala: "Are you sure that number is accurate?",
      ops: [["That's a fair question — I'll confirm and follow up by email.", true, "Não inventa uma resposta e promete confirmar."],
            ["Yes, absolutely certain.", false, "Arriscado se não for mesmo verdade."],
            ["I'm not sure, sorry.", false, "Deixa a plateia sem nenhum próximo passo."]] },
    { cena: "A apresentação está atrasada e ainda faltam três slides.",
      fala: "We only have five more minutes.",
      ops: [["Let me jump to the key numbers and send the rest by email.", true, "Prioriza o essencial e resolve o resto depois."],
            ["(continua apresentando tudo do mesmo jeito)", false, "Corre o risco de ser interrompida no meio."],
            ["We're out of time, sorry.", false, "Encerra sem mostrar o que importava."]] },
    { cena: "Ninguém faz perguntas no fim, e o silêncio fica estranho.",
      fala: "(silêncio na sala)",
      ops: [["No questions? Happy to follow up individually if anything comes up.", true, "Fecha bem mesmo sem perguntas, deixando a porta aberta."],
            ["Okay, bye.", false, "Encerra seco demais para uma apresentação de trabalho."],
            ["(fica esperando em silêncio)", false, "Deixa a reunião constrangedora."]] },
  ],
},
{
  id: "direcoes", cat: "diaadia", nivel: "A1", titulo: "Pedir informação",
  objetivo: "Perguntar o caminho, entender a resposta e confirmar que entendeu certo.",
  dialogo: [
    { q: "você",   en: "Excuse me, how do I get to the train station?", pt: "Com licença, como eu chego na estação de trem?" },
    { q: "pessoa", en: "Go straight, then turn left at the light.", pt: "Vai reto, depois vira à esquerda no sinal." },
    { q: "você",   en: "Left at the light, got it. Is it far?", pt: "Esquerda no sinal, entendi. É longe?" },
    { q: "pessoa", en: "About ten minutes on foot.", pt: "Uns dez minutos a pé." },
    { q: "você",   en: "Great, thank you so much.", pt: "Ótimo, muito obrigada." },
  ],
  chave: [
    { en: "Excuse me, how do I get to…?", pt: "Com licença, como eu chego em…?", n: "abertura educada para qualquer pergunta na rua" },
    { en: "Is it far from here?", pt: "É longe daqui?", n: "pergunta o essencial antes de decidir ir a pé" },
    { en: "Sorry, could you repeat that?", pt: "Desculpe, pode repetir?", n: "sempre vale pedir de novo, sem vergonha" },
    { en: "So, left at the light — is that right?", pt: "Então, esquerda no sinal — é isso?", n: "confirmar em voz alta evita se perder" },
  ],
  chunks: [
    { en: "go straight", pt: "siga reto" },
    { en: "turn left / right", pt: "vire à esquerda / direita" },
    { en: "on foot", pt: "a pé" },
    { en: "it's right there", pt: "é bem ali" },
  ],
  missoes: [
    { cena: "A pessoa deu a direção rápido e você só entendeu metade.",
      fala: "Just go straight, past the bakery, then it's on your right, next to the pharmacy.",
      ops: [["Sorry, could you say that again, a bit slower?", true, "Pede exatamente o que precisa: mais devagar."],
            ["Okay, thanks!", false, "Você vai andar sem saber o caminho certo."],
            ["(sai andando na direção errada)", false, "Arrisca se perder de vez."]] },
    { cena: "Você quer confirmar se entendeu a direção antes de sair andando.",
      fala: "Turn left at the second light, you can't miss it.",
      ops: [["So, second light, turn left — did I get that right?", true, "Repete a instrução para confirmar antes de ir."],
            ["Okay.", false, "Não confirma, e pode ter entendido errado."],
            ["Where?", false, "Volta ao início sem mostrar o que já entendeu."]] },
    { cena: "Alguém te oferece ajuda antes mesmo de você perguntar.",
      fala: "You look lost — need any help?",
      ops: [["Yes, actually — I'm trying to find the museum.", true, "Aceita a ajuda e já diz para onde quer ir."],
            ["No, I'm fine.", false, "Recusa uma ajuda que você provavelmente precisa."],
            ["(ignora e continua andando)", false, "Perde uma ajuda gratuita por educação mal colocada."]] },
  ],
},
{
  id: "conversa", cat: "diaadia", nivel: "A2", titulo: "Conversa curta",
  objetivo: "Fazer small talk, mudar de assunto com naturalidade e encerrar a conversa.",
  dialogo: [
    { q: "pessoa", en: "Nice weather today, isn't it?", pt: "Tempo bom hoje, né?" },
    { q: "você",   en: "It really is. Are you from around here?", pt: "É mesmo. Você é daqui?" },
    { q: "pessoa", en: "No, just visiting for the week.", pt: "Não, só estou visitando essa semana." },
    { q: "você",   en: "Oh nice, how are you liking it?", pt: "Que legal, está gostando?" },
    { q: "pessoa", en: "Loving it so far.", pt: "Amando, até agora." },
  ],
  chave: [
    { en: "Are you from around here?", pt: "Você é daqui?", n: "abre qualquer small talk com estranho" },
    { en: "What brings you here?", pt: "O que te trouxe aqui?", n: "mais interessante que “o que você faz”" },
    { en: "Anyway, it was nice talking to you.", pt: "Enfim, foi legal falar com você.", n: "a frase que encerra qualquer conversa sem ser seca" },
    { en: "I should get going.", pt: "Eu já vou indo.", n: "sai de qualquer situação com educação" },
  ],
  chunks: [
    { en: "nice weather, isn't it?", pt: "tempo bom, né?" },
    { en: "what brings you here?", pt: "o que te trouxe aqui?" },
    { en: "small world!", pt: "mundo pequeno!" },
    { en: "take care!", pt: "se cuida!" },
  ],
  missoes: [
    { cena: "A conversa está ótima, mas você precisa ir embora agora.",
      fala: "So yeah, I've lived here my whole life.",
      ops: [["That's great — I should get going, but it was nice talking to you.", true, "Encerra com educação, reconhecendo a conversa."],
            ["Okay bye.", false, "Corta a conversa de forma seca."],
            ["(some sem dizer nada)", false, "Deixa a pessoa sem entender o que houve."]] },
    { cena: "Alguém pergunta o que você faz da vida, num contexto informal.",
      fala: "So, what do you do?",
      ops: [["I work in engineering — reliability, mostly. You?", true, "Responde e devolve a pergunta, mantendo a conversa."],
            ["Work stuff.", false, "Fecha a conversa em vez de continuá-la."],
            ["(muda de assunto sem responder)", false, "Soa estranho, como se estivesse evitando a pergunta."]] },
    { cena: "Um silêncio incômodo aparece no meio da conversa.",
      fala: "(silêncio)",
      ops: [["So, have you tried the food around here?", true, "Puxa um assunto leve e fácil de continuar."],
            ["(fica olhando para o celular)", false, "Encerra a conversa sem querer."],
            ["Well, this is awkward.", false, "Nomear o silêncio só o deixa mais estranho."]] },
  ],
},
{
  id: "farmacia", cat: "diaadia", nivel: "A2", titulo: "Farmácia e saúde",
  objetivo: "Descrever um sintoma, pedir um remédio comum e entender a dosagem.",
  dialogo: [
    { q: "você",      en: "Hi, do you have something for a headache?", pt: "Oi, tem alguma coisa para dor de cabeça?" },
    { q: "farmacêutico", en: "Sure, how bad is the pain?", pt: "Claro, a dor está forte?" },
    { q: "você",      en: "Mild, but it won't go away.", pt: "Leve, mas não passa." },
    { q: "farmacêutico", en: "Try this, one tablet every eight hours.", pt: "Tenta isso, um comprimido a cada oito horas." },
    { q: "você",      en: "Got it, thank you.", pt: "Entendi, obrigada." },
  ],
  chave: [
    { en: "Do you have something for…?", pt: "Tem alguma coisa para…?", n: "troque pelo sintoma: a headache, a cough, a fever" },
    { en: "How often should I take this?", pt: "Com que frequência eu tomo isso?", n: "pergunta essencial antes de sair da farmácia" },
    { en: "I'm allergic to…", pt: "Tenho alergia a…", n: "informação que sempre vale dar antes de comprar" },
    { en: "Is this safe to take with…?", pt: "É seguro tomar isso com…?", n: "para checar interação com outro remédio" },
  ],
  chunks: [
    { en: "over the counter", pt: "vendido sem receita" },
    { en: "on an empty stomach", pt: "em jejum" },
    { en: "side effects", pt: "efeitos colaterais" },
    { en: "it won't go away", pt: "não passa, não some" },
  ],
  missoes: [
    { cena: "Você não entendeu se o remédio é antes ou depois de comer.",
      fala: "Take one pill with food, twice a day.",
      ops: [["So, with food — does that mean during or right after the meal?", true, "Pede a precisão exata que falta."],
            ["Okay, thanks.", false, "Você pode tomar do jeito errado."],
            ["Got it.", false, "Mesma coisa: aceita sem ter certeza."]] },
    { cena: "Você quer um remédio, mas tem alergia a um componente comum.",
      fala: "This one works well for allergies.",
      ops: [["Good, but I'm allergic to ibuprofen — is this different?", true, "Avisa a alergia antes de comprar o produto errado."],
            ["Okay, I'll take it.", false, "Risco real se o remédio tiver o componente."],
            ["(não fala nada sobre a alergia)", false, "Pode gerar uma reação alérgica evitável."]] },
    { cena: "O farmacêutico pergunta se você toma outro medicamento.",
      fala: "Are you currently taking any other medication?",
      ops: [["Yes, I'm on blood pressure medication — is this safe with it?", true, "Informa o que toma e pergunta sobre interação."],
            ["No.", false, "Se não for verdade, pode causar um problema sério."],
            ["I don't remember.", false, "Deixa o farmacêutico sem informação para ajudar direito."]] },
  ],
},
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

export function embaralhar(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/** Conteúdo pronto de uma situação para um sotaque, já com a camada aplicada.
 * A missão é sorteada do banco a cada vez que a lição é aberta — nunca a mesma. */
export function montar(situacaoId, sotaqueId) {
  const base = SITUACOES.find((s) => s.id === situacaoId);
  if (!base) return null;
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
    missao: (base.missoes||[])[Math.floor(Math.random()*(base.missoes||[]).length)] || null,
  };
}
