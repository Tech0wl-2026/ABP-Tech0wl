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

    /* Quadro "Temas que você acertou" x "Temas para revisar" */
    function resumirDesempenho(prova, porTema) {
        var el = document.getElementById('desempenho');
        if (!el) return;
        el.textContent = '';

        if (!prova) {
            el.className = 'desempenho vazio';
            el.textContent = 'Faça a prova para ver em quais temas você acertou e em quais errou.';
            return;
        }
        if (!porTema) {
            el.className = 'desempenho vazio';
            el.textContent = 'Refaça a prova para ver seu desempenho por tema (acertos e erros).';
            return;
        }

        var acertou = [], revisar = [];
        TEMAS.forEach(function (t) {
            var d = porTema[t.id];
            if (!d) return;
            (d.acertos === d.total ? acertou : revisar).push(t.titulo);
        });

        el.className = 'desempenho';
        function grupo(classe, rotulo, nomes, vazio) {
            var g = document.createElement('div');
            g.className = 'grupo ' + classe;
            var h = document.createElement('strong');
            h.textContent = rotulo;
            var p = document.createElement('span');
            p.textContent = nomes.length ? nomes.join(', ') : vazio;
            g.append(h, p);
            return g;
        }
        el.append(
            grupo('acertou', '\u2713 Temas em que você acertou tudo', acertou, 'nenhum ainda'),
            grupo('revisar', '\u2717 Temas para revisar (com erros)', revisar, 'nenhum, ótimo!')
        );
    }

    function desenhar() {
        var feitos = concluidos();
        var aprovado = provaAprovada();
        var cert = null;
        try { cert = aprovado ? window.Certificado.status().certificado : null; } catch (e) { /* segue */ }

        var prova = desempenhoDaProva();
        var porTema = prova && prova.temas ? prova.temas : null;

        lista.textContent = '';
        var total = TEMAS.length + 1, feitas = 0;

        TEMAS.forEach(function (tema, i) {
            var ok = feitos.indexOf(tema.id) !== -1;
            if (ok) feitas++;
            lista.append(etapa(
                tema.titulo, ok,
                'Tema ' + (i + 1) + (ok ? ' · leitura concluída' : ' · ainda não concluído'),
                './material.html?curso=' + tema.id,
                ok ? 'Rever' : 'Estudar',
                'concluído',
                porTema ? porTema[tema.id] : null
            ));
        });

        if (aprovado) feitas++;
        lista.append(etapa(
            'Prova do curso', aprovado,
            aprovado
                ? 'Aprovado' + (cert && cert.percentual != null ? ' · ' + cert.percentual + '%' : '')
                : 'Nota mínima de 65% para liberar o certificado',
            './questao.html',
            aprovado ? 'Refazer' : 'Fazer prova',
            'concluída'
        ));

        resumirDesempenho(prova, porTema);

        var temasFeitos = TEMAS.filter(function (t) { return feitos.indexOf(t.id) !== -1; }).length;
        var pct = Math.round((feitas / total) * 100);
        var faltam = total - feitas;

        resumo.textContent = temasFeitos + ' de ' + TEMAS.length + ' temas concluídos'
            + (aprovado ? ' e prova aprovada.' : ' · prova pendente.')
            + (faltam ? ' Faltam ' + faltam + (faltam === 1 ? ' etapa.' : ' etapas.') : ' Tudo pronto!');
        enchente.style.width = pct + '%';
        barra.setAttribute('aria-valuenow', String(pct));
        barra.setAttribute('aria-valuetext', pct + '% concluído');
        barra.dataset.completo = pct === 100 ? 'true' : 'false';
        document.getElementById('progresso-pct').textContent = pct + '%';
    }

    desenhar();
    window.addEventListener('pageshow', desenhar);   // voltou pelo histórico: atualiza
    window.addEventListener('storage', desenhar);    // outra aba concluiu algo
})();
