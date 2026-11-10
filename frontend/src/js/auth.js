/* ============================================================
   auth.js — funções compartilhadas de cadastro, login e sessão

   OBS: as contas ficam salvas no localStorage do navegador.
   Isso serve para simular o fluxo no front-end. Em um sistema
   real, cadastro e login precisam ser feitos em um servidor.
   ============================================================ */

// Todas as páginas ficam na mesma pasta, então os caminhos são relativos à página atual.
const LOGIN_URL  = new URL("login.html", location.href).href;           // tela de login
const PORTAL_URL = new URL("home.html", location.href).href;  // Área de estudos

const CHAVE_USUARIOS = "usuarios";
const CHAVE_SESSAO   = "sessao";
const CHAVE_AVISO    = "aviso";

// Endereço da API. Assumo "/api" (o nginx repassa para o backend); confirmar com o nginx.conf.
const API_BASE = "/api";

// Apaga contas e hashes de senha que versões antigas do site guardaram neste navegador.
try { localStorage.removeItem("usuarios"); } catch { /* sem acesso ao storage: ignora */ }

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

/* ---------- Login e sessão ---------- */
async function entrar({ cpf, senha, lembrar }) {
  const resposta = await apiFetch("/login", {
    metodo: "POST",
    corpo: { cpf: soDigitos(cpf), senha},
  });

  if (!resposta.ok) return { ok: false, erro: resposta.erro};

  const { token, expira_em, candidato } = resposta.dados;

    sessionStorage.removeItem(CHAVE_SESSAO);
  localStorage.removeItem(CHAVE_SESSAO);
  (lembrar ? localStorage : sessionStorage).setItem(
    CHAVE_SESSAO,
    JSON.stringify({
      token,
      expira: Date.now() + expira_em * 1000,
      id: candidato.id,
      nome: candidato.nome,
      email: candidato.email,
      cpf: soDigitos(cpf),
    })
  );
  return { ok: true };
}

function usuarioLogado() {
  try {
    const sessao = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || localStorage.getItem(CHAVE_SESSAO));
    if (!sessao || !sessao.token || Date.now() >= sessao.expira) return null;
    return sessao;
  } catch {
    return null;
  }
}

function sair() {
  sessionStorage.removeItem(CHAVE_SESSAO);
  localStorage.removeItem(CHAVE_SESSAO);
  window.location.href = LOGIN_URL;
}

function obterToken() {
  const sessao = usuarioLogado();
  return sessao && sessao.token ? sessao.token : null;
}

// Uso: const r = await apiFetch("/login", { metodo: "POST", corpo: {...} });
// Devolve sempre { ok, status, dados } em sucesso ou { ok:false, status, erro } em falha.
// privado:true envia o token; se a API responder 401, a sessão expirou e volta para o login.
async function apiFetch(caminho, { metodo = "GET", corpo, privado = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (privado) {
    const token = obterToken();
    if (!token) {
      guardarAviso("Faça login para continuar.");
      window.location.replace(LOGIN_URL);
      return { ok: false, status: 401, erro: "Sem sessão." };
    }
    headers.Authorization = "Bearer " + token;
  }

  let resposta;
  try {
    resposta = await fetch(API_BASE + caminho, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    return { ok: false, status: 0, erro: "Não foi possível falar com o servidor. Confira se ele está no ar e tente de novo." };
  }

  let dados = null;
  try { dados = await resposta.json(); } catch { /* resposta sem JSON */ }

  if (resposta.status === 401 && privado) {
    sessionStorage.removeItem(CHAVE_SESSAO);
    localStorage.removeItem(CHAVE_SESSAO);
    guardarAviso("Sua sessão expirou. Entre novamente.");
    window.location.replace(LOGIN_URL);
    return { ok: false, status: 401, erro: "Sessão expirada." };
  }

  if (!resposta.ok) {
    return { ok: false, status: resposta.status, erro: (dados && dados.erro) || "Erro inesperado do servidor." };
  }
  return { ok: true, status: resposta.status, dados };
}

// As páginas do portal chamam isto no <head>: sem sessão, volta para o login.
function exigirLogin() {
  if (!usuarioLogado()) window.location.replace(LOGIN_URL);
}

/* ---------- Mensagens na tela ---------- */
function mostrarMensagem(texto, tipo = "erro") {
  const caixa = document.getElementById("mensagem");
  caixa.textContent = texto;
  caixa.className = `mensagem ${tipo}`;
}

// Aviso que atravessa a troca de página (cadastro → login)
function guardarAviso(texto) {
  sessionStorage.setItem(CHAVE_AVISO, texto);
}

function lerAviso() {
  const texto = sessionStorage.getItem(CHAVE_AVISO);
  sessionStorage.removeItem(CHAVE_AVISO);
  return texto;
}

/* ---------- Botão "Sair" do portal ---------- */
// Qualquer elemento com id="btn-sair" passa a encerrar a sessão antes de ir ao login.
document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btn-sair");
  if (botao) {
    botao.addEventListener("click", (evento) => {
      evento.preventDefault();
      sair();
    });
  }
});