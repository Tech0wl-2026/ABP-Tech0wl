// Já está logado (ex.: marcou "Lembrar-me")? Vai direto ao portal.
if (usuarioLogado()) location.replace(PORTAL_URL);

// Mostra o aviso deixado pelo cadastro, se houver
const aviso = lerAviso();
if (aviso) mostrarMensagem(aviso, "ok");

document.getElementById("form-login").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  try {
    const resultado = await entrar({
      cpf: document.getElementById("cpf").value,
      senha: document.getElementById("senha").value,
      lembrar: document.getElementById("lembrar").checked,
    });

    if (!resultado.ok) return mostrarMensagem(resultado.erro);
    location.href = PORTAL_URL;
  } catch {
    mostrarMensagem(ERRO_NAVEGADOR);
  }
});