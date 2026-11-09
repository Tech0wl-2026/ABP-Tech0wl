/* ============================================================
   resultado.js — mostra a tela de Parabéns (aprovado) ou
   "Não foi dessa vez" (reprovado), conforme a prova finalizada.
   O questao.js leva o aluno para cá ao finalizar.
   ============================================================ */
(function () {
  const aluno = (typeof usuarioLogado === "function" && usuarioLogado()) || {};
  const chave = "prova:" + (aluno.cpf || "anonimo");      // a mesma chave do questao.js

  let estado = null;
  try { estado = JSON.parse(localStorage.getItem(chave)); } catch { /* sem dados */ }
  const r = estado && estado.finalizada && estado.resultado;
  if (!r) { location.replace("./home.html"); return; }    // não há prova finalizada para mostrar

  const tela = document.getElementById(r.aprovado ? "tela-aprovado" : "tela-reprovado");
  const dados = { nota: r.percentual, acertos: r.acertos, total: r.total, minimo: r.minimo || 65 };
  tela.querySelectorAll("[data-nota], [data-acertos], [data-total], [data-minimo]").forEach((el) => {
    const nome = Object.keys(dados).find((k) => el.hasAttribute("data-" + k));
    if (nome) el.textContent = dados[nome];
  });
  tela.hidden = false;

  // Tentar de novo: apaga só o progresso desta tentativa (o melhor resultado e o certificado ficam guardados)
  const tentar = document.getElementById("btn-tentar");
  if (tentar) {
    tentar.addEventListener("click", () => {
      try { localStorage.removeItem(chave); } catch { /* ok */ }
      location.href = "./questao.html";
    });
  }
})();