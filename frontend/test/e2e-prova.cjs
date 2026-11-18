// Fluxo real: roda questao.html + prova.js + certificado.html. Monte uma pasta com os arquivos do projeto e sirva em :8124
// (python3 -m http.server 8124); o auth.js é simulado pelo teste.
const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright");
const B = "http://localhost:8124/";
const AUTH = (cpf) => ({ contentType: "text/javascript", body: `window.exigirLogin=function(){};window.usuarioLogado=()=>({cpf:'${cpf}',nome:'T'});` });
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const p = await ctx.newPage();
  await p.route("**/src/js/auth.js", (r) => r.fulfill(AUTH("11111111111")));
  await p.goto(B + "questao.html");
  await p.waitForSelector("#alternativas .opcao");
  const clicar = (i) => p.locator("label.opcao-cartao").nth(i).click();
  // P1 acerta (C), P2 sem resposta, P3 erra (A)
  await clicar(2); await p.click("#btn-proxima");
  await p.click("#btn-proxima");
  await clicar(0); await p.click("#btn-proxima");
  // pausa na P4 e retoma
  await p.click("#btn-parar"); await p.click("#btn-confirmar-parar");
  await p.goto(B + "questao.html"); await p.waitForSelector("#alternativas .opcao");
  const retomou = (await p.innerText("#contador")).toLowerCase().includes("4 de 12");
  // P4 certa (B), P5 certa (C), depois restantes sem responder; P6 expira
  await clicar(1); await p.click("#btn-proxima");
  await clicar(2); await p.click("#btn-proxima");
  await p.clock.install(); await p.reload(); await p.waitForSelector("#alternativas .opcao");
  const logo = await p.evaluate(() => document.getElementById("contador").textContent);
  await p.clock.fastForward(155000);   // expira a pergunta atual (sem resposta)
  const apos = await p.innerText("#contador");
  const hist = await p.evaluate(() => JSON.stringify(HistoricoCertificacao.lerHistorico()));
  const H = JSON.parse(hist);
  const a = H.avaliacoes[0];
  const checks = {
    "retomou na pergunta 4 após pausa": retomou,
    "pausa não criou nova avaliação": H.avaliacoes.length === 1 && a.status === "em_andamento",
    "P1 respondida": a.questoes[0].situacao === "respondida" && a.questoes[0].respostaEscolhida.startsWith("C."),
    "P1 guarda correta": a.questoes[0].alternativaCorreta.startsWith("C."),
    "P2 sem resposta": a.questoes[1].situacao === "respondida" && a.questoes[1].respostaEscolhida === null,
    "P3 errada": a.questoes[2].respostaEscolhida.startsWith("A."),
    "sem duplicar questões ao retomar": a.questoes.filter((q) => q.questaoId == 4).length === 1,
    "tempo esgotado registrado": a.questoes.some((q) => q.situacao === "expirada"),
    "tem data/hora": !!a.questoes[0].respondidaEm,
  };
  console.log(logo, "->", apos, "| questões:", a.questoes.map((q) => q.questaoId + ":" + q.situacao).join(" "));
  // recomeço: apagar progresso da prova => avaliação aberta vira interrompida
  await p.evaluate(() => { pararRelogio(); if (!Storage.prototype.__orig) { Storage.prototype.__orig = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (String(k).startsWith("prova:")) return; return Storage.prototype.__orig.call(this, k, v); }; } localStorage.removeItem("prova:11111111111"); });
  await p.reload(); await p.waitForSelector("#alternativas .opcao");
  const H2 = await p.evaluate(() => HistoricoCertificacao.lerHistorico());
  checks["recomeço marca a anterior como interrompida"] = H2.avaliacoes.length === 2 && H2.avaliacoes[0].status === "interrompida" && H2.avaliacoes[1].status === "em_andamento";
  checks["questão aberta virou interrompida"] = H2.avaliacoes[0].questoes.some((q) => q.situacao === "interrompida");
  // finalizar a prova nova: responde tudo
  await p.evaluate(() => { pararRelogio(); if (!Storage.prototype.__orig) { Storage.prototype.__orig = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (String(k).startsWith("prova:")) return; return Storage.prototype.__orig.call(this, k, v); }; } const e = JSON.parse(localStorage.getItem("prova:11111111111")); e.atual = 11; e.restante = 150; Storage.prototype.__orig.call(localStorage, "prova:11111111111", JSON.stringify(e)); });
  await p.reload().catch(()=>{}); await p.waitForSelector("#alternativas .opcao");
  await p.locator("label.opcao-cartao").nth(2).click();
  await p.click("#btn-proxima").catch(()=>{}); await p.waitForTimeout(500);
  const H3 = await p.evaluate(() => localStorage.getItem("historico:11111111111")).then(JSON.parse); console.log("H3", H3.avaliacoes.map(a=>a.status+":"+a.questoes.length).join(" "), "url", p.url());
  checks["finalizar grava reprovada/aprovada"] = H3.avaliacoes.some((a) => ["aprovada", "reprovada"].includes(a.status));
  // tela do certificado
  await p.goto(B + "certificado.html"); await p.waitForSelector(".hist-avaliacao");
  const fechadas = await p.$$eval(".hist-avaliacao", (l) => l.every((d) => !d.open));
  const visivelFechado = await p.innerText("#historico-lista");
  await p.locator("#historico").screenshot({ path: (process.env.SHOT || "historico").replace(/\.png$/, "") + "-minimizado.png" });
  await p.$$eval(".hist-avaliacao", (l) => l.forEach((d) => (d.open = true)));
  const txt = await p.innerText("#historico-lista");
  checks["tela mostra tema/enunciado/correta/resposta"] = txt.includes("Scrum") && txt.includes("Transparência, inspeção e adaptação") && txt.includes("Sem resposta") && txt.includes("Tempo esgotado");
  checks["tela mostra interrompida e reprovada"] = txt.includes("Interrompida") && txt.includes("Reprovada");
  checks["avaliações vêm minimizadas, só com o título"] = fechadas && /Avaliação de \d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}/.test(visivelFechado) && !visivelFechado.includes("Alternativa correta");
  // outro CPF
  await p.route("**/src/js/auth.js", (r) => r.fulfill(AUTH("22222222222")), { times: 1 }).catch(()=>{});
  console.log(checks);
  await p.locator("#historico").screenshot({ path: process.env.SHOT || "historico.png" });
  await b.close();
  if (!Object.values(checks).every(Boolean)) process.exit(1);
})();
