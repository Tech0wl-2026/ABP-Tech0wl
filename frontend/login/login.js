// Já está logado (ex.: marcou "Lembrar-me")? Vai direto ao portal.
if (usuarioLogado()) location.replace(PORTAL_URL);

// Mostra o aviso deixado pelo cadastro, se houver
const aviso = lerAviso();
if (aviso) mostrarMensagem(aviso, "ok");