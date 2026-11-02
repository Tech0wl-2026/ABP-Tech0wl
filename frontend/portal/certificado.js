/* ============================================================
   certificado.js — aprovação, certificado e download (PDF)

   • Certificado.registrar(resultado)  chamado pelo questao.js ao finalizar
   • Certificado.status()              { aprovado, certificado }
   • Certificado.baixar()              gera e baixa o certificado em PDF
   • Certificado.preencher()           preenche perfil/certificado pelos data-atributos

   Guarda no navegador (por CPF), e NÃO é apagado ao refazer a prova:
     prova-melhor:<cpf>   melhor resultado entre todas as tentativas
     certificado:<cpf>    código, data e nota do certificado (criado na 1ª aprovação)

   Precisa do ../login/auth.js carregado antes (usuarioLogado).
   ============================================================ */
(function () {
  const aluno = (typeof usuarioLogado === "function" && usuarioLogado()) || {};
  const quem = aluno.cpf || "anonimo";
  const CHAVE_MELHOR = "prova-melhor:" + quem;
  const CHAVE_CERT = "certificado:" + quem;
  const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

  function ler(chave) {
    try { return JSON.parse(localStorage.getItem(chave)); } catch { return null; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* sem armazenamento */ }
  }

  // ex.: VRCERT-22026-JUN18
  function novoCodigo(data) {
    const digito = 1 + Math.floor(Math.random() * 9);
    const dia = String(data.getDate()).padStart(2, "0");
    return `VRCERT-${digito}${data.getFullYear()}-${MESES[data.getMonth()]}${dia}`;
  }

  function registrar(resultado) {
    if (!resultado) return;
    const melhor = ler(CHAVE_MELHOR);
    if (!melhor || resultado.percentual >= melhor.percentual) gravar(CHAVE_MELHOR, resultado);
    if (!resultado.aprovado) return;

    const cert = ler(CHAVE_CERT);
    const nota = { percentual: resultado.percentual, acertos: resultado.acertos, total: resultado.total };
    if (!cert) {
      const agora = new Date();
      gravar(CHAVE_CERT, { codigo: novoCodigo(agora), data: agora.toISOString(), ...nota });
    } else if (resultado.percentual > cert.percentual) {
      gravar(CHAVE_CERT, { ...cert, ...nota });           // o código e a data continuam os mesmos
    }
  }

  function status() {
    let cert = ler(CHAVE_CERT);
    if (!cert) {                                           // aprovado antes deste recurso existir
      const melhor = ler(CHAVE_MELHOR);
      if (melhor && melhor.aprovado) { registrar(melhor); cert = ler(CHAVE_CERT); }
    }
    return { aprovado: !!cert, certificado: cert };
  }

  /* ---------- DESENHO DO CERTIFICADO (A4 paisagem) ---------- */
  function desenhar(cert) {
    const L = 1684, A = 1190;
    const c = document.createElement("canvas");
    c.width = L; c.height = A;
    const g = c.getContext("2d");
    const serif = 'Georgia, "Times New Roman", serif';
    const sans = 'Helvetica, Arial, sans-serif';

    g.fillStyle = "#ffffff"; g.fillRect(0, 0, L, A);
    g.strokeStyle = "#7611D4"; g.lineWidth = 18; g.strokeRect(40, 40, L - 80, A - 80);
    g.strokeStyle = "#BDB8DC"; g.lineWidth = 4;  g.strokeRect(78, 78, L - 156, A - 156);

    g.textAlign = "center";
    const texto = (t, y, tam, cor, fam, peso) => {
      g.font = `${peso || "normal"} ${tam}px ${fam}`;
      g.fillStyle = cor;
      g.fillText(t, L / 2, y);
    };

    texto("APRENDIZAGEM ÁGIL", 190, 34, "#7611D4", sans, "bold");
    texto("Certificado de conclusão", 310, 96, "#12084a", serif);
    texto("Certificamos que", 410, 38, "#555555", sans);

    const nome = aluno.nome || aluno.name || "Aluno(a)";
    let tam = 96;
    do { g.font = `bold ${tam}px ${serif}`; tam -= 4; } while (g.measureText(nome).width > L - 300 && tam > 32);
    g.fillStyle = "#2A1A8A"; g.fillText(nome, L / 2, 540);
    g.fillRect(L / 2 - 460, 575, 920, 3);

    texto("concluiu com aproveitamento o curso de Aprendizagem Ágil,", 665, 40, "#222222", sans);
    texto(`com nota de ${cert.percentual}% na prova de certificação (${cert.acertos} de ${cert.total} questões corretas).`, 722, 40, "#222222", sans);
    texto("Emitido em " + new Date(cert.data).toLocaleDateString("pt-BR"), 820, 36, "#555555", sans);

    texto("Validação de autenticidade", 940, 36, "#12084a", sans, "bold");
    texto("Identificador do certificado:", 995, 30, "#555555", sans);
    texto(cert.codigo, 1060, 52, "#7611D4", '"Courier New", monospace', "bold");
    return c;
  }

  /* ---------- PDF mínimo com uma imagem JPEG na página ---------- */
  function montarPdf(jpeg, w, h) {
    const enc = new TextEncoder();
    const partes = [];
    const inicio = [];
    let tam = 0;
    const add = (x) => { const b = typeof x === "string" ? enc.encode(x) : x; partes.push(b); tam += b.length; };
    const obj = (n, corpo, fluxo) => {
      inicio[n] = tam;
      add(`${n} 0 obj\n${corpo}\n`);
      if (fluxo !== undefined) { add("stream\n"); add(fluxo); add("\nendstream\n"); }
      add("endobj\n");
    };
    const PW = 842, PH = 595;                      // A4 paisagem, em pontos
    const pagina = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;

    add("%PDF-1.4\n");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
    obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
    obj(4, `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`, jpeg);
    obj(5, `<< /Length ${pagina.length} >>`, pagina);

    const xref = tam;
    let tabela = "xref\n0 6\n0000000000 65535 f \n";
    for (let n = 1; n <= 5; n++) tabela += String(inicio[n]).padStart(10, "0") + " 00000 n \n";
    add(tabela + `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: "application/pdf" });
  }

  function baixar() {
    const { certificado } = status();
    if (!certificado) return false;
    const canvas = desenhar(certificado);
    canvas.toBlob(async (jpg) => {
      const bytes = new Uint8Array(await jpg.arrayBuffer());
      const url = URL.createObjectURL(montarPdf(bytes, canvas.width, canvas.height));
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificado-aprendizagem-agil.pdf";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/jpeg", 0.92);
    return true;
  }

  /* ---------- PÁGINAS (perfil e certificado), pelos data-atributos ---------- */
  function preencher() {
    const { aprovado, certificado } = status();
    const marcar = (el, ok, textoOk, textoNao) => {
      el.textContent = ok ? textoOk : textoNao;
      el.dataset.estado = ok ? "ok" : "pendente";
    };

    document.querySelectorAll("[data-prova-status]").forEach((el) => marcar(el, aprovado, "concluído", "pendente"));
    document.querySelectorAll("[data-cert-status]").forEach((el) => marcar(el, aprovado, "liberado", "bloqueado"));
    document.querySelectorAll("[data-cert-liberado]").forEach((el) => { el.hidden = !aprovado; });
    document.querySelectorAll("[data-cert-bloqueado]").forEach((el) => { el.hidden = aprovado; });

    if (certificado) {
      document.querySelectorAll("[data-cert-codigo]").forEach((el) => { el.textContent = certificado.codigo; });
      document.querySelectorAll("[data-cert-nota]").forEach((el) => { el.textContent = certificado.percentual + "%"; });
    }
    document.querySelectorAll("[data-cert-baixar]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); baixar(); }));
    document.querySelectorAll("[data-cert-copiar]").forEach((el) => el.addEventListener("click", () => {
      const cod = certificado && certificado.codigo;
      if (cod && navigator.clipboard) navigator.clipboard.writeText(cod).catch(() => {});
      document.querySelectorAll("[data-cert-dica]").forEach((dica) => {
        const antes = dica.dataset.original || dica.textContent;
        dica.dataset.original = antes;
        dica.textContent = "Código copiado!";
        setTimeout(() => { dica.textContent = antes; }, 2000);
      });
    }));
  }

  window.Certificado = { registrar, status, baixar, preencher };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", preencher);
  else preencher();
})();