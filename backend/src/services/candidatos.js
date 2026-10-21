import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {falhar} from '../erros.js';

export function validarCredenciais(body, cadastro = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) falhar(400, 'Informe os dados em JSON.');
  const {cpf, senha, nome, email} = body;
  if (typeof cpf !== 'string' || !/^\d{11}$/.test(cpf)) falhar(400, 'CPF deve conter 11 dígitos, sem pontuação.');
  if (typeof senha !== 'string' || senha.length < 6 || Buffer.byteLength(senha, 'utf8') > 72) {
    falhar(400, 'Senha deve ter pelo menos 6 caracteres e no máximo 72 bytes.');
  }
  if (cadastro && (typeof nome !== 'string' || !nome.trim() || nome.trim().length > 100)) falhar(400, 'Nome deve ter de 1 a 100 caracteres.');
  if (cadastro && (typeof email !== 'string' || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) falhar(400, 'E-mail inválido.');
  return {cpf, senha, nome: cadastro ? nome.trim() : undefined, email: cadastro ? email.trim() : undefined};
}

export async function cadastrarCandidato(pool, body) {
  const {cpf, nome, email, senha} = validarCredenciais(body, true);
  const senhaHash = await bcrypt.hash(senha, 12);
  const {rows} = await pool.query(`INSERT INTO candidatos(cpf,nome,email,senha_hash)
    VALUES ($1,$2,$3,$4) RETURNING id,cpf,nome,email,criado_em`, [cpf,nome,email,senhaHash]);
  return rows[0];
}

export async function login(pool, body, segredo, hashFicticio) {
  const {cpf, senha} = validarCredenciais(body);
  const {rows} = await pool.query('SELECT id,nome,email,senha_hash FROM candidatos WHERE cpf=$1', [cpf]);
  const candidato = rows[0];
  const confere = await bcrypt.compare(senha, candidato?.senha_hash || hashFicticio);
  if (!candidato || !confere) falhar(401, 'CPF ou senha incorretos.');
  const token = jwt.sign({}, segredo, {
    subject: String(candidato.id), algorithm: 'HS256', expiresIn: '1h',
    issuer: 'portal-certificacao-api', audience: 'portal-certificacao',
  });
  return {token, tipo: 'Bearer', expira_em: 3600,
    candidato: {id:candidato.id, nome:candidato.nome, email:candidato.email}};
}
