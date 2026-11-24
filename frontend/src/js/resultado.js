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

  function mostrar(res) {
    ["tela-aprovado", "tela-reprovado"].forEach((id) => { document.getElementById(id).hidden = true; });
    const tela = document.getElementById(res.aprovado ? "tela-aprovado" : "tela-reprovado");
    const dados = { nota: res.percentual, acertos: res.acertos, total: res.total, minimo: res.minimo || 65 };
    tela.querySelectorAll("[data-nota], [data-acertos], [data-total], [data-minimo]").forEach((el) => {
      const nome = Object.keys(dados).find((k) => el.hasAttribute("data-" + k));
      if (nome) el.textContent = dados[nome];
    });
    tela.hidden = false;
  }
  mostrar(r);

  // A nota oficial é a do servidor: confirma e, se for diferente, corrige a tela.
  if (typeof apiFetch === "function" && aluno.token) {
    apiFetch("/candidatos/resultado", { privado: true }).then((res) => {
      const d = res.ok && res.dados;
      if (!d || !d.concluido) return;
      const oficial = { ...r, acertos: d.acertos, total: 12, percentual: d.percentual, aprovado: d.aprovado };
      mostrar(oficial);
      try { localStorage.setItem(chave, JSON.stringify({ ...estado, resultado: oficial })); } catch { /* ok */ }
    }).catch(() => {});
  }

  // Tentar de novo: apaga só o progresso desta tentativa (o melhor resultado e o certificado ficam guardados)
  const tentar = document.getElementById("btn-tentar");
  if (tentar) {
    tentar.addEventListener("click", () => {
      try { localStorage.removeItem(chave); } catch { /* ok */ }
      location.href = "./questao.html";
    });
  }
})();