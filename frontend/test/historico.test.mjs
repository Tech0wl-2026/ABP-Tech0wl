import test from "node:test";
import assert from "node:assert/strict";

// localStorage e usuário falsos, compartilhados por dois candidatos
const memoria = new Map();
globalThis.localStorage = { getItem: (k) => memoria.get(k) ?? null, setItem: (k, v) => memoria.set(k, String(v)) };
let cpf = "11111111111";
globalThis.usuarioLogado = () => ({ cpf });

await import("../src/js/historico-store.js");
const { normalizarHistorico, buscarHistorico, textoResposta } = await import("../src/js/historico.js");
const H = globalThis.HistoricoCertificacao;
const Q1 = { tema: "Scrum", questaoId: 11, enunciado: "Quem prioriza o backlog?", alternativaCorreta: "Product Owner" };
const Q2 = { tema: "Kanban", questaoId: 21, enunciado: "O que é WIP?", alternativaCorreta: "Trabalho em progresso" };

test("registra avaliação reprovada com resposta e questão expirada", () => {
  H.iniciarAvaliacao();
  H.sortearQuestao(Q1); H.registrarResposta("Scrum Master");
  H.sortearQuestao(Q2); H.registrarExpirada();
  H.finalizarAvaliacao({ percentual: 40, aprovado: false });
  const [a] = buscarHistorico();
  assert.equal(a.status, "reprovada");
  assert.equal(a.mediaPercentual, 40);
  const [q1, q2] = a.questoes;
  assert.deepEqual([q1.tema, q1.enunciado, q1.respostaEscolhida, q1.alternativaCorreta], ["Scrum", Q1.enunciado, "Scrum Master", "Product Owner"]);
  assert.ok(q1.respondidaEm);
  assert.equal(q1.acertou, false);
  assert.equal(q2.situacao, "expirada");
});

test("prova abandonada vira interrompida, com a questão aberta interrompida", () => {
  H.iniciarAvaliacao(); H.sortearQuestao(Q1);
  H.iniciarAvaliacao();                       // nova prova sem finalizar a anterior
  const h = buscarHistorico();
  const interrompida = h.find((a) => a.status === "interrompida");
  assert.ok(interrompida);
  assert.equal(interrompida.questoes[0].situacao, "interrompida");
  assert.ok(h.some((a) => a.status === "em_andamento"));
});

test("interromperAtual encerra a prova em andamento", () => {
  H.interromperAtual();
  assert.ok(!buscarHistorico().some((a) => a.status === "em_andamento"));
});

test("cada candidato vê só o próprio histórico", () => {
  const doPrimeiro = buscarHistorico().length;
  cpf = "22222222222";
  assert.equal(buscarHistorico().length, 0);
  H.iniciarAvaliacao(); H.finalizarAvaliacao({ percentual: 90, aprovado: true });
  assert.equal(buscarHistorico().length, 1);
  cpf = "11111111111";
  assert.equal(buscarHistorico().length, doPrimeiro);
  assert.ok(!buscarHistorico().some((a) => a.status === "aprovada"));
});

test("mais recente primeiro e texto de resposta sem resposta", () => {
  const datas = buscarHistorico().map((a) => new Date(a.iniciadaEm));
  assert.ok(datas.every((d, i) => i === 0 || datas[i - 1] >= d));
  assert.match(textoResposta({ situacao: "expirada", respostaEscolhida: null }), /tempo esgotado/);
  assert.match(textoResposta({ situacao: "interrompida", respostaEscolhida: null }), /interrompida/);
});

test("dados inválidos não quebram a tela", () => {
  assert.deepEqual(normalizarHistorico(null), []);
  assert.deepEqual(normalizarHistorico({ avaliacoes: "x" }), []);
});
