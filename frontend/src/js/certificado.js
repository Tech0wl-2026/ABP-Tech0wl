/* ============================================================
   certificado.js — aprovação, certificado e download (PDF)

   • Certificado.registrar(resultado)  chamado pelo questao.js ao finalizar
   • Certificado.status()              { aprovado, certificado }
   • Certificado.melhorResultado()     melhor tentativa da prova (acertos, percentual e temas)
   • Certificado.baixar()              gera e baixa o certificado em PDF (layout TechOwl)
   • Certificado.preencher()           preenche perfil/certificado pelos data-atributos

   Guarda no navegador (por CPF), e NÃO é apagado ao refazer a prova:
     prova-melhor:<cpf>   melhor resultado entre todas as tentativas
     certificado:<cpf>    código, data e nota do certificado (criado na 1ª aprovação)

   Precisa do auth.js carregado antes (usuarioLogado).
   ============================================================ */
(function () {
  /* ---------- AJUSTES DO CERTIFICADO ---------- */
  const CURSO         = "Introdução à Tecnologia";           // texto de "Curso concluído"
  const LOGO_SRC      = "src/images/logo-tech0wl.png";        // logo (PNG, de preferência com fundo transparente)
  const VALIDACAO_URL = "https://seusite.com.br/validar";    // o QR Code aponta para: URL?codigo=XXXX
  const ASSINATURA    = { nome: "Guilherme Akio Kanahara", cargo: "CEO", rubrica: "G Akio K" };

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

  /* ---------- RECURSOS EXTERNOS ---------- */
  function carregarScript(src) {
    return new Promise((ok, erro) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = erro;
      document.head.append(s);
    });
  }

  function carregarImagem(src) {
    return new Promise((ok) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => ok(null);
      img.src = src;
    });
  }

  async function carregarFontes() {
    if (!document.getElementById("fontes-certificado")) {
      const l = document.createElement("link");
      l.id = "fontes-certificado";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,700;0,800;1,800&family=Mrs+Saint+Delafield&display=swap";
      document.head.append(l);
    }
    try {
      await Promise.all([
        document.fonts.load("800 80px Montserrat"),
        document.fonts.load("italic 800 80px Montserrat"),
        document.fonts.load("500 20px Montserrat"),
        document.fonts.load("700 20px Montserrat"),
        document.fonts.load("70px 'Mrs Saint Delafield'"),
      ]);
    } catch { /* usa a fonte reserva */ }
  }

  /* ---------- DESENHO DO CERTIFICADO (layout TechOwl) ---------- */
  const W = 1492, H = 1054;
  const AZUL_ESCURO = "#0a1048", AZUL = "#1a2fa0";
  const SANS = "Montserrat, Arial, sans-serif";

  function poligono(g, pontos) {
    g.beginPath();
    pontos.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
  }

  function hexagono(g, cx, cy, r) {
    const p = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i * Math.PI) / 3;
      p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    poligono(g, p);
  }

  function fundo(g) {
    const f = g.createLinearGradient(0, 0, W, H);
    f.addColorStop(0, "#f7f9fe"); f.addColorStop(1, "#e8ecf8");
    g.fillStyle = f; g.fillRect(0, 0, W, H);

    const a = [[0, 0], [700, 0], [655, 40], [440, 40], [385, 95], [255, 95], [200, 140], [0, 290]];
    const ga = g.createLinearGradient(0, 0, 700, 290);
    ga.addColorStop(0, "#040a30"); ga.addColorStop(1, "#0b2186");
    g.fillStyle = ga; poligono(g, a); g.fill();
    g.save();
    g.strokeStyle = "#3d72ff"; g.lineWidth = 3; g.shadowColor = "#3d72ff"; g.shadowBlur = 14;
    g.beginPath(); a.slice(1).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    g.restore();

    const b = [[W, H], [640, H], [695, 1015], [950, 1015], [1005, 965], [1300, 965], [1360, 910], [W, 740]];
    const gb = g.createLinearGradient(W, H, 640, 740);
    gb.addColorStop(0, "#040a30"); gb.addColorStop(1, "#0b2186");
    g.fillStyle = gb; poligono(g, b); g.fill();
    g.save();
    g.strokeStyle = "#3d72ff"; g.lineWidth = 3; g.shadowColor = "#3d72ff"; g.shadowBlur = 14;
    g.beginPath(); b.slice(1, 7).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    g.restore();

    g.lineWidth = 3;
    g.strokeStyle = "#cfd6ee"; hexagono(g, 88, 168, 30); g.stroke();
    g.fillStyle = "#0a1c6e"; hexagono(g, 88, 340, 52); g.fill();
    g.strokeStyle = "#2a55e8"; g.lineWidth = 5; hexagono(g, 88, 340, 40); g.stroke();
    g.fillStyle = "#2a55e8";
    for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(1458, 572 + i * 24, 6, 0, 7); g.fill(); }
    g.fillStyle = "rgba(255,255,255,.45)";
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) g.fillRect(70 + c * 24, 70 + r * 24, 5, 5);

    g.strokeStyle = "rgba(42,85,232,.5)"; g.lineWidth = 1.5;
    g.strokeRect(20, 20, W - 40, H - 40);
  }

  function icone(g, tipo, cx, cy) {
    g.save();
    g.fillStyle = "#0a1448"; hexagono(g, cx, cy, 33); g.fill();
    g.strokeStyle = "#e5ebff"; g.fillStyle = "#e5ebff"; g.lineWidth = 2.5; g.lineJoin = "round"; g.lineCap = "round";
    if (tipo === "email") {
      g.strokeRect(cx - 15, cy - 10, 30, 20);
      g.beginPath(); g.moveTo(cx - 15, cy - 10); g.lineTo(cx, cy + 3); g.lineTo(cx + 15, cy - 10); g.stroke();
    } else if (tipo === "estrela") {
      const p = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 7 : 16, an = -Math.PI / 2 + (i * Math.PI) / 5;
        p.push([cx + r * Math.cos(an), cy + 1 + r * Math.sin(an)]);
      }
      poligono(g, p); g.stroke();
    } else if (tipo === "alvo") {
      [15, 9].forEach((r) => { g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); });
      g.beginPath(); g.arc(cx, cy, 2.5, 0, 7); g.fill();
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + 16, cy - 16); g.stroke();
    } else if (tipo === "calendario") {
      g.strokeRect(cx - 15, cy - 13, 30, 27);
      g.beginPath(); g.moveTo(cx - 15, cy - 5); g.lineTo(cx + 15, cy - 5);
      g.moveTo(cx - 8, cy - 17); g.lineTo(cx - 8, cy - 10); g.moveTo(cx + 8, cy - 17); g.lineTo(cx + 8, cy - 10); g.stroke();
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) g.fillRect(cx - 10 + c * 8, cy + r * 8, 4, 4);
    } else if (tipo === "escudo") {
      g.beginPath(); g.moveTo(cx, cy - 17); g.lineTo(cx + 15, cy - 11); g.lineTo(cx + 15, cy + 2);
      g.quadraticCurveTo(cx + 13, cy + 12, cx, cy + 18); g.quadraticCurveTo(cx - 13, cy + 12, cx - 15, cy + 2);
      g.lineTo(cx - 15, cy - 11); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(cx - 7, cy + 1); g.lineTo(cx - 2, cy + 6); g.lineTo(cx + 8, cy - 5); g.stroke();
    } else if (tipo === "capelo") {
      poligono(g, [[cx, cy - 14], [cx + 20, cy - 4], [cx, cy + 6], [cx - 20, cy - 4]]); g.stroke();
      g.beginPath(); g.moveTo(cx - 11, cy + 1); g.lineTo(cx - 11, cy + 10);
      g.quadraticCurveTo(cx, cy + 17, cx + 11, cy + 10); g.lineTo(cx + 11, cy + 1); g.stroke();
    }
    g.restore();
  }

  function itemInfo(g, tipo, x, y, rotulo, valor, destaque) {
    icone(g, tipo, x, y);
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.fillStyle = AZUL; g.font = "700 20px " + SANS;
    g.fillText(rotulo, x + 54, y - 4);
    g.fillStyle = "#101541";
    g.font = (destaque ? "800 24px " : "500 20px ") + SANS;
    g.fillText(valor, x + 54, y + 24);
  }

  function desenharQr(g, texto, x, y, lado) {
    g.fillStyle = "#fff"; g.strokeStyle = "#2a55e8"; g.lineWidth = 3;
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, lado, lado, 14); else g.rect(x, y, lado, lado);
    g.fill(); g.stroke();
    if (typeof window.qrcode !== "function") return;
    const qr = window.qrcode(0, "M"); qr.addData(texto); qr.make();
    const n = qr.getModuleCount(), pad = 14, cel = (lado - pad * 2) / n;
    g.fillStyle = "#050b2e";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) g.fillRect(x + pad + c * cel, y + pad + r * cel, Math.ceil(cel), Math.ceil(cel));
  }

  function formatarCpf(v) {
    const n = String(v || "").replace(/\D/g, "");
    return n.length === 11 ? n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : String(v || "");
  }

  async function desenhar(cert) {
    await carregarFontes();
    try { if (typeof window.qrcode !== "function") await carregarScript("https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"); } catch { /* sem QR */ }
    const logo = await carregarImagem(LOGO_SRC);

    const quando = new Date(cert.data);
    const d = {
      nome: aluno.nome || aluno.name || "Aluno(a)",
      cpf: formatarCpf(aluno.cpf),
      email: aluno.email || "",
      nota: (cert.percentual / 10).toFixed(1).replace(".", ","),
      percentual: cert.percentual + "%",
      dataHora: quando.toLocaleDateString("pt-BR") + " às " + quando.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      dataExtenso: quando.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
    };

    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");

    fundo(g);
    g.textBaseline = "alphabetic"; g.textAlign = "center";

    g.fillStyle = AZUL_ESCURO; g.font = "800 84px " + SANS;
    g.fillText("CERTIFICADO", 750, 222);
    g.fillStyle = AZUL; g.font = "500 32px " + SANS;
    if ("letterSpacing" in g) g.letterSpacing = "6px";
    g.fillText("DE PARTICIPAÇÃO", 750, 274);
    if ("letterSpacing" in g) g.letterSpacing = "0px";

    g.strokeStyle = "#3a56c8"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(458, 300); g.lineTo(662, 300); g.moveTo(824, 300); g.lineTo(1048, 300); g.stroke();
    g.beginPath(); g.moveTo(703, 300); g.lineTo(743, 312); g.lineTo(783, 300); g.stroke();

    g.fillStyle = "#101541"; g.font = "500 25px " + SANS;
    g.fillText("Este certificado comprova que", 750, 350);

    // nome (reduz a fonte se for muito longo)
    let tam = 84;
    do { g.font = "italic 800 " + tam + "px " + SANS; tam -= 2; } while (g.measureText(d.nome).width > 900 && tam > 30);
    const largura = g.measureText(d.nome).width;
    const gr = g.createLinearGradient(772 - largura / 2, 0, 772 + largura / 2, 0);
    gr.addColorStop(0, "#0a1048"); gr.addColorStop(0.5, "#2236b8"); gr.addColorStop(1, "#6a5acd");
    g.fillStyle = gr; g.fillText(d.nome, 772, 452);

    g.fillStyle = "#101541"; g.font = "500 22px " + SANS;
    g.fillText("inscrito sob o número do CPF:", 750, 505);
    g.font = "800 32px " + SANS; g.fillText(d.cpf, 750, 545);

    g.strokeStyle = "#8fa0dc"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(263, 575); g.lineTo(1235, 575); g.stroke();
    g.beginPath(); g.moveTo(651, 600); g.lineTo(651, 812); g.stroke();

    itemInfo(g, "email", 301, 626, "E-mail:", d.email);
    itemInfo(g, "estrela", 301, 698, "Nota final obtida:", d.nota, true);
    itemInfo(g, "alvo", 301, 776, "Percentual de acertos:", d.percentual, true);
    itemInfo(g, "calendario", 713, 626, "Data e hora de emissão:", d.dataHora);
    itemInfo(g, "escudo", 713, 702, "Certificado emitido em:", d.dataExtenso);
    itemInfo(g, "capelo", 713, 778, "Curso concluído:", CURSO);

    // QR Code + identificador
    desenharQr(g, VALIDACAO_URL + "?codigo=" + encodeURIComponent(cert.codigo), 1064, 600, 158);
    g.fillStyle = "#0a1448"; g.beginPath();
    if (g.roundRect) g.roundRect(1051, 779, 181, 28, 14); else g.rect(1051, 779, 181, 28);
    g.fill();
    g.fillStyle = "#fff"; g.font = "700 14px " + SANS; g.textAlign = "center";
    g.fillText("VALIDAR CERTIFICADO", 1141, 798);
    g.fillStyle = "#101541"; g.font = "500 16px " + SANS;
    ["Escaneie o QR Code", "para validar a autenticidade", "deste certificado."].forEach((t, i) => g.fillText(t, 1142, 832 + i * 21));
    g.fillStyle = AZUL; g.font = "700 15px " + SANS;
    g.fillText(cert.codigo, 1142, 898);

    // assinatura
    g.fillStyle = "#101541"; g.textAlign = "left"; g.font = "78px 'Mrs Saint Delafield', cursive";
    g.fillText(ASSINATURA.rubrica, 222, 902);
    g.strokeStyle = "#6b7ac0"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(207, 918); g.lineTo(470, 918); g.stroke();
    g.textAlign = "center"; g.fillStyle = AZUL_ESCURO; g.font = "700 20px " + SANS;
    g.fillText(ASSINATURA.nome, 340, 947);
    g.fillStyle = "#101541"; g.font = "500 20px " + SANS; g.fillText(ASSINATURA.cargo, 340, 974);

    // logo
    if (logo) {
      const esc = Math.min(300 / logo.width, 260 / logo.height);
      g.drawImage(logo, 1280 - (logo.width * esc) / 2, 90, logo.width * esc, logo.height * esc);
    } else {
      g.fillStyle = AZUL_ESCURO; g.font = "800 54px " + SANS; g.textAlign = "center"; g.fillText("TechOwl", 1280, 300);
    }
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
    const PW = 842, PH = Math.round(PW * h / w);   // página com a mesma proporção do certificado (≈ A4 paisagem)
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

  async function baixar() {
    const { certificado } = status();
    if (!certificado) return false;
    const canvas = await desenhar(certificado);
    const jpg = await new Promise((ok) => canvas.toBlob(ok, "image/jpeg", 0.95));
    const bytes = new Uint8Array(await jpg.arrayBuffer());
    const url = URL.createObjectURL(montarPdf(bytes, canvas.width, canvas.height));
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificado-techowl.pdf";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
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

  function melhorResultado() { return ler(CHAVE_MELHOR); }   // inclui o desempenho por tema (temas)

  window.Certificado = { registrar, status, baixar, preencher, melhorResultado };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", preencher);
  else preencher();
})();