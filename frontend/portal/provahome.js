/* ============================================================
   prova-home.js — mostra na home o andamento da prova

   Lê o progresso salvo pelo questao.js (mesma chave do localStorage):
   • prova pausada:    "Prova em andamento", tempo que falta, barra, selo "Pausado"
   • prova finalizada: selo Aprovado/Reprovado e botão "Refazer prova"

   Se o portal.js também escrever no cronômetro/barra, este script
   reaplica o tempo da prova (não depende da ordem dos scripts).
   ============================================================ */
(function () {
  const TOTAL_PERGUNTAS = 12;      // usado só para provas salvas antes do campo tempoTotalRestante existir
  const TEMPO_PERGUNTA = 150;

  const aluno = (typeof usuarioLogado === "function" && usuarioLogado()) || {};
  const chave = "prova:" + (aluno.cpf || "anonimo");   // a mesma chave do questao.js

  let estado = null;
  try { estado = JSON.parse(localStorage.getItem(chave)); } catch { /* sem dados */ }
  if (!estado) return;                                  // prova ainda não começou

  // segundos que faltam para terminar a prova inteira
  let restante;
  let total;
  if (typeof estado.tempoTotalRestante === "number") {
    restante = estado.tempoTotalRestante;
    total = estado.tempoTotal > 0 ? estado.tempoTotal : TOTAL_PERGUNTAS * TEMPO_PERGUNTA;
  } else if (Number.isInteger(estado.atual) && typeof estado.restante === "number") {
    total = TOTAL_PERGUNTAS * TEMPO_PERGUNTA;
    restante = estado.finalizada ? 0 : estado.restante + (TOTAL_PERGUNTAS - 1 - estado.atual) * TEMPO_PERGUNTA;
  } else {
    return;
  }
  restante = Math.max(0, Math.min(total, restante));
  const percentual = Math.round((restante / total) * 100);
  const textoTempo = String(Math.floor(restante / 60)).padStart(2, "0") + ":" + String(restante % 60).padStart(2, "0");

  const $ = (id) => document.getElementById(id);

  function aplicar() {
    const tempo = $("tempo");
    const barra = $("barra");
    const preenchimento = $("barra-preenchimento");
    const botao = $("btn-prova");
    const selo = $("selo-pausado");
    const posicao = $("prova-posicao");
    const titulo = document.querySelector(".prova h3");

    if (tempo && tempo.textContent !== textoTempo) tempo.textContent = textoTempo;
    if (preenchimento && preenchimento.style.width !== percentual + "%") preenchimento.style.width = percentual + "%";
    if (barra) barra.setAttribute("aria-valuenow", percentual);

    if (estado.finalizada && estado.resultado) {
      const r = estado.resultado;
      if (titulo) titulo.textContent = "Prova finalizada";
      if (selo) { selo.textContent = (r.aprovado ? "Aprovado" : "Reprovado") + " — " + r.percentual + "%"; selo.hidden = false; }
      if (botao && botao.textContent !== "Refazer prova") botao.textContent = "Refazer prova";
    } else {
      if (titulo) titulo.textContent = "Prova em andamento";
      if (selo) { selo.textContent = "Pausado"; selo.hidden = false; }
      if (posicao && Number.isInteger(estado.atual)) {
        posicao.textContent = "Você parou na pergunta " + (estado.atual + 1) + ". Clique em Realizar para continuar de onde parou.";
        posicao.hidden = false;
      }
    }
  }

  function iniciar() {
    aplicar();

    // prova já feita: o botão começa uma nova tentativa (sem limite)
    const botao = $("btn-prova");
    if (botao && estado.finalizada) {
      botao.addEventListener("click", () => { try { localStorage.removeItem(chave); } catch { /* ok */ } });
    }

    // se outro script mexer no cronômetro ou na barra, reaplica o tempo da prova
    const alvos = [$("tempo"), $("barra-preenchimento")].filter(Boolean);
    if (alvos.length && "MutationObserver" in window) {
      const observador = new MutationObserver(aplicar);
      alvos.forEach((el) => observador.observe(el, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["style"] }));
    }
    window.addEventListener("load", aplicar);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();