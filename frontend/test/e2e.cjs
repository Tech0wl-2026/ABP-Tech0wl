// Integração: grava com o store, abre certificado.html num Chromium real e confere o histórico exibido.
const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright");
const fs = require("fs");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 900 } });
  const erros = []; p.on("pageerror", (e) => erros.push(e.message));
  await p.route("**/src/js/auth.js", (r) => r.fulfill({ contentType: "text/javascript", body: "window.exigirLogin=function(){};window.usuarioLogado=()=>({cpf:'11111111111'});" }));
  await p.goto("http://localhost:8123/certificado.html");
  await p.evaluate(() => {
    const H = window.HistoricoCertificacao;
    H.iniciarAvaliacao();
    H.sortearQuestao({ tema: "Scrum", questaoId: 11, enunciado: "Quem prioriza o backlog?", alternativaCorreta: "Product Owner" });
    H.registrarResposta("Scrum Master");
    H.sortearQuestao({ tema: "Kanban", questaoId: 21, enunciado: "O que é WIP?", alternativaCorreta: "Trabalho em progresso" });
    H.registrarExpirada();
    H.finalizarAvaliacao({ percentual: 40, aprovado: false });
    H.iniciarAvaliacao();
    H.sortearQuestao({ tema: "XP", questaoId: 31, enunciado: "O que é TDD?", alternativaCorreta: "Desenvolvimento guiado por testes" });
    H.interromperAtual();
  });
  await p.reload(); await p.waitForSelector(".hist-avaliacao");
  const txt = await p.innerText("#historico-lista");
  const checks = {
    "2 avaliações": (await p.$$(".hist-avaliacao")).length === 2,
    "tema": txt.includes("Scrum"), "questão": txt.includes("Quem prioriza o backlog?"),
    "resposta escolhida": txt.includes("Scrum Master"), "alternativa correta": txt.includes("Product Owner"),
    "data/hora": /\d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}/.test(txt),
    "reprovada": txt.includes("Reprovada"), "expirada": txt.includes("Tempo esgotado"), "interrompida": txt.includes("Interrompida"),
    "sem erros de script (exceto certificado.js ausente)": erros.every((e) => /Certificado|certificado/.test(e)) ,
  };
  // outro CPF não enxerga
  await p.route("**/src/js/auth.js", (r) => r.fulfill({ contentType: "text/javascript", body: "window.exigirLogin=function(){};window.usuarioLogado=()=>({cpf:'22222222222'});" }));
  await p.reload(); await p.waitForSelector(".hist-vazio");
  checks["outro CPF não vê dados de terceiros"] = (await p.$$(".hist-avaliacao")).length === 0;
  console.log(checks); fs.mkdirSync("evidencias", { recursive: true });
  await p.route("**/src/js/auth.js", (r) => r.fulfill({ contentType: "text/javascript", body: "window.exigirLogin=function(){};window.usuarioLogado=()=>({cpf:'11111111111'});" }));
  await p.reload(); await p.waitForSelector(".hist-avaliacao");
  await p.locator("#historico").screenshot({ path: "evidencias/historico-desktop.png" });
  await b.close();
  if (!Object.values(checks).every(Boolean)) process.exit(1);
})();
