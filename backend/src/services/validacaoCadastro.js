function somenteDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

function cpfValido(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(cpf[tamanho])) return false;
  }
  return true;
}

function validarCadastro(body = {}) {
  const erros = [];
  const cpf = somenteDigitos(body.cpf);
  const nome = String(body.nome ?? '').trim().replace(/\s+/g, ' ');
  const email = String(body.email ?? '').trim().toLowerCase();
  const senha = String(body.senha ?? '');

  if (!cpfValido(cpf)) erros.push({ campo: 'cpf', mensagem: 'CPF inválido' });
  if (nome.length < 5 || nome.length > 150 || nome.split(' ').length < 2)
    erros.push({ campo: 'nome', mensagem: 'Informe o nome completo' });
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    erros.push({ campo: 'email', mensagem: 'E-mail inválido' });
  if (senha.length < 8 || senha.length > 72)
    erros.push({ campo: 'senha', mensagem: 'A senha deve ter de 8 a 72 caracteres' });

  return { erros, dados: { cpf, nome, email, senha } };
}

module.exports = { validarCadastro, cpfValido };
