/* Página de material de estudo
   Mostra SOMENTE o módulo escolhido no botão "Ver" da página de cursos.
   Aceita os dois formatos de link:
     material.html?curso=scrum | kanban-xp | ferramentas | principios
     material.html#modulo-1 ... #modulo-4
   Sem escolha válida, volta para curso.html. */
(function () {
    const modulos = Array.from(document.querySelectorAll('.modulo'));
    const barra = document.getElementById('barra-progresso');

    /* Descobre o módulo pedido */
    function moduloEscolhido() {
        const curso = new URLSearchParams(window.location.search).get('curso');
        if (curso) {
            const porCurso = modulos.find(m => m.dataset.curso === curso);
            if (porCurso) return porCurso;
        }
        const h = window.location.hash.replace('#', '');
        const n = h.match(/^modulo-(\d+)$/) || h.match(/^m(\d+)-/);
        if (n) return document.getElementById('modulo-' + n[1]);
        return null;
    }

    const escolhido = moduloEscolhido();
    if (!escolhido) {
        window.location.replace('./curso.html');
        return;
    }

    /* Esconde todos os outros */
    modulos.forEach(m => { m.hidden = (m !== escolhido); });
    document.title = escolhido.querySelector('.modulo-topo p').textContent + ' | Material de estudo';
    document.documentElement.style.setProperty('--cor', getComputedStyle(escolhido).getPropertyValue('--cor'));

    /* Links do índice (#m1-s2 etc.) rolam até a seção dentro do módulo */
    document.querySelectorAll('.indice a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const alvo = document.getElementById(a.getAttribute('href').slice(1));
            if (alvo) alvo.scrollIntoView({ behavior: 'smooth' });
        });
    });

    window.scrollTo(0, 0);

    /* Barra de progresso de leitura */
    function progresso() {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        barra.style.width = (total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 100) + '%';
    }
    window.addEventListener('scroll', progresso, { passive: true });
    window.addEventListener('resize', progresso);
    progresso();
})();