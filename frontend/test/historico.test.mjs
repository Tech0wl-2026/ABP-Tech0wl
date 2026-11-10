import test from "node:test";
import assert from "node:assert/strict";
import { normalizarHistorico, buscarHistorico, textoResposta, ENDPOINT } from "../src/js/historico.js";

// "Banco" com dois candidatos: a API simulada filtra pelo token, como o servidor real deve fazer.
const BANCO = {
  "token-ana": { avaliacoes: [
    { id: 2, status: "reprovada", iniciadaEm: "2026-11-09T14:00:00Z", finalizadaEm: "2026-11-09T14:40:00Z", mediaPercentual: 40,
      questoes: [
        { tema: "Scrum", questaoId: 11, enunciado: "Quem prioriza o backlog?", situacao: "respondida", respostaEscolhida: "Scrum Master", alternativaCorreta: "Product Owner", respondidaEm: "2026-11-09T14:10:00Z" },
        { tema: "Kanban", questaoId: 21, enunciado: "O que é WIP?", situacao: "expirada", respostaEscolhida: null, alternativaCorreta: "Trabalho em progresso", respondidaEm: null },
      ] },
    { id: 1, status: "interrompida", iniciadaEm: "2026-11-01T10:00:00Z", mediaPercentual: null,
      questoes: [{ tema: "XP", questaoId: 31, enunciado: "O que é TDD?", situacao: "interrompida", alternativaCorreta: "Desenvolvimento guiado por testes" }] },
  ] },
  "token-bia": { avaliacoes: [{ id: 99, status: "aprovada", iniciadaEm: "2026-11-05T09:00:00Z", mediaPercentual: 90, questoes: [] }] },
};
const apiFalsa = async (url, init) => {
  const token = init.headers.Authorization?.replace("Bearer ", "");
  if (url !== ENDPOINT || !BANCO[token]) return { ok: false, status: 401 };
  return { ok: true, status: 200, json: async () => BANCO[token] };
};

test("devolve só o histórico do candidato autenticado", async () => {
  const ana = await buscarHistorico(apiFalsa, "token-ana");
  assert.deepEqual(ana.map((a) => a.id), ["2", "1"]);
  assert.ok(!ana.some((a) => a.id === "99"));
});

test("não envia identificador de usuário na requisição", async () => {
  let chamada;
  await buscarHistorico(async (u, i) => { chamada = { u, i }; return apiFalsa(u, i); }, "token-bia");
  assert.equal(chamada.u, ENDPOINT);
  assert.ok(!/user|aluno|candidato|id=/i.test(chamada.u));
});

test("sem token válido, sinaliza sessão expirada", async () => {
  await assert.rejects(() => buscarHistorico(apiFalsa, "x"), { codigo: "sessao" });
});

test("inclui reprovadas, expiradas e interrompidas, ordenadas da mais recente", async () => {
  const h = await buscarHistorico(apiFalsa, "token-ana");
  assert.equal(h[0].status, "reprovada");
  assert.equal(h[1].status, "interrompida");
  assert.equal(h[0].questoes[1].situacao, "expirada");
  assert.equal(h[1].questoes[0].situacao, "interrompida");
});

test("expõe tema, questão, resposta, correta e data/hora", () => {
  const [q] = normalizarHistorico(BANCO["token-ana"])[0].questoes;
  assert.equal(q.tema, "Scrum");
  assert.equal(q.enunciado, "Quem prioriza o backlog?");
  assert.equal(q.respostaEscolhida, "Scrum Master");
  assert.equal(q.alternativaCorreta, "Product Owner");
  assert.equal(q.respondidaEm, "2026-11-09T14:10:00Z");
  assert.equal(q.acertou, false);
});

test("texto da resposta para expirada e interrompida", () => {
  assert.match(textoResposta({ situacao: "expirada", respostaEscolhida: null }), /tempo esgotado/);
  assert.match(textoResposta({ situacao: "interrompida", respostaEscolhida: null }), /interrompida/);
});
