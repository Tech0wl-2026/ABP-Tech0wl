/* ============================================================
   prova-home.js — mostra na home o andamento da prova

   Lê o progresso salvo pelo questao.js (mesma chave do localStorage)
   e preenche o tempo que falta para terminar a prova e a barra.
   Carregue DEPOIS do portal.js (os dois com "defer").
   ============================================================ */
(function () {
  const aluno = (typeof usuarioLogado === "function" && usuarioLogado()) || {};
  const chave = "prova:" + (aluno.cpf || "anonimo");   // a mesma chave do questao.js

  let estado = null;
  try { estado = JSON.parse(localStorage.getItem(chave)); } catch { /* sem dados */ }
  if (!estado || typeof estado.tempoTotalRestante !== "number") return;   // prova ainda não começou

  const total = estado.tempoTotal > 0 ? estado.tempoTotal : 1800;
  const restante = Math.max(0, Math.min(total, estado.tempoTotalRestante));

  const mm = String(Math.floor(restante / 60)).padStart(2, "0");
  const ss = String(restante % 60).padStart(2, "0");
  const percentual = Math.round((restante / total) * 100);

  const tempo = document.getElementById("tempo");
  const barra = document.getElementById("barra");
  const preenchimento = document.getElementById("barra-preenchimento");
  const botao = document.getElementById("btn-prova");

  if (tempo) tempo.textContent = mm + ":" + ss;
  if (preenchimento) preenchimento.style.width = percentual + "%";
  if (barra) barra.setAttribute("aria-valuenow", percentual);

  if (botao) {
    if (estado.finalizada) {
      // prova já feita: o botão começa uma nova tentativa (sem limite)
      botao.textContent = "Refazer prova";
      botao.addEventListener("click", () => { try { localStorage.removeItem(chave); } catch { /* ok */ } });
    } else {
      botao.textContent = "Continuar";
    }
  }
})();