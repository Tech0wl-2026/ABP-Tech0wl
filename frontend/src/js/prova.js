/* ============================================================
   questao.js — Prova de certificação (base)

   • uma pergunta por vez, com 150 s para responder
   • "Parar prova" abre uma confirmação: continuar ou parar
   • o progresso (pergunta atual, respostas e tempo restante) fica salvo
     no navegador: o aluno para e continua de onde parou
   • precisa do auth.js carregado antes (usuário logado)
   ============================================================ */

const HOME_URL       = "./home.html";       // para onde o aluno vai ao parar a prova
const RESULTADO_URL  = "./resultado.html";  // tela de aprovado/reprovado, aberta ao finalizar
const TEMPO_PERGUNTA = 150;            // segundos para cada pergunta
const MEDIA_MINIMA   = 65;             // % mínima para ser aprovado

/* ---------- PERGUNTAS ----------
   tema          módulo da apostila: scrum | kanban-xp | ferramentas | principios
   enunciado     texto ("**negrito**" e "\n" para quebrar linha)
   imagem        opcional: { src, alt }
   alternativas  sempre 4 (A, B, C, D)
   correta       posição da certa: 0 = A, 1 = B, 2 = C, 3 = D
   feedback      explicação mostrada ao parar a prova (para as perguntas já concluídas)
   (o gabarito foi marcado pela alternativa destacada em cada print: confira) */
const QUESTOES = [
  {
    tema: "scrum",
    enunciado: "**Uma equipe de produto trabalha em ciclos curtos: observa os resultados de cada ciclo e ajusta as próximas decisões com base no que aprendeu, em vez de tentar prever tudo no início. Segundo a apostila, essa forma de trabalhar se apoia no empirismo e em três pilares do Scrum. Quais são eles?**",
    imagem: { src: "src/images/questao-01.png", alt: "Trabalho em ciclos curtos: quatro Sprints em sequência, cada uma com “observar e ajustar”, e o produto evoluindo a cada ciclo." },
    alternativas: [
      "Compromisso, foco e respeito.",
      "Planejamento, execução e controle.",
      "Transparência, inspeção e adaptação.",
      "Papéis, eventos e artefatos.",
    ],
    correta: 2,
    feedback: "Os três pilares do empirismo no Scrum são transparência, inspeção e adaptação. Compromisso, foco, abertura, respeito e coragem são os valores do Scrum (alternativa A). Papéis, eventos e artefatos são elementos do framework, não seus pilares (alternativa D).",
  },
  {
    tema: "scrum",
    enunciado: "Em uma Scrum Team surgem três situações:\n\n**(I)** decidir qual item deve ocupar o topo do Product Backlog;\n\n**(II)** decidir como organizar o trabalho para criar o Incremento da Sprint;\n\n**(III)** ajudar a equipe a compreender o Scrum e apoiar a remoção de impedimentos.\n\n**Qual alternativa associa corretamente as responsabilidades às situações descritas?**",
    imagem: { src: "src/images/questao-02.png", alt: "Uma única equipe, três responsabilidades: Product Owner, Scrum Master e Developers dentro da mesma Scrum Team." },
    alternativas: [
      "(I) Product Owner, que ordena o backlog;\n(II) Developers, que planejam e executam o trabalho;\n(III) Scrum Master, que promove a efetividade do Scrum.",
      "(I) Scrum Master, que ordena o backlog;\n(II) Product Owner, que define como o trabalho será executado;\n(III) Developers, que removem os impedimentos da equipe.",
      "(I) Product Owner, que ordena o backlog;\n(II) Scrum Master, que distribui as tarefas como gerente;\n(III) Developers, que garantem a efetividade do Scrum.",
      "(I) Developers, que ordenam o backlog;\n(II) Product Owner, que cria o Incremento;\n(III) Scrum Master, que define o Sprint Backlog.",
    ],
    correta: 0,
    feedback: "Product Owner = valor e ordenação do Product Backlog; Developers = criar o Incremento e decidir como organizar o trabalho; Scrum Master = efetividade do Scrum, atuando como líder servidor, e não como gerente que distribui tarefas.",
  },
  {
    tema: "scrum",
    enunciado: "**A imagem mostra os convites de três reuniões de uma mesma Sprint. Com base nas pautas apresentadas e nas características dos eventos do Scrum, qual alternativa identifica corretamente a Reunião A, a Reunião B e a Reunião C, nessa ordem?**",
    imagem: { src: "src/images/questao-03.png", alt: "Convites das Reuniões A, B e C da Sprint, cada um com participantes, duração e pauta." },
    alternativas: [
      "Daily Scrum; Sprint Review; Sprint Retrospective.",
      "Sprint Review; Sprint Retrospective; Daily Scrum.",
      "Sprint Retrospective; Daily Scrum; Sprint Review.",
      "Daily Scrum; Sprint Retrospective; Sprint Review.",
    ],
    correta: 3,
    feedback: "A Reunião A é a Daily Scrum (15 minutos, Developers, progresso rumo ao Sprint Goal e adaptação do Sprint Backlog). A Reunião B é a Sprint Retrospective (foco na forma de trabalhar: pessoas, interações, processos, ferramentas e Definition of Done). A Reunião C é a Sprint Review (Scrum Team e stakeholders examinam os resultados da Sprint e colaboram sobre os próximos passos).",
  },
  {
    tema: "scrum",
    enunciado: "**A imagem mostra a Definition of Done (DoD) de uma Scrum Team e a situação de um item no último dia da Sprint. Com base na imagem e nos artefatos do Scrum, qual afirmação é correta?**",
    imagem: { src: "src/images/questao-04.png", alt: "Definition of Done da equipe e a situação do item “Pagar com Pix”: três critérios atendidos e um não atendido." },
    alternativas: [
      "O item pode ser apresentado como parte do Incremento, pois a maioria dos critérios da DoD foi atendida.",
      "O item não pode ser considerado parte do Incremento, pois só entra nele o que atende à Definition of Done, e um critério não foi cumprido.",
      "O item faz parte do Incremento, pois o compromisso associado ao Incremento é o Sprint Goal, e não a Definition of Done.",
      "O item deve ser dado como concluído para respeitar o fim da Sprint, pois a DoD pode ser flexibilizada quando o prazo se aproxima.",
    ],
    correta: 1,
    feedback: "O Incremento só inclui o que atende à Definition of Done, seu compromisso associado. Como o critério de integração ao Incremento anterior não foi cumprido, o item não pode ser apresentado como concluído. A qualidade não diminui durante a Sprint, e o Sprint Goal é o compromisso do Sprint Backlog, não do Incremento.",
  },
  {
    tema: "scrum",
    enunciado: "**A imagem mostra o Product Backlog de um aplicativo de compras e um feedback recebido de usuários. Considerando a gestão eficaz do Product Backlog, qual é a ação mais adequada do Product Owner, em colaboração com a equipe?**",
    imagem: { src: "src/images/questao-05.png", alt: "Product Backlog do aplicativo de compras, com a situação e o valor esperado de cada item, e o feedback dos usuários do protótipo." },
    alternativas: [
      "Levar “Permitir pagamento” diretamente ao planejamento da Sprint, pois está no topo do backlog e, por isso, já está pronto para ser desenvolvido.",
      "Detalhar por completo todos os itens do backlog, inclusive os mais distantes, antes de iniciar qualquer Sprint.",
      "Refinar o item do topo, decompondo-o em itens menores (como cartão, Pix e tratamento de falhas), esclarecendo critérios e dependências, e reordenar conforme o feedback.",
      "Agendar a reunião formal de Refinamento, evento obrigatório do Scrum, e aguardar sua realização antes de qualquer alteração no backlog.",
    ],
    correta: 2,
    feedback: "O item mais importante precisa estar claro o bastante para ser considerado no planejamento. Por isso o refinamento decompõe o item amplo, esclarece critérios, avalia dependências, e a ordem pode mudar com o feedback. Itens distantes podem permanecer amplos, e o refinamento é uma atividade contínua, não um evento formal do Scrum.",
  },
  {
    tema: "principios",
    enunciado: "**O Manifesto Ágil declara que valoriza “software em funcionamento mais que documentação abrangente”. De acordo com a apostila, como essa declaração deve ser interpretada?**",
    imagem: { src: "src/images/questao-06.png", alt: "Balança do Manifesto Ágil: software em funcionamento de um lado e documentação abrangente do outro." },
    alternativas: [
      "A documentação deve ser abolida dos projetos, pois não agrega valor em equipes ágeis.",
      "Os elementos à direita continuam tendo valor; a preferência indica prioridade, não exclusão.",
      "A documentação deve ser produzida por completo antes de qualquer software ser desenvolvido.",
      "O Manifesto define uma receita operacional única, na qual documentar é uma prática proibida.",
    ],
    correta: 1,
    feedback: "No Manifesto Ágil, os elementos à direita (processos e ferramentas, documentação abrangente, negociação de contratos, seguir um plano) continuam tendo valor: a preferência indica prioridade, não exclusão. O Manifesto é uma base de valores e princípios, não uma receita operacional única.",
  },
  {
    tema: "principios",
    enunciado: "**Uma startup tem como objetivo reduzir o abandono de carrinhos em sua loja virtual. Qual conduta está mais alinhada ao planejamento ágil adaptativo?**",
    imagem: { src: "src/images/questao-07.png", alt: "Planejamento em níveis: visão e resultados, roadmap de produto e próxima iteração, de hoje ao futuro." },
    alternativas: [
      "Especificar todos os detalhes de todas as funcionalidades do próximo ano antes de começar, para que o plano nunca precise mudar.",
      "Medir o sucesso apenas pelo cumprimento do cronograma original e tratar as estimativas como promessas rígidas.",
      "Alterar as prioridades todos os dias, sem critério definido, sempre que surgir uma nova ideia.",
      "Partir do objetivo, priorizar por valor, risco e dependências, entregar em partes pequenas, comparar o resultado com o objetivo e revisar o plano.",
    ],
    correta: 3,
    feedback: "O planejamento adaptativo segue a lógica objetivo → priorização → pequenas entregas → feedback → revisão do plano. As alternativas A, B e C descrevem antipadrões citados na apostila: planejar todos os detalhes com excessiva antecedência, medir sucesso apenas pelo cronograma e tratar estimativas como certezas, e mudar prioridades sem critério.",
  },
  {
    tema: "principios",
    enunciado: "**A linha do tempo da imagem mostra o histórico de um item de trabalho de uma equipe (datas em dias corridos). Considerando as definições de lead time e cycle time apresentadas na apostila, quais são, respectivamente, os valores desse item?**",
    imagem: { src: "src/images/questao-08.png", alt: "Linha do tempo do item “Emitir 2ª via de boleto”: solicitado em 03/09, trabalho iniciado em 10/09 e concluído em 24/09." },
    alternativas: [
      "Lead time de 21 dias e cycle time de 14 dias.",
      "Lead time de 14 dias e cycle time de 21 dias.",
      "Lead time de 21 dias e cycle time de 7 dias.",
      "Lead time de 14 dias e cycle time de 7 dias.",
    ],
    correta: 0,
    feedback: "Lead time é o tempo desde a solicitação (entrada do item no sistema) até a conclusão: de 03/09 a 24/09, 21 dias. Cycle time é o tempo entre o início do trabalho ativo e a conclusão: de 10/09 a 24/09, 14 dias. Os 7 dias entre a solicitação e o início são tempo de espera e entram no lead time, não no cycle time.",
  },
  {
    tema: "ferramentas",
    enunciado: "**Uma equipe distribuída percebe que usa várias plataformas que duplicam registros e criam versões conflitantes da informação. Qual conduta está mais alinhada à “regra prática” para o uso de ferramentas ágeis?**",
    imagem: { src: "src/images/questao-09.png", alt: "Ferramentas que apoiam equipes ágeis: quadro de tarefas, backlog, documentação, comunicação, controle de versão e testes com integração contínua." },
    alternativas: [
      "Partir do problema de colaboração ou de fluxo, escolher a ferramenta mais simples que o resolva, combinar regras de uso com a equipe e revisar se ela está ajudando.",
      "Adotar a plataforma mais completa do mercado, pois é a ferramenta que define a agilidade de uma equipe.",
      "Exigir que todos registrem atividades adicionais na ferramenta para mantê-la sempre preenchida, mesmo que isso não ajude o trabalho.",
      "Manter todas as plataformas em uso, para que cada pessoa registre as informações onde preferir.",
    ],
    correta: 0,
    feedback: "A regra prática é começar pelo problema de colaboração ou fluxo, escolher a ferramenta mais simples que o resolva, combinar regras de uso com a equipe e revisar se está ajudando. A apostila alerta que a ferramenta não define a agilidade, que se deve evitar múltiplas ferramentas que duplicam registros e que ela não deve obrigar a equipe a criar trabalho artificial.",
  },
  {
    tema: "ferramentas",
    enunciado: "**A imagem apresenta o histórico das três últimas retrospectivas de uma equipe. Com base nas boas práticas de inspeção e melhoria contínua, qual é a conclusão e a conduta mais adequadas?**",
    imagem: { src: "src/images/questao-10.png", alt: "Histórico das retrospectivas das Sprints 5, 6 e 7: os mesmos pontos levantados e nenhuma ação definida." },
    alternativas: [
      "As retrospectivas devem ser canceladas, pois não geram resultado e consomem o tempo da equipe.",
      "A equipe deve identificar quem causa os problemas recorrentes e responsabilizá-lo individualmente.",
      "A equipe deve compensar os problemas com horas extras permanentes até que as reclamações deixem de aparecer.",
      "As retrospectivas repetem as mesmas reclamações sem ações; a equipe deve definir melhorias pequenas, o efeito esperado e acompanhá-las.",
    ],
    correta: 3,
    feedback: "A apostila afirma que retrospectivas são úteis quando resultam em ações concretas e acompanhamento, não em uma lista repetida de reclamações; recomenda experimentar melhorias pequenas, definir o que se espera mudar e verificar o efeito. Transparência não é culpabilização, e a equipe deve evitar depender de horas extras.",
  },
  {
    tema: "kanban-xp",
    enunciado: "**Observe o quadro Kanban da imagem. Um integrante da equipe está sem item atribuído, e há itens aguardando em “A fazer”. Com base nos limites de WIP mostrados no quadro e nos princípios do Kanban, qual é a conduta mais adequada?**",
    imagem: { src: "src/images/questao-11.png", alt: "Quadro Kanban com as colunas A fazer, Em andamento, Em revisão e Concluído, com limites de WIP; Marina está sem item atribuído." },
    alternativas: [
      "Puxar imediatamente um item de “A fazer” para “Em andamento”, pois o objetivo é manter todas as pessoas ocupadas.",
      "Colaborar para concluir ou desbloquear os itens que já estão em andamento ou em revisão, em vez de puxar novos itens automaticamente.",
      "Aumentar os limites de WIP das colunas, para que todos possam iniciar novos itens.",
      "Iniciar um item de “A fazer” sem registrá-lo no quadro, para não ultrapassar o limite de WIP.",
    ],
    correta: 1,
    feedback: "No quadro, “Em andamento” (3/3) e “Em revisão” (2/2) já estão no limite de WIP. Quando uma etapa atinge o limite, a resposta preferível é colaborar para concluir ou desbloquear o trabalho existente, em vez de puxar novas tarefas automaticamente. A meta não é manter todas as pessoas ocupadas a qualquer custo, e sim otimizar o fluxo total de valor; o quadro deve representar o processo real.",
  },
  {
    tema: "kanban-xp",
    enunciado: "**Uma dupla de desenvolvedores de uma equipe que adota Extreme Programming (XP) vai criar uma nova funcionalidade usando Test-Driven Development (TDD). Qual alternativa descreve corretamente o ciclo do TDD?**",
    imagem: { src: "src/images/questao-12.png", alt: "Programação em par: uma pessoa escreve o código e a outra revisa e orienta, alternando os papéis ao longo do trabalho." },
    alternativas: [
      "Implementar toda a funcionalidade, escrever os testes ao final e, por fim, refatorar o código.",
      "Escrever um teste que já passa, implementar funcionalidades extras e dispensar a refatoração.",
      "Escrever um teste que falha, implementar o mínimo necessário para fazê-lo passar e, depois, refatorar o código.",
      "Integrar o código sem testes automatizados e só depois escrever um teste que falhe.",
    ],
    correta: 2,
    feedback: "No TDD, a equipe escreve um teste que falha, implementa o mínimo necessário para fazê-lo passar e depois refatora o código. O ciclo costuma ser descrito como vermelho → verde → refatorar. Testes automatizados dão confiança para mudar o sistema e detectar regressões.",
  },
];

/* ---------- PROGRESSO (um por aluno, salvo no navegador) ---------- */
const aluno = usuarioLogado() || {};
const CHAVE = "prova:" + (aluno.cpf || "anonimo");   // para refazer a prova, apague esta chave do localStorage

let estado = { atual: 0, respostas: {}, restante: TEMPO_PERGUNTA, finalizada: false, resultado: null };

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo) estado = { ...estado, ...salvo };
  } catch { /* dado corrompido: começa do zero */ }
  if (!(estado.atual >= 0 && estado.atual < QUESTOES.length)) estado.atual = 0;
  if (!(estado.restante > 0 && estado.restante <= TEMPO_PERGUNTA)) estado.restante = TEMPO_PERGUNTA;
}

// tempo que falta para terminar a prova inteira (pergunta atual + perguntas seguintes)
function tempoTotalRestante() {
  if (estado.finalizada) return 0;
  return estado.restante + (QUESTOES.length - 1 - estado.atual) * TEMPO_PERGUNTA;
}

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function salvar() {
  estado.tempoTotal = QUESTOES.length * TEMPO_PERGUNTA;   // a home lê estes dois valores
  estado.tempoTotalRestante = tempoTotalRestante();
  try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch { /* sem armazenamento */ }
}

/* ---------- TELA ---------- */
const $ = (id) => document.getElementById(id);

function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

// escreve o texto com **negrito** sem usar innerHTML
function escrever(el, texto) {
  el.replaceChildren();
  texto.split("**").forEach((trecho, i) => {
    if (!trecho) return;
    el.append(i % 2 ? criar("strong", "", trecho) : trecho);
  });
}

function mostrarPergunta() {
  const q = QUESTOES[estado.atual];

  $("contador").textContent = `Pergunta ${estado.atual + 1} de ${QUESTOES.length}`;
  $("media").textContent = `Média da prova ${MEDIA_MINIMA}%`;
  escrever($("enunciado"), q.enunciado);

  const figura = $("figura");
  figura.hidden = !q.imagem;
  if (q.imagem) {
    figura.src = q.imagem.src;
    figura.alt = q.imagem.alt;
  }

  const lista = $("alternativas");
  lista.replaceChildren();
  q.alternativas.forEach((texto, i) => {
    const input = criar("input", "opcao-input");
    input.type = "radio";
    input.name = "alternativa";
    input.id = "alt-" + i;
    input.checked = estado.respostas[estado.atual] === i;
    input.addEventListener("change", () => {
      estado.respostas[estado.atual] = i;
      salvar();
    });

    const radio = criar("span", "opcao-radio");
    radio.setAttribute("aria-hidden", "true");
    const cartao = criar("label", "opcao-cartao");
    cartao.htmlFor = input.id;
    cartao.append(radio, criar("span", "opcao-letra", "ABCD"[i]), criar("span", "opcao-texto", texto));

    const opcao = criar("div", "opcao");
    opcao.append(input, cartao);
    lista.append(opcao);
  });

  const ultima = estado.atual === QUESTOES.length - 1;
  $("btn-proxima").textContent = ultima ? "Finalizar a prova" : "Ir para a próxima pergunta";
  mostrarPaginacao();
  mostrarTempo();
}

function mostrarTempo() {
  $("tempo").textContent = estado.restante + "s";
  $("barra-preenchimento").style.width = (estado.restante / TEMPO_PERGUNTA) * 100 + "%";
  $("barra").setAttribute("aria-valuenow", estado.restante);
}

// 7 números por vez; a janela anda de 3 em 3 (1–7, 4–10, 7–12), como no design
function mostrarPaginacao() {
  const total = QUESTOES.length;
  const numero = estado.atual + 1;
  const inicio = 1 + 3 * Math.floor((numero - 1) / 4);
  const fim = Math.min(inicio + 6, total);

  const seta = (texto) => {
    const el = criar("span", "pagina-seta", texto);
    el.setAttribute("aria-hidden", "true");
    return el;
  };

  const nav = $("paginacao");
  nav.replaceChildren(seta("«"));
  for (let p = inicio; p <= fim; p++) {
    const item = criar("span", p === numero ? "pagina atual" : "pagina", p + (p === fim && fim < total ? "…" : ""));
    if (p === numero) item.setAttribute("aria-current", "step");
    nav.append(item);
  }
  nav.append(seta("»"));
}

/* ---------- RELÓGIO ---------- */
let relogio = null;
let fimDoTempo = 0;

function iniciarRelogio() {
  pararRelogio();
  fimDoTempo = Date.now() + estado.restante * 1000;
  relogio = setInterval(tique, 200);
}

function pararRelogio() {
  clearInterval(relogio);
  relogio = null;
}

function tique() {
  const restante = Math.max(0, Math.ceil((fimDoTempo - Date.now()) / 1000));
  if (restante === estado.restante) return;
  estado.restante = restante;
  mostrarTempo();
  salvar();
  if (restante === 0) avancar();          // acabou o tempo: segue para a próxima
}

/* ---------- PRÓXIMA PERGUNTA E RESULTADO ---------- */
function avancar() {
  pararRelogio();
  if (estado.atual === QUESTOES.length - 1) return finalizar();

  estado.atual += 1;
  estado.restante = TEMPO_PERGUNTA;
  salvar();
  mostrarPergunta();
  iniciarRelogio();
}

function finalizar() {
  pararRelogio();
  const acertos = QUESTOES.filter((q, i) => estado.respostas[i] === q.correta).length;
  const percentual = Math.round((acertos / QUESTOES.length) * 100);

  estado.finalizada = true;
  // desempenho por tema (a página Certificado mostra o que o aluno acertou e errou em cada tema)
  const temas = {};
  QUESTOES.forEach((q, i) => {
    const t = temas[q.tema] || (temas[q.tema] = { acertos: 0, total: 0, itens: [] });
    const ok = estado.respostas[i] === q.correta;
    t.total++; if (ok) t.acertos++;
    t.itens.push(ok);
  });

  estado.resultado = { acertos, total: QUESTOES.length, percentual, aprovado: percentual >= MEDIA_MINIMA, minimo: MEDIA_MINIMA, temas };
  salvar();
  Certificado.registrar(estado.resultado);   // guarda o melhor resultado e libera o certificado se aprovado
  mostrarResultado();
}

// Finalizou: a tela de Parabéns (aprovado) ou "Não foi dessa vez" (reprovado) é a resultado.html
function mostrarResultado() {
  location.replace(RESULTADO_URL);
}

/* ---------- PARAR PROVA: confirmação ---------- */
const dialogoParar = $("dialogo-parar");
let parando = false;

$("btn-parar").addEventListener("click", () => {
  pararRelogio();                 // o tempo fica pausado enquanto o aluno decide
  salvar();
  dialogoParar.showModal();
});

// Continuar (botão ou tecla Esc): fecha e o relógio volta de onde parou
$("btn-continuar").addEventListener("click", () => dialogoParar.close());
dialogoParar.addEventListener("close", () => { if (!parando) iniciarRelogio(); });

// Parar: o progresso fica salvo, mostra o que acertou e errou e depois volta para o portal
$("btn-confirmar-parar").addEventListener("click", () => {
  parando = true;
  salvar();
  dialogoParar.close();
  mostrarParcial();
});

/* ---------- RESULTADO PARCIAL (ao parar a prova) ----------
   Só entram na conta as perguntas já concluídas. A pergunta atual aparece
   como "Em andamento": ela só é corrigida quando o aluno passa para a próxima
   (assim ele não pode trocar a resposta depois de ver que errou). */
function mostrarParcial() {
  let acertos = 0;
  let erros = 0;
  const lista = $("parcial-lista");
  lista.replaceChildren();

  const alternativa = (q, i) => "ABCD"[i] + ". " + q.alternativas[i];

  QUESTOES.forEach((q, i) => {
    const num = "Pergunta " + (i + 1);

    // a pergunta atual e as seguintes ainda não são corrigidas
    if (i >= estado.atual) {
      const andamento = i === estado.atual;
      const item = criar("li", "parcial-item " + (andamento ? "andamento" : "pendente"));
      const linha = criar("div", "parcial-resumo");
      linha.append(criar("span", "parcial-num", num), criar("span", "parcial-status", andamento ? "Em andamento" : "Pendente"));
      item.append(linha);
      lista.append(item);
      return;
    }

    const resposta = estado.respostas[i];
    const acertou = resposta === q.correta;
    if (acertou) acertos++; else erros++;

    const item = criar("li", "parcial-item " + (acertou ? "acertou" : "errou"));
    const detalhe = criar("details", "parcial-detalhe");
    detalhe.open = !acertou;                        // as que errou já aparecem abertas

    const resumo = criar("summary", "parcial-resumo");
    resumo.append(
      criar("span", "parcial-num", num),
      criar("span", "parcial-status", acertou ? "✔ Acertou" : (resposta === undefined ? "✘ Sem resposta" : "✘ Errou"))
    );

    const corpo = criar("div", "parcial-corpo");
    if (!acertou) {
      corpo.append(criar("p", "parcial-linha", resposta === undefined
        ? "Você não respondeu esta pergunta."
        : "Sua resposta: " + alternativa(q, resposta)));
    }
    corpo.append(criar("p", "parcial-linha parcial-certa",
      (acertou ? "Você acertou: " : "Alternativa correta: ") + alternativa(q, q.correta)));

    if (q.feedback) {
      const fb = criar("div", "parcial-feedback");
      fb.append(criar("strong", "", "Feedback"), criar("p", "", q.feedback));
      corpo.append(fb);
    }

    detalhe.append(resumo, corpo);
    item.append(detalhe);
    lista.append(item);
  });

  const concluidas = estado.atual;
  const resumoTexto = concluidas === 0
    ? "Você ainda não concluiu nenhuma pergunta. "
    : `Você acertou ${acertos} e errou ${erros} das ${concluidas} perguntas concluídas. `;
  $("parcial-texto").textContent =
    resumoTexto + `Tempo que falta para terminar a prova: ${formatarTempo(tempoTotalRestante())}. ` +
    "A pergunta atual só é corrigida quando você passa para a próxima.";

  $("btn-parcial-voltar").href = HOME_URL;
  $("dialogo-parcial").showModal();
}
$("dialogo-parcial").addEventListener("cancel", (e) => e.preventDefault());   // só sai pelo botão

/* ---------- INÍCIO ---------- */
$("btn-proxima").addEventListener("click", avancar);
window.addEventListener("pagehide", salvar);

carregar();
if (estado.finalizada && estado.resultado) {
  mostrarResultado();                    // prova já finalizada: vai direto para o resultado
} else {
  mostrarPergunta();
  iniciarRelogio();
}