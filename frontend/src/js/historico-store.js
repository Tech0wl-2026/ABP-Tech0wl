/* ============================================================
   historico-store.js — registro do histórico da certificação (RF20)

   Guarda, no navegador e por CPF, TODAS as avaliações (não só a melhor):
     historico:<cpf>  ->  { avaliacoes: [ ... ] }

   Chamado pelo questao.js (carregue este arquivo antes dele):
     HistoricoCertificacao.retomarOuIniciar(idSalvo)    // abre ou retoma a avaliação
     HistoricoCertificacao.sortearQuestao({ tema, questaoId, enunciado, alternativaCorreta })
     HistoricoCertificacao.registrarResposta("texto escolhido")   // null = avançou sem responder
     HistoricoCertificacao.registrarExpirada()          // tempo da questão acabou
     HistoricoCertificacao.interromperAtual()           // aluno saiu / fechou a prova
     HistoricoCertificacao.finalizarAvaliacao({ percentual, aprovado })

   Lido pelo historico.js:
     HistoricoCertificacao.lerHistorico()
   Precisa do auth.js carregado antes (usuarioLogado).
   ============================================================ */
(function (raiz) {
  "use strict";

  function chave() {
    const u = (typeof raiz.usuarioLogado === "function" && raiz.usuarioLogado()) || {};
    return "historico:" + (u.cpf || "anonimo");
  }
  function ler() {
    try {
      const v = JSON.parse(raiz.localStorage.getItem(chave()));
      return v && Array.isArray(v.avaliacoes) ? v : { avaliacoes: [] };
    } catch (e) { return { avaliacoes: [] }; }
  }
  function gravar(h) {
    try { raiz.localStorage.setItem(chave(), JSON.stringify(h)); } catch (e) { /* sem armazenamento */ }
  }
  const agora = () => new Date().toISOString();
  const atual = (h) => h.avaliacoes.find((a) => a.status === "em_andamento") || null;
  const questaoAberta = (a) => (a ? a.questoes.find((q) => q.situacao === "em_andamento") || null : null);

  function fecharPendentes(a) {
    const q = questaoAberta(a);
    if (q) q.situacao = "interrompida";
  }

  function iniciarAvaliacao() {
    const h = ler();
    const anterior = atual(h);
    if (anterior) {                       // havia uma prova aberta: ficou interrompida
      fecharPendentes(anterior);
      anterior.status = "interrompida";
      anterior.finalizadaEm = agora();
    }
    const a = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), status: "em_andamento", iniciadaEm: agora(), finalizadaEm: null, mediaPercentual: null, questoes: [] };
    h.avaliacoes.push(a);
    gravar(h);
    return a.id;
  }

  /* Retoma a avaliação em andamento (mesmo id) ou, se não houver, abre uma nova.
     Se havia outra aberta com id diferente (prova recomeçada), ela vira "interrompida". */
  function retomarOuIniciar(idSalvo) {
    const a = atual(ler());
    if (a && idSalvo && a.id === idSalvo) return a.id;
    return iniciarAvaliacao();
  }

  function sortearQuestao(q) {
    const h = ler(); const a = atual(h);
    if (!a) return false;
    const aberta = questaoAberta(a);
    if (aberta && String(aberta.questaoId) === String(q.questaoId)) return true;   // mesma questão ao retomar
    fecharPendentes(a);
    a.questoes.push({
      tema: q.tema, questaoId: q.questaoId, enunciado: q.enunciado,
      alternativaCorreta: q.alternativaCorreta,
      situacao: "em_andamento", respostaEscolhida: null, respondidaEm: null,
    });
    gravar(h);
    return true;
  }

  function mudarQuestao(fn) {
    const h = ler(); const a = atual(h); const q = questaoAberta(a);
    if (!q) return false;
    fn(q); gravar(h);
    return true;
  }

  const registrarResposta = (resp) => mudarQuestao((q) => { q.situacao = "respondida"; q.respostaEscolhida = resp; q.respondidaEm = agora(); });
  const registrarExpirada = () => mudarQuestao((q) => { q.situacao = "expirada"; q.respondidaEm = null; });

  function interromperAtual() {
    const h = ler(); const a = atual(h);
    if (!a) return false;
    fecharPendentes(a);
    a.status = "interrompida"; a.finalizadaEm = agora();
    gravar(h);
    return true;
  }

  function finalizarAvaliacao(r) {
    const h = ler(); const a = atual(h);
    if (!a) return false;
    fecharPendentes(a);
    a.status = r.aprovado ? "aprovada" : "reprovada";
    a.mediaPercentual = r.percentual;
    a.finalizadaEm = agora();
    gravar(h);
    return true;
  }

  raiz.HistoricoCertificacao = {
    iniciarAvaliacao, retomarOuIniciar, sortearQuestao, registrarResposta, registrarExpirada,
    interromperAtual, finalizarAvaliacao, lerHistorico: ler,
  };
})(typeof window !== "undefined" ? window : globalThis);