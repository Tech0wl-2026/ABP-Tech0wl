/* Menu hambúrguer do portal (celular).
   Abre/fecha o painel com Home, Curso e Certificado. */
(function () {
    'use strict';

    var topo = document.querySelector('.topo');
    if (!topo) return;

    var abrir  = topo.querySelector('.btn-menu');
    var fechar = topo.querySelector('.btn-menu-fechar');
    var fundo  = topo.querySelector('.menu-fundo');
    var painel = topo.querySelector('.painel-menu');
    if (!abrir || !painel) return;

    var celular = window.matchMedia('(max-width: 768px)');

    function definir(aberto) {
        topo.classList.toggle('menu-aberto', aberto);
        document.documentElement.classList.toggle('menu-travado', aberto);
        abrir.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    }

    abrir.addEventListener('click', function () {
        definir(true);
        if (fechar) fechar.focus();
    });

    function fecharMenu() {
        definir(false);
        abrir.focus();
    }

    if (fechar) fechar.addEventListener('click', fecharMenu);
    if (fundo)  fundo.addEventListener('click', fecharMenu);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && topo.classList.contains('menu-aberto')) fecharMenu();
    });


