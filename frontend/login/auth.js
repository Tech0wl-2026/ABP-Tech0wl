/* ============================================================
   auth.js — funções compartilhadas de cadastro, login e sessão

   OBS: as contas ficam salvas no localStorage do navegador.
   Isso serve para simular o fluxo no front-end. Em um sistema
   real, cadastro e login precisam ser feitos em um servidor.
   ============================================================ */

// Os caminhos são relativos à pasta onde ESTE arquivo está (login/),
// por isso valem para qualquer página que carregue o auth.js.
const PASTA_AUTH = new URL(".", document.currentScript.src);
const LOGIN_URL  = new URL("login.html", PASTA_AUTH).href;           // tela de login
const PORTAL_URL = new URL("../portal/home.html", PASTA_AUTH).href;  // Área de estudos

const CHAVE_USUARIOS = "usuarios";
const CHAVE_SESSAO   = "sessao";
const CHAVE_AVISO    = "aviso";

const ERRO_NAVEGADOR =
  "Não foi possível concluir neste navegador. Abra o site por localhost ou https e tente de novo.";

const soDigitos = (texto) => texto.replace(/\D/g, "");

/* ---------- CPF ---------- */
function cpfValido(valor) {
  const cpf = soDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (let tamanho = 9; tamanho < 11; tamanho++) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(cpf[tamanho])) return false;
  }
  return true;
}


const paraHex = (bytes) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

const gerarSalt = () => paraHex(crypto.getRandomValues(new Uint8Array(16)));

async function gerarHash(senha, salt) {
  const dados = new TextEncoder().encode(salt + senha);
  return paraHex(new Uint8Array(await crypto.subtle.digest("SHA-256", dados)));
}

/* ---------- Usuários ---------- */
function lerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
  } catch {
    return [];
  }
}

async function cadastrar({ nome, cpf, email, senha }) {
  const usuarios = lerUsuarios();
  cpf = soDigitos(cpf);
  email = email.trim().toLowerCase();

  if (usuarios.some((u) => u.cpf === cpf)) {
    return { ok: false, erro: "Já existe uma conta com este CPF. Faça login." };
  }
  if (usuarios.some((u) => u.email === email)) {
    return { ok: false, erro: "Já existe uma conta com este e-mail. Use outro e-mail ou faça login." };
  }

  const salt = gerarSalt();
  usuarios.push({ nome: nome.trim(), cpf, email, salt, hash: await gerarHash(senha, salt) });
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
  return { ok: true };
}