/* ============================================================
   provahome.js — mostra na home o andamento da prova

   Lê o progresso salvo pelo questao.js (mesma chave do localStorage):
   • prova pausada:    "Prova em andamento", tempo que falta, barra, selo "Pausado"
                       (o selo é um botão: volta à pergunta onde parou e continua a prova)
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
  let total = TOTAL_PERGUNTAS * TEMPO_PERGUNTA;
  if (typeof estado.tempoTotalRestante === "number" && estado.tempoTotalRestante > 0) {
    restante = estado.tempoTotalRestante;
    if (estado.tempoTotal > 0) total = estado.tempoTotal;
  } else if (Number.isInteger(estado.atual)) {
    const segsAtual = (typeof estado.restante === "number" && estado.restante > 0) ? estado.restante : TEMPO_PERGUNTA;
    const perguntasRestantes = Math.max(0, TOTAL_PERGUNTAS - 1 - estado.atual);
    restante = estado.finalizada ? 0 : segsAtual + perguntasRestantes * TEMPO_PERGUNTA;
  } else {
    restante = total;
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
      if (selo) {
        selo.textContent = (r.aprovado ? "Aprovado" : "Reprovado") + " — " + r.percentual + "%";
        selo.removeAttribute("href");                 // prova feita: o selo é só informativo
        selo.removeAttribute("title");
        selo.removeAttribute("aria-label");
        selo.classList.remove("selo-link");
        selo.hidden = false;
      }
      if (botao && botao.textContent !== "Refazer prova") botao.textContent = "Refazer prova";
    } else {
      if (titulo) titulo.textContent = "Prova em andamento";
      if (selo) {
        // o selo "Pausado" é o botão para voltar à pergunta onde parou e continuar a prova
        if (!selo.classList.contains("selo-link")) {
          const icone = document.createElement("i");
          icone.className = "bx bx-play";
          icone.setAttribute("aria-hidden", "true");
          selo.replaceChildren("Pausado ", icone);
        }
        selo.setAttribute("href", "./questao.html");
        selo.setAttribute("title", "Continuar a prova de onde parou");
        selo.setAttribute("aria-label", "Pausado. Continuar a prova de onde parou");
        selo.classList.add("selo-link");
        selo.hidden = false;
      }
      if (posicao && Number.isInteger(estado.atual)) {
        posicao.textContent = "Você parou na pergunta " + (estado.atual + 1) + ". Clique em Pausado (ou em Realizar) para continuar de onde parou.";
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

    // Se houver API e o candidato estiver logado, sincroniza com o progresso real do backend
    if (typeof apiFetch === "function" && usuarioLogado()) {
      apiFetch("/candidatos/progresso", { privado: true }).then((res) => {
        if (res.ok && res.dados && Array.isArray(res.dados.temas)) {
          const concluidos = res.dados.temas.filter((t) => t.estado === "CONCLUIDO").length;
          const emAndamento = res.dados.temas.find((t) => t.estado === "EM_ANDAMENTO");
          const totalTemas = res.dados.temas.length || TOTAL_PERGUNTAS;
          
          if (concluidos >= totalTemas) {
            estado.finalizada = true;
            estado.resultado = res.dados.resultado;
            aplicar();
          } else if (concluidos > 0 || emAndamento) {
            const indexAtual = emAndamento ? res.dados.temas.indexOf(emAndamento) : concluidos;
            const temasRestantes = Math.max(0, totalTemas - indexAtual);
            const tempoEstimado = temasRestantes * TEMPO_PERGUNTA;
            
            const textoTempoApi = String(Math.floor(tempoEstimado / 60)).padStart(2, "0") + ":" + String(tempoEstimado % 60).padStart(2, "0");
            const tempoEl = $("tempo");
            if (tempoEl && (!estado || estado.tempoTotalRestante === 0)) {
              tempoEl.textContent = textoTempoApi;
            }
            if (posicao && !posicao.textContent) {
              posicao.textContent = "Você concluiu " + concluidos + " de " + totalTemas + " temas. Clique em Realizar para continuar.";
              posicao.hidden = false;
            }
          }
        }
      }).catch(() => {});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();