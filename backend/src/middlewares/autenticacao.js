import jwt from 'jsonwebtoken';

export function autenticacao(segredo) {
  return (req, res, next) => {
    const partes = /^Bearer ([^\s]+)$/i.exec(req.get('Authorization') || '');
    if (!partes) return res.status(401).json({erro: 'Use Authorization: Bearer TOKEN.'});
    try {
      const dados = jwt.verify(partes[1], segredo, {
        algorithms: ['HS256'], issuer: 'portal-certificacao-api', audience: 'portal-certificacao',
      });
      if (!/^\d+$/.test(dados.sub || '') || !Number.isSafeInteger(Number(dados.sub)) || Number(dados.sub) < 1) {
        return res.status(401).json({erro: 'Token inválido ou expirado.'});
      }
      req.candidatoId = Number(dados.sub);
      next();
    } catch {
      res.status(401).json({erro: 'Token inválido ou expirado.'});
    }
  };
}
