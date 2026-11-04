document.getElementById("form-cadastro").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome      =  document.getElementById("nome").value.trim();
  const cpf       =  document.getElementById("cpf").value;
  const email     =  document.getElementById("email").value;
  const senha     =  document.getElementById("senha").value;
  const confirmar =  document.getElementById("confirmar").value;

  if (nome.split(/\s+/).length < 2) return mostrarMensagem("Informe nome e sobrenome.");
  if (!cpfValido(cpf))              return mostrarMensagem("CPF inválido. Confira os 11 números.");
  if (senha.length < 6)             return mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.");
  if (senha !== confirmar)          return mostrarMensagem("As senhas não coincidem. Digite a mesma senha nos dois campos.");

  try {
    const resultado = await cadastrar({ nome, cpf, email, senha });
    if (!resultado.ok) return mostrarMensagem(resultado.erro);

    guardarAviso("Cadastro realizado! Entre com seu CPF e senha para acessar o portal.");
    location.href = LOGIN_URL;
  } catch {
    mostrarMensagem(ERRO_NAVEGADOR);
  }
});