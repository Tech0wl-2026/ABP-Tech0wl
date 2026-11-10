/*
 * Histórico da certificação (RF20)
 *
 * Contrato esperado da API (GET /api/certificacao/historico):
 *   - exige autenticação; o servidor identifica o candidato pelo token e
 *     devolve SOMENTE os registros dele (nunca aceita id de usuário na URL);
 *   - resposta: { avaliacoes: [ {
 *         id, status: "aprovada" | "reprovada" | "interrompida" | "em_andamento",
 *         iniciadaEm, finalizadaEm, mediaPercentual,
 *         questoes: [ {
 *             tema, questaoId, enunciado,
 *             situacao: "respondida" | "expirada" | "interrompida",
 *             respostaEscolhida, alternativaCorreta, respondidaEm
 *         } ]
 *     } ] }
 */

export const ENDPOINT = "/api/certificacao/historico";

const STATUS_AVALIACAO = {
  aprovada: "Aprovada",
  reprovada: "Reprovada",
  interrompida: "Interrompida",
  em_andamento: "Em andamento",
};

const SITUACAO_QUESTAO = {
  respondida: "Respondida",
  expirada: "Tempo esgotado",
  interrompida: "Interrompida",
};

export function formatarDataHora(valor) {
  if (!valor) return "—";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo",
  }).replace(", ", " às ");
}

/** Normaliza a resposta da API; tolera campos ausentes. */
export function normalizarHistorico(dados) {
  const lista = Array.isArray(dados?.avaliacoes) ? dados.avaliacoes : [];
  return lista
    .map((a) => ({
      id: String(a.id ?? ""),
      status: STATUS_AVALIACAO[a.status] ? a.status : "interrompida",
      iniciadaEm: a.iniciadaEm ?? null,
      finalizadaEm: a.finalizadaEm ?? null,
      mediaPercentual: typeof a.mediaPercentual === "number" ? a.mediaPercentual : null,
      questoes: (Array.isArray(a.questoes) ? a.questoes : []).map((q) => {
        const situacao = SITUACAO_QUESTAO[q.situacao] ? q.situacao : "interrompida";
        const resposta = q.respostaEscolhida ?? null;
        return {
          tema: q.tema ?? "—",
          questaoId: String(q.questaoId ?? ""),
          enunciado: q.enunciado ?? "",
          situacao,
          respostaEscolhida: resposta,
          alternativaCorreta: q.alternativaCorreta ?? "—",
          respondidaEm: q.respondidaEm ?? null,
          acertou: situacao === "respondida" && resposta !== null && resposta === q.alternativaCorreta,
        };
      }),
    }))
    .sort((x, y) => new Date(y.iniciadaEm || 0) - new Date(x.iniciadaEm || 0));
}

/** Texto da resposta escolhida conforme a situação da questão. */
export function textoResposta(q) {
  if (q.situacao === "expirada") return "Sem resposta (tempo esgotado)";
  if (q.situacao === "interrompida" && q.respostaEscolhida === null) return "Sem resposta (interrompida)";
  return q.respostaEscolhida ?? "—";
}

function el(tag, classe, texto) {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texto !== undefined) n.textContent = texto; // textContent: nunca interpreta HTML
  return n;
}

function campo(rotulo, valor) {
  const d = el("div", "hist-campo");
  d.append(el("dt", null, rotulo), el("dd", null, valor));
  return d;
}

export function renderizarQuestao(q) {
  const li = el("li", "hist-questao");
  li.dataset.situacao = q.situacao;
  li.dataset.resultado = q.situacao === "respondida" ? (q.acertou ? "acerto" : "erro") : q.situacao;

  const topo = el("div", "hist-questao-topo");
  topo.append(el("strong", null, q.tema), el("span", "hist-selo", SITUACAO_QUESTAO[q.situacao]));
  if (q.situacao === "respondida") {
    topo.append(el("span", "hist-selo " + (q.acertou ? "ok" : "erro"), q.acertou ? "Acertou" : "Errou"));
  }

  const dl = el("dl", "hist-campos");
  dl.append(
    campo("Questão", q.enunciado || `#${q.questaoId}`),
    campo("Resposta escolhida", textoResposta(q)),
    campo("Alternativa correta", q.alternativaCorreta),
    campo("Data e hora", formatarDataHora(q.respondidaEm)),
  );
  li.append(topo, dl);
  return li;
}

export function renderizarAvaliacao(a) {
  const art = el("article", "hist-avaliacao");
  art.dataset.status = a.status;

  const cab = el("header", "hist-avaliacao-topo");
  const titulo = el("h2", null, `Avaliação de ${formatarDataHora(a.iniciadaEm)}`);
  const selo = el("span", "hist-selo status", STATUS_AVALIACAO[a.status]);
  cab.append(titulo, selo);

  const resumo = el(
    "p", "hist-resumo",
    (a.mediaPercentual !== null ? `Média: ${a.mediaPercentual}%` : "Média: —") +
    ` · ${a.questoes.length} ${a.questoes.length === 1 ? "questão" : "questões"}` +
    (a.finalizadaEm ? ` · Encerrada em ${formatarDataHora(a.finalizadaEm)}` : "")
  );

  const lista = el("ul", "hist-questoes");
  a.questoes.forEach((q) => lista.append(renderizarQuestao(q)));
  if (!a.questoes.length) lista.append(el("li", "hist-vazio", "Nenhuma questão registrada nesta avaliação."));

  art.append(cab, resumo, lista);
  return art;
}

export function renderizarHistorico(container, avaliacoes) {
  container.replaceChildren();
  if (!avaliacoes.length) {
    container.append(el("p", "hist-vazio", "Você ainda não iniciou nenhuma avaliação. Quando fizer a prova, o histórico aparece aqui."));
    return;
  }
  avaliacoes.forEach((a) => container.append(renderizarAvaliacao(a)));
}

/** Token do usuário logado; ajuste se o auth.js expuser outra função. */
function obterToken() {
  if (typeof window.obterToken === "function") return window.obterToken();
  return localStorage.getItem("token");
}

export async function buscarHistorico(fetchFn = fetch, token = obterToken()) {
  const resp = await fetchFn(ENDPOINT, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    credentials: "same-origin",
  });
  if (resp.status === 401 || resp.status === 403) {
    const e = new Error("sessao"); e.codigo = "sessao"; throw e;
  }
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return normalizarHistorico(await resp.json());
}

async function iniciar() {
  const container = document.getElementById("historico-lista");
  const estado = document.getElementById("historico-estado");
  try {
    const avaliacoes = await buscarHistorico();
    estado.textContent = "";
    renderizarHistorico(container, avaliacoes);
    document.body.dataset.historicoCarregado = String(avaliacoes.length);
  } catch (e) {
    if (e.codigo === "sessao") {
      window.location.href = "login.html";
      return;
    }
    estado.textContent = "Não foi possível carregar o histórico. Atualize a página para tentar de novo.";
  }
}

if (typeof document !== "undefined" && document.getElementById("historico-lista")) iniciar();