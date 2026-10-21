export function falhar(status, mensagem) {
  const erro = new Error(mensagem);
  erro.status = status;
  throw erro;
}

export function idValido(valor) {
  if (!/^\d+$/.test(String(valor)) || !Number.isSafeInteger(Number(valor)) || Number(valor) < 1) {
    falhar(400, 'Identificador inválido.');
  }
  return Number(valor);
}

export function tratarErro(erro, req, res, next) {
  if (res.headersSent) return next(erro);
  if (erro.code === '23505') return res.status(409).json({erro: 'Registro já existente.'});
  if (erro.type === 'entity.parse.failed') return res.status(400).json({erro: 'JSON inválido.'});
  if (erro.type === 'entity.too.large') return res.status(413).json({erro: 'Corpo da requisição muito grande.'});
  const status = Number.isInteger(erro.status) && erro.status >= 400 && erro.status < 500 ? erro.status : 500;
  if (status === 500) console.error('Falha interna na API:', erro.code || erro.name);
  res.status(status).json({erro: status === 500 ? 'Não foi possível concluir a operação.' : erro.message});
}
