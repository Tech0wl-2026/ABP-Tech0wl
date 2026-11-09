/* Progresso do aluno na certificação (página certificado.html).
   Etapas: os 4 temas (módulos) do material + a prova do curso.
   Lê:  aa_modulos_concluidos  (gravado pelo material.js ao terminar a leitura)
        Certificado.status()   (aprovação na prova, do certificado.js) */
(function () {
    'use strict';

    var TEMAS = [
        { id: 'scrum',       titulo: 'Scrum' },
        { id: 'kanban-xp',   titulo: 'Kanban x XP' },
        { id: 'ferramentas', titulo: 'Ferramentas e boas práticas para projetos ágeis' },
        { id: 'principios',  titulo: 'Princípios e práticas da agilidade' }
    ];

    var lista    = document.getElementById('lista-etapas');
    var resumo   = document.getElementById('progresso-resumo');
    var barra    = document.getElementById('progresso-barra');
    var enchente = document.getElementById('progresso-preenchimento');
    if (!lista || !resumo || !barra || !enchente) return;

    function concluidos() {
        try {
            var v = JSON.parse(localStorage.getItem('aa_modulos_concluidos') || '[]');
            return Array.isArray(v) ? v : [];
        } catch (e) { return []; }
    }

    function provaAprovada() {
        try {
            return !!(window.Certificado && window.Certificado.status().aprovado);
        } catch (e) { return false; }
    }

    /* Desempenho na prova: melhor tentativa, com acertos/erros de cada tema */
    function desempenhoDaProva() {
        try {
            return (window.Certificado && window.Certificado.melhorResultado()) || null;
        } catch (e) { return null; }
    }

    function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

    function blocoDesempenho(d) {
        var el = document.createElement('div');
        el.className = 'etapa-desempenho';
        var texto = document.createElement('span');
        var errou = d.total - d.acertos;
        texto.className = 'desempenho-texto';
        texto.textContent = 'Na prova: ' + plural(d.acertos, 'acerto', 'acertos') + ' · ' + plural(errou, 'erro', 'erros');
        var pontos = document.createElement('span');
        pontos.className = 'pontos';
        (d.itens || []).forEach(function (ok, i) {
            var p = document.createElement('span');
            p.className = 'ponto ' + (ok ? 'certa' : 'errada');
            p.textContent = ok ? '\u2713' : '\u2717';
            p.title = 'Questão ' + (i + 1) + (ok ? ': acertou' : ': errou');
            pontos.append(p);
        });
        el.append(texto, pontos);
        return el;
    }

    function etapa(titulo, ok, detalhe, href, textoLink, textoOk, desempenho) {
        var li = document.createElement('li');
        li.className = 'etapa';
        li.dataset.situacao = ok ? 'ok' : 'pendente';

        var marca = document.createElement('span');
        marca.className = 'etapa-marca';
        marca.setAttribute('aria-hidden', 'true');

        var corpo = document.createElement('div');
        corpo.className = 'etapa-corpo';
        var t = document.createElement('strong');
        t.textContent = titulo;
        var d = document.createElement('small');
        d.textContent = detalhe;
        corpo.append(t, d);
        if (desempenho) corpo.append(blocoDesempenho(desempenho));

        var selo = document.createElement('span');
        selo.className = 'etapa-selo';
        selo.textContent = ok ? textoOk : 'pendente';

        var a = document.createElement('a');
        a.className = 'etapa-link';
        a.href = href;
        a.textContent = textoLink;
        a.setAttribute('aria-label', textoLink + ': ' + titulo);

        li.append(marca, corpo, selo, a);
        return li;
    }

    