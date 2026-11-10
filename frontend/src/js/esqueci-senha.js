/* Recuperação de senha por email — usado pelas duas páginas:
 *   esqueci_senha.html (#form-esqueci)    → gera o link de redefinição e envia por email
 *   senha_nov.html     (#form-nova-senha) → confere o link e grava a nova senha
 *
 * Não há servidor: os usuários ficam no localStorage ("usuarios", como no resto do site)
 * e o email sai pelo EmailJS (emailjs.com). Preencha as 3 chaves abaixo.
 *
 * No template do EmailJS: campo "To email" = {{to_email}} e, no texto, use
 * {{nome}}, {{link}} e {{validade}} (minutos).
 */
(function () {
    'use strict';

    /* ---------- CONFIGURAÇÃO ---------- */
    const EMAILJS = {
        serviceId: 'SEU_SERVICE_ID',    // Email Services → Service ID
        templateId: 'SEU_TEMPLATE_ID',  // Email Templates → Template ID
        publicKey: 'SUA_PUBLIC_KEY'     // Account → General → Public Key
    };
    const VALIDADE_MIN = 30;    // minutos de validade do link
    const INTERVALO_SEG = 60;   // espera mínima entre dois pedidos de link
    const MIN_SENHA = 6;

    const CHAVE_USUARIOS = 'usuarios';
    const CHAVE_PEDIDOS = 'redefinicoesSenha';        // { [hash do token]: { email, expira } }
    const CHAVE_ULTIMO = 'redefinicaoUltimoPedido';

    /* ---------- UTILITÁRIOS ---------- */
    const $ = (id) => document.getElementById(id);
    const normalizar = (email) => String(email || '').trim().toLowerCase();
    const aHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    const configurado = () => Object.values(EMAILJS).every((v) => v && !/^(SEU|SUA)_/.test(v));

    async function sha256(texto) {
        const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
        return aHex(new Uint8Array(buffer));
    }

    const novoToken = () => aHex(crypto.getRandomValues(new Uint8Array(32)));

    function ler(chave, padrao) {
        try { return JSON.parse(localStorage.getItem(chave)) || padrao; } catch (e) { return padrao; }
    }
    const gravar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

    function mostrar(texto, tipo) {            // tipo: "erro" ou "ok" (classes do mensagens.css)
        const el = $('mensagem');
        el.textContent = texto;
        el.className = 'mensagem ' + tipo;
    }

    function carregando(botao, ligado, texto) {
        if (!botao.dataset.texto) botao.dataset.texto = botao.textContent;
        botao.disabled = ligado;
        botao.textContent = ligado ? texto : botao.dataset.texto;
    }

    /* ---------- PASSO 1: pedir o link (esqueci_senha.html) ---------- */
    function montarLink(token) {
        const url = new URL('senha-nov.html', window.location.href);
        url.searchParams.set('token', token);
        return url.href;
    }

    async function enviarEmail(para, nome, link) {
        const resposta = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: EMAILJS.serviceId,
                template_id: EMAILJS.templateId,
                user_id: EMAILJS.publicKey,
                template_params: { to_email: para, nome: nome, link: link, validade: VALIDADE_MIN }
            })
        });
        if (!resposta.ok) throw new Error('EmailJS ' + resposta.status + ': ' + (await resposta.text()));
    }

    function iniciarPedido(form) {
        const botao = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const campo = $('email');
            const email = normalizar(campo.value);
            if (!email || !campo.validity.valid) {
                mostrar('Digite um email válido, como nome@exemplo.com.', 'erro');
                return;
            }

            const espera = INTERVALO_SEG * 1000 - (Date.now() - Number(localStorage.getItem(CHAVE_ULTIMO) || 0));
            if (espera > 0) {
                mostrar('Aguarde ' + Math.ceil(espera / 1000) + ' segundos para pedir outro link.', 'erro');
                return;
            }

            if (!configurado()) {
                mostrar('O envio de email ainda não foi configurado. Preencha as chaves do EmailJS no início do arquivo esqueci-senha.js.', 'erro');
                return;
            }

            carregando(botao, true, 'Enviando...');
            const pedidosAntes = localStorage.getItem(CHAVE_PEDIDOS);
            try {
                const usuario = ler(CHAVE_USUARIOS, []).find((u) => normalizar(u && u.email) === email);

                if (usuario) {
                    const token = novoToken();
                    const pedidos = ler(CHAVE_PEDIDOS, {});
                    Object.keys(pedidos).forEach((hash) => {   // remove links vencidos e o anterior deste email
                        if (pedidos[hash].expira < Date.now() || pedidos[hash].email === email) delete pedidos[hash];
                    });
                    // No localStorage fica só o hash do token; o token em si vai apenas no email.
                    pedidos[await sha256(token)] = { email: email, expira: Date.now() + VALIDADE_MIN * 60000 };
                    gravar(CHAVE_PEDIDOS, pedidos);

                    const primeiroNome = String(usuario.nome || 'aluno(a)').trim().split(' ')[0];
                    await enviarEmail(email, primeiroNome, montarLink(token));

                    localStorage.setItem(CHAVE_ULTIMO, String(Date.now()));
                    mostrar('Link enviado para ' + email + '! Ele vale por ' + VALIDADE_MIN + ' minutos. Confira também a caixa de spam.', 'ok');
                } else {
                    mostrar('Não encontramos uma conta com este email neste navegador. Confira o endereço ou faça o cadastro.', 'erro');
                }
            } catch (erro) {
                console.error('[esqueci-senha]', erro);
                if (pedidosAntes === null) localStorage.removeItem(CHAVE_PEDIDOS);
                else localStorage.setItem(CHAVE_PEDIDOS, pedidosAntes);
                mostrar('Não foi possível enviar o email. Detalhe: ' + (erro && erro.message ? erro.message : erro), 'erro');
            } finally {
                carregando(botao, false);
            }
        });
    }

    /* ---------- PASSO 2: criar a nova senha (senha_nov.html) ---------- */
    async function buscarPedido(token) {
        if (!token) return null;
        const hash = await sha256(token);
        const pedido = ler(CHAVE_PEDIDOS, {})[hash];
        return pedido && pedido.expira >= Date.now() ? { hash: hash, email: pedido.email } : null;
    }

    function iniciarNovaSenha(form) {
        const token = new URLSearchParams(window.location.search).get('token') || '';
        const botao = $('btn-definir');
        const campos = $('campos');

        function bloquear(texto) {   // link inválido, vencido ou já usado: esconde o formulário e oferece um novo link
            campos.style.display = 'none';
            botao.style.display = 'none';
            $('pedir-novo').style.display = '';
            mostrar(texto, 'erro');
        }

        const AVISO_LINK = 'Este link é inválido, expirou ou já foi usado. Se ele é recente, abra-o no mesmo navegador em que pediu a redefinição; senão, peça um novo link.';

        (async () => {   // já avisa ao abrir a página se o link não vale
            try {
                if (!(await buscarPedido(token))) bloquear(AVISO_LINK);
            } catch (erro) {
                console.error('[esqueci-senha]', erro);
            }
        })();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const senha = $('senha').value;
            if (senha.length < MIN_SENHA) {
                mostrar('A senha precisa ter pelo menos ' + MIN_SENHA + ' caracteres.', 'erro');
                return;
            }
            if (senha !== $('confirmar').value) {
                mostrar('As senhas não são iguais. Digite a mesma senha nos dois campos.', 'erro');
                return;
            }

            carregando(botao, true, 'Salvando...');
            try {
                const pedido = await buscarPedido(token);   // confere de novo: o link pode ter vencido com a página aberta
                if (!pedido) { bloquear(AVISO_LINK); return; }

                const usuarios = ler(CHAVE_USUARIOS, []);
                const i = usuarios.findIndex((u) => normalizar(u && u.email) === pedido.email);
                if (i === -1) { bloquear('Não encontramos a conta deste link. Peça um novo link.'); return; }

                // Mesmo formato do auth.js (gerarSalt/gerarHash): hash = SHA-256(salt + senha), com salt novo.
                const salt = aHex(crypto.getRandomValues(new Uint8Array(16)));
                usuarios[i].salt = salt;
                usuarios[i].hash = await sha256(salt + senha);
                delete usuarios[i].senhaHash;
                gravar(CHAVE_USUARIOS, usuarios);

                const pedidos = ler(CHAVE_PEDIDOS, {});
                delete pedidos[pedido.hash];                // o link só vale uma vez
                gravar(CHAVE_PEDIDOS, pedidos);

                campos.style.display = 'none';
                botao.style.display = 'none';
                mostrar('Senha alterada! Você será levado ao login para entrar com a nova senha.', 'ok');
                setTimeout(() => { window.location.href = 'login.html'; }, 2500);
            } catch (erro) {
                console.error('[esqueci-senha]', erro);
                mostrar('Não foi possível salvar a nova senha. Tente novamente.', 'erro');
            } finally {
                carregando(botao, false);
            }
        });
    }

    /* ---------- INÍCIO: cada página só ativa o seu formulário ---------- */
    if ($('form-esqueci')) iniciarPedido($('form-esqueci'));
    if ($('form-nova-senha')) iniciarNovaSenha($('form-nova-senha'));
})();