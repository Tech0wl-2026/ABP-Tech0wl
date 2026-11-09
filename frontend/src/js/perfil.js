/* Página de perfil
   - Seus dados: salvos no navegador (localStorage) e usados no nome do banner
   - Seu progresso / Trilha: lidos do que o aluno já estudou (material.js grava) e da prova (home)
   Chaves usadas no localStorage:
     aa_perfil              -> { nome, cpf, meta, sobre }
     aa_modulos_concluidos  -> ["scrum", "kanban-xp", ...]  (gravado pelo material.js ao terminar a leitura)
     aa_prova_concluida     -> "true" quando a prova do curso for finalizada (grave isto na home) */
(function () {
    /* ---------- Dados dos módulos (temas = seções de cada apostila) ---------- */
    const MODULOS = [
        { id: 'scrum',       numero: 1, titulo: 'Scrum',                                         temas: 5 },
        { id: 'kanban-xp',   numero: 2, titulo: 'Kanban x XP',                                   temas: 2 },
        { id: 'ferramentas', numero: 3, titulo: 'Ferramentas e boas práticas para projetos ágeis', temas: 2 },
        { id: 'principios',  numero: 4, titulo: 'Princípios e práticas da agilidade',            temas: 3 }
    ];
    const TOTAL_TEMAS = MODULOS.reduce((t, m) => t + m.temas, 0);

    /* ---------- localStorage seguro ---------- */
    function ler(chave, padrao) {
        try {
            const v = localStorage.getItem(chave);
            return v === null ? padrao : v;
        } catch (e) { return padrao; }
    }
    function gravar(chave, valor) {
        try { localStorage.setItem(chave, valor); return true; } catch (e) { return false; }
    }
    function lerJSON(chave, padrao) {
        try { return JSON.parse(ler(chave, '')) || padrao; } catch (e) { return padrao; }
    }

    /* ---------- Seus dados ---------- */
    const form = document.getElementById('form-dados');
    const campos = {
        nome: document.getElementById('nome'),
        cpf: document.getElementById('cpf'),
        meta: document.getElementById('meta'),
        sobre: document.getElementById('sobre')
    };
    const nomeBanner = document.getElementById('nome-banner');
    const msgSalvo = document.getElementById('msg-salvo');

    function atualizarBanner() {
        const nome = campos.nome.value.trim();
        if (nome) nomeBanner.textContent = nome;
    }

    const salvo = lerJSON('aa_perfil', null);
    if (salvo) {
        Object.keys(campos).forEach(k => { if (salvo[k] !== undefined) campos[k].value = salvo[k]; });
        atualizarBanner();
    }

    campos.cpf.addEventListener('input', () => {
        campos.cpf.value = campos.cpf.value.replace(/[^\d.\-]/g, '');
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nomeOk = campos.nome.value.trim().length > 0;
        campos.nome.classList.toggle('erro', !nomeOk);
        if (!nomeOk) { campos.nome.focus(); return; }

        const dados = {};
        Object.keys(campos).forEach(k => { dados[k] = campos[k].value; });
        gravar('aa_perfil', JSON.stringify(dados));
        atualizarBanner();

        msgSalvo.hidden = false;
        clearTimeout(msgSalvo._t);
        msgSalvo._t = setTimeout(() => { msgSalvo.hidden = true; }, 2500);
    });

    /* ---------- Progresso e trilha ---------- */
    const concluidos = lerJSON('aa_modulos_concluidos', []);
    const provaOk = ler('aa_prova_concluida', 'false') === 'true';
    const todosOk = MODULOS.every(m => concluidos.includes(m.id));

    function selo(el, ok, textoOk, textoNao) {
        el.textContent = ok ? textoOk : textoNao;
        el.classList.toggle('ok', ok);
    }
    selo(document.getElementById('selo-prova'), provaOk, 'concluído', 'pendente');
    selo(document.getElementById('selo-cert'), provaOk && todosOk, 'liberado', 'bloqueado');

    const temasFeitos = MODULOS.filter(m => concluidos.includes(m.id)).reduce((t, m) => t + m.temas, 0);
    const pct = Math.round((temasFeitos / TOTAL_TEMAS) * 100);
    document.getElementById('resumo').textContent =
        temasFeitos + ' de ' + TOTAL_TEMAS + ' temas concluídos (' + pct + '%)';
    document.getElementById('barra-trilha').style.width = pct + '%';
    document.querySelector('.barra-trilha').setAttribute('aria-valuenow', pct);

    /* Lista de módulos (cada card abre o material daquele módulo) */
    const lista = document.getElementById('lista-modulos');
    const nenhum = document.getElementById('nenhum');

    lista.innerHTML = MODULOS.map(m => {
        const ok = concluidos.includes(m.id);
        return '<li class="modulo-item" data-status="' + (ok ? 'concluidos' : 'pendentes') + '">' +
            '<a href="./material.html?curso=' + m.id + '" title="Abrir o material de ' + m.titulo + '">' +
            '<span class="icone-status ' + (ok ? '' : 'pendente') + '" aria-hidden="true">' +
            '<i class="bx ' + (ok ? 'bx-check' : 'bx-x') + '"></i></span>' +
            '<span class="modulo-texto"><strong>' + m.titulo + '</strong><small>Módulo ' + m.numero + '</small></span>' +
            '<span class="selo ' + (ok ? 'ok' : '') + '">' + (ok ? 'concluído' : 'pendente') + '</span>' +
            '</a></li>';
    }).join('');

    /* Filtros: Todos / Pendentes / Concluídos */
    const botoes = document.querySelectorAll('.filtro');
    function filtrar(tipo) {
        let visiveis = 0;
        lista.querySelectorAll('.modulo-item').forEach(li => {
            const mostrar = tipo === 'todos' || li.dataset.status === tipo;
            li.hidden = !mostrar;
            if (mostrar) visiveis++;
        });
        nenhum.hidden = visiveis > 0;
        botoes.forEach(b => b.classList.toggle('ativo', b.dataset.filtro === tipo));
    }
    botoes.forEach(b => b.addEventListener('click', () => filtrar(b.dataset.filtro)));
    filtrar('todos');
})();