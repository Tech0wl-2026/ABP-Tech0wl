/* Feedback do curso — script.js */
(() => {
  'use strict';

  /* ===== 1. Estado e elementos da página ===== */
  const CHAVE = 'feedbacks-v1';   // chave usada no localStorage
  const NOTA_PADRAO = 5;          // o design começa com 5 estrelas

  const $ = (seletor) => document.querySelector(seletor);
  const form = $('#form');
  const estrelas = [...document.querySelectorAll('#rate button')];
  const campoAssunto = $('#topic');
  const campoMensagem = $('#text');
  const aviso = $('#msg');
  const lista = $('#list');
  const vazio = $('#empty');

  let nota = NOTA_PADRAO;
  let feedbacks = carregar();

  /* ===== 2. Armazenamento (localStorage) ===== */
  function carregar() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]');
      return Array.isArray(dados) ? dados : [];
    } catch (erro) {
      return [];
    }
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(feedbacks));
    } catch (erro) {
      /* sem armazenamento disponível: o feedback vale só nesta sessão */
    }
  }

  /* ===== 3. Avaliação por estrelas (formulário) ===== */
  function pintarEstrelas(valor) {
    estrelas.forEach((botao, i) => {
      botao.classList.toggle('on', i < valor);
      botao.setAttribute('aria-checked', String(i + 1 === nota));
    });
  }

  estrelas.forEach((botao, i) => {
    botao.addEventListener('click', () => { nota = i + 1; pintarEstrelas(nota); });
    botao.addEventListener('mouseenter', () => pintarEstrelas(i + 1)); // prévia ao passar o mouse
  });
  $('#rate').addEventListener('mouseleave', () => pintarEstrelas(nota));

  /* ===== 4. Mensagem de aviso (erro ou sucesso) ===== */
  function mostrarAviso(texto, tipo = '') {
    aviso.textContent = texto;
    aviso.className = tipo;       // 'ok' ou 'err'
  }

  /* ===== 5. Lista “Seus feedbacks” ===== */
  // Cria um elemento com classe e texto (textContent evita injeção de HTML)
  function criar(tag, classe = '', texto = '') {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  }

  function criarEstrelas(valor) {
    const caixa = criar('span', 'mini');
    caixa.setAttribute('role', 'img');
    caixa.setAttribute('aria-label', `${valor} de 5 estrelas`);
    for (let i = 1; i <= 5; i++) {
      caixa.insertAdjacentHTML('beforeend',
        `<svg class="${i <= valor ? 'on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><use href="#star"/></svg>`);
    }
    return caixa;
  }

  function criarPonto() {
    const ponto = criar('span', '', '•');
    ponto.setAttribute('aria-hidden', 'true');
    return ponto;
  }

  function desenharLista() {
    lista.replaceChildren();
    vazio.hidden = feedbacks.length > 0;

    feedbacks.forEach((item) => {
      const data = new Date(item.date);
      const dataTexto = isNaN(data) ? '' : data.toLocaleDateString('pt-BR');

      const linhaTopo = criar('div', 'meta');
      linhaTopo.append(criarEstrelas(item.rating), criarPonto(), criar('span', '', item.topic));

      const botaoExcluir = criar('button', 'link', 'excluir');
      botaoExcluir.type = 'button';
      botaoExcluir.addEventListener('click', () => excluir(item.id));

      const linhaData = criar('div', 'meta');
      linhaData.append(criar('span', '', dataTexto), criarPonto(), botaoExcluir);

      const li = criar('li');
      li.append(linhaTopo, linhaData, criar('p', '', item.message));
      lista.append(li);
    });
  }

  function excluir(id) {
    feedbacks = feedbacks.filter((item) => item.id !== id);
    salvar();
    desenharLista();
  }

  /* ===== 6. Envio do formulário ===== */
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const assunto = campoAssunto.value;
    const mensagem = campoMensagem.value.trim();

    if (!assunto) {
      mostrarAviso('Escolha o assunto do seu feedback.', 'err');
      campoAssunto.focus();
      return;
    }
    if (mensagem.length < 3) {
      mostrarAviso('Escreva sua mensagem para enviar o feedback.', 'err');
      campoMensagem.focus();
      return;
    }

    feedbacks.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      rating: nota,
      topic: assunto,
      message: mensagem,
      date: new Date().toISOString(),
    });
    salvar();
    desenharLista();

    // limpa o formulário para um novo envio
    campoAssunto.selectedIndex = 0;
    campoMensagem.value = '';
    nota = NOTA_PADRAO;
    pintarEstrelas(nota);
    mostrarAviso('Obrigado! Seu feedback foi enviado.', 'ok');
  });

  // o aviso some assim que a pessoa volta a editar
  [campoAssunto, campoMensagem].forEach((campo) =>
    campo.addEventListener('input', () => mostrarAviso('')));

  /* ===== 7. Navegação (links só ilustrativos) ===== */
  document.querySelectorAll('.nav a').forEach((link) =>
    link.addEventListener('click', (evento) => evento.preventDefault()));

  /* ===== 8. Início ===== */
  pintarEstrelas(nota);
  desenharLista();
})();
