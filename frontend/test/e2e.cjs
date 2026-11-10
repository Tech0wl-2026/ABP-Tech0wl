// Evidência de integração: abre historico.html num navegador real, com a API simulada, e confere o que a tela exibe.
const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright");
const fs = require("fs");
const dados = { avaliacoes: [
  { id: 2, status: "reprovada", iniciadaEm: "2026-11-09T14:00:00Z", finalizadaEm: "2026-11-09T14:40:00Z", mediaPercentual: 40, questoes: [
    { tema: "Scrum", questaoId: 11, enunciado: "Quem prioriza o backlog?", situacao: "respondida", respostaEscolhida: "Scrum Master", alternativaCorreta: "Product Owner", respondidaEm: "2026-11-09T14:10:00Z" },
    { tema: "Kanban", questaoId: 21, enunciado: "O que é WIP?", situacao: "expirada", respostaEscolhida: null, alternativaCorreta: "Trabalho em progresso", respondidaEm: null } ] },
  { id: 1, status: "interrompida", iniciadaEm: "2026-11-01T10:00:00Z", mediaPercentual: null, questoes: [
    { tema: "XP", questaoId: 31, enunciado: "O que é TDD?", situacao: "interrompida", alternativaCorreta: "Desenvolvimento guiado por testes" } ] } ] };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 900 } });
  let auth = null;
  await p.route("**/api/certificacao/historico", (r) => { auth = r.request().headers()["authorization"]; r.fulfill({ json: dados }); });
  await p.route("**/src/js/auth.js", (r) => r.fulfill({ contentType: "text/javascript", body: "window.exigirLogin=function(){};" }));
  await p.addInitScript(() => localStorage.setItem("token", "token-ana"));
  await p.goto("http://localhost:8123/historico.html");
  await p.waitForSelector(".hist-avaliacao");
  const txt = await p.innerText("#historico-lista");
  const checks = {
    "Authorization enviado": auth === "Bearer token-ana",
    "2 avaliações": (await p.$$(".hist-avaliacao")).length === 2,
    "tema": txt.includes("Scrum"),
    "questão": txt.includes("Quem prioriza o backlog?"),
    "resposta escolhida": txt.includes("Scrum Master"),
    "alternativa correta": txt.includes("Product Owner"),
    "data/hora": txt.includes("09/11/2026 às 11:10"),
    "reprovada": txt.includes("Reprovada"),
    "expirada": txt.includes("Tempo esgotado"),
    "interrompida": txt.includes("Interrompida"),
  };
  console.log(checks); fs.mkdirSync("evidencias", { recursive: true });
  await p.screenshot({ path: "evidencias/historico-desktop.png", fullPage: true });
  await b.close();
  if (!Object.values(checks).every(Boolean)) process.exit(1);
})();
