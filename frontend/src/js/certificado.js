/* ============================================================
   certificado.js — aprovação, certificado e download (PDF)

   • Certificado.registrar(resultado)  chamado pelo questao.js ao finalizar
   • Certificado.status()              { aprovado, certificado }
   • Certificado.baixar()              gera e baixa o certificado em PDF (a partir da imagem do modelo)
   • Certificado.preencher()           preenche perfil/certificado pelos data-atributos

   Guarda no navegador (por CPF), e NÃO é apagado ao refazer a prova:
     prova-melhor:<cpf>   melhor resultado entre todas as tentativas
     certificado:<cpf>    código, data e nota do certificado (criado na 1ª aprovação)

   Precisa do auth.js carregado antes (usuarioLogado).
   ============================================================ */

(function () {
  /* ---------- AJUSTES DO CERTIFICADO ---------- */
  const CURSO         = "Certificação em Metodologias Ágeis";           // texto de "Curso concluído"
  const MODELO_SRC    = "src/images/certificado-modelo.jpg";  // imagem do certificado (sem os dados do aluno)
  const VALIDACAO_URL = new URL("validar.html", location.href).href;    // o QR Code aponta para: validar.html?codigo=XXXX
  const QRCODE_SRC    = "src/js/Qrcode.js";   // biblioteca local: a CSP do Nginx bloqueia scripts de CDN

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

    // Emissão no backend via API caso autenticado
    if (typeof apiFetch === "function" && usuarioLogado()) {
      apiFetch("/candidatos/certificado", { metodo: "POST", privado: true }).then((res) => {
        if (res.ok && res.dados) {
          const dadosCert = {
            codigo: res.dados.certificado_hash || novoCodigo(new Date()),
            data: res.dados.emitido_em || new Date().toISOString(),
            percentual: resultado.percentual,
            acertos: resultado.acertos,
            total: resultado.total
          };
          gravar(CHAVE_CERT, dadosCert);
        }
      }).catch(() => {});
    }

    const cert = ler(CHAVE_CERT);
    const nota = { percentual: resultado.percentual, acertos: resultado.acertos, total: resultado.total };
    if (!cert) {
      const agora = new Date();
      gravar(CHAVE_CERT, { codigo: novoCodigo(agora), data: agora.toISOString(), ...nota });
    } else if (resultado.percentual > cert.percentual) {
      gravar(CHAVE_CERT, { ...cert, ...nota });           // o código e a data continuam os mesmos
    }
  }

  // O código oficial é o emitido pela API (o mesmo que a página validar.html consulta).
  async function sincronizarComServidor() {
    if (typeof apiFetch !== "function" || !usuarioLogado()) return false;
    try {
      const res = await apiFetch("/candidatos/certificado", { metodo: "POST", privado: true });
      if (!res.ok || !res.dados || !res.dados.certificado_hash) return false;
      const dados = res.dados.dados || {};
      gravar(CHAVE_CERT, {
        codigo: res.dados.certificado_hash,
        data: res.dados.emitido_em || new Date().toISOString(),
        percentual: dados.percentual != null ? Number(dados.percentual) : undefined,
        acertos: dados.acertos,
        total: dados.total || 12,
      });
      return true;
    } catch { return false; }
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
      l.href = "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,700;0,800;1,800&display=swap";
      document.head.append(l);
    }
    try {
      await Promise.all([
        document.fonts.load("800 80px Montserrat"),
        document.fonts.load("italic 800 80px Montserrat"),
        document.fonts.load("500 20px Montserrat"),
        document.fonts.load("700 20px Montserrat"),
      ]);
    } catch { /* usa a fonte reserva */ }
  }

  /* ---------- DESENHO DO CERTIFICADO (imagem do modelo + dados do aluno) ---------- */
  // O modelo (fundo, título, logos, ícones, rótulos, assinatura e moldura do QR Code) vem da imagem MODELO_SRC.
  // Aqui só são escritos os dados de cada aluno por cima dela.
  const W = 1492, H = 1054;                       // tamanho da imagem do modelo
  const AZUL = "#1a2fa0";
  const TEXTO = "#101541";
  const SANS = "Montserrat, Arial, sans-serif";

  // ---- POSIÇÕES (medidas sobre a imagem do modelo 1492×1054) ----
  // x/y = canto esquerdo da linha de base do texto; "cx" = centro horizontal
  const POS = {
    nome:       { cx: 772,  y: 455, max: 900, tam: 84 },
    cpf:        { cx: 744,  y: 547 },
    email:      { x: 334,   y: 645 },
    nota:       { x: 334,   y: 722 },
    percentual: { x: 334,   y: 799 },
    dataHora:   { x: 767,   y: 649 },
    dataExtenso:{ x: 767,   y: 724 },
    curso:      { x: 767,   y: 800 },
    qr:         { x: 1078,  y: 603, lado: 174 },   // moldura do QR Code (módulos ocupam lado - 2×14)
    codigo:     { cx: 1165, y: 902 },
  };

  // Se a imagem do modelo ainda traz os dados de exemplo (ex.: "Mariana Costa Ferreira"),
  // estas áreas são apagadas com a cor de fundo ao redor antes de escrever os dados reais.
  // Use false quando o modelo já estiver em branco.
  const LIMPAR_AMOSTRA = true;
  const AREAS_AMOSTRA = [
    [300, 372, 940, 100],   // nome
    [610, 514, 270, 44],    // CPF
    [328, 626, 276, 26],    // e-mail
    [328, 702, 60, 28],     // nota
    [328, 780, 70, 28],     // percentual
    [764, 628, 240, 26],    // data e hora
    [764, 704, 240, 26],    // data por extenso
    [764, 780, 240, 26],    // curso
    [1090, 611, 150, 155, "#f8f9fc"],  // interior da moldura do QR Code (cor fixa: a borda é escura)
  ];

  function limparAmostra(g) {
    AREAS_AMOSTRA.forEach(([x, y, w, h, cor]) => {
      if (!cor) {                                          // cor de fundo = ponto mais claro logo ao redor da área
        const pontos = [[x - 4, y + h / 2], [x + w / 2, y - 4], [x + w / 2, y + h + 4], [x + w + 4, y + h / 2]];
        let melhor = -1;
        pontos.forEach(([px, py]) => {
          const d = g.getImageData(Math.max(Math.round(px), 0), Math.max(Math.round(py), 0), 1, 1).data;
          const brilho = d[0] + d[1] + d[2];
          if (brilho > melhor) { melhor = brilho; cor = `rgb(${d[0]},${d[1]},${d[2]})`; }
        });
      }
      g.fillStyle = cor;
      g.fillRect(x, y, w, h);
    });
  }

  function dado(g, p, valor, destaque) {
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.fillStyle = TEXTO;
    g.font = (destaque ? "800 24px " : "500 20px ") + SANS;
    g.fillText(valor, p.x, p.y);
  }

  // desenha só os módulos do QR Code dentro da moldura que já existe na imagem
  function desenharQr(g, texto, x, y, lado) {
    if (typeof window.qrcode !== "function") return;
    const qr = window.qrcode(0, "L"); qr.addData(texto); qr.make();
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
    try { if (typeof window.qrcode !== "function") await carregarScript(QRCODE_SRC); } catch { /* sem QR */ }
    const modelo = await carregarImagem(MODELO_SRC);
    if (!modelo) return null;

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
    g.drawImage(modelo, 0, 0, W, H);
    g.textBaseline = "alphabetic";
    if (LIMPAR_AMOSTRA) limparAmostra(g);

    // nome (itálico 800, degradê azul → violeta; reduz a fonte se for longo)
    const pn = POS.nome;
    g.textAlign = "center";
    let tam = pn.tam;
    do { g.font = "italic 800 " + tam + "px " + SANS; tam -= 2; } while (g.measureText(d.nome).width > pn.max && tam > 30);
    const largura = g.measureText(d.nome).width;
    const gr = g.createLinearGradient(pn.cx - largura / 2, 0, pn.cx + largura / 2, 0);
    gr.addColorStop(0, "#0a1048"); gr.addColorStop(0.5, "#2236b8"); gr.addColorStop(1, "#6a5acd");
    g.fillStyle = gr; g.fillText(d.nome, pn.cx, pn.y);

    // CPF (centralizado, negrito)
    g.fillStyle = TEXTO; g.font = "800 32px " + SANS; g.textAlign = "center";
    g.fillText(d.cpf, POS.cpf.cx, POS.cpf.y);

    // coluna esquerda: e-mail, nota, percentual
    dado(g, POS.email, d.email);
    dado(g, POS.nota, d.nota, true);
    dado(g, POS.percentual, d.percentual, true);
    // coluna direita: data/hora, data por extenso, curso
    dado(g, POS.dataHora, d.dataHora);
    dado(g, POS.dataExtenso, d.dataExtenso);
    dado(g, POS.curso, CURSO);

    // QR Code dentro da moldura + código de validação abaixo do texto
    const q = POS.qr;
    // o QR leva só o código: a página pública consulta a API e não expõe CPF nem e-mail
    desenharQr(g, VALIDACAO_URL + "?codigo=" + encodeURIComponent(cert.codigo), q.x, q.y, q.lado);
    g.textAlign = "center"; g.fillStyle = AZUL; g.font = "700 15px " + SANS;
    // o código da API tem 64 caracteres: no PDF aparece abreviado (o QR leva o código completo)
    const codigo = String(cert.codigo);
    g.fillText(codigo.length > 20 ? codigo.slice(0, 10) + "…" + codigo.slice(-6) : codigo, POS.codigo.cx, POS.codigo.y);
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
    await sincronizarComServidor();
    const { certificado } = status();
    if (!certificado) return false;
    const canvas = await desenhar(certificado);
    if (!canvas) { alert("Não foi possível carregar a imagem do certificado."); return false; }
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
    sincronizarComServidor().then((ok) => {
      const atual = ok && status().certificado;
      if (atual) document.querySelectorAll("[data-cert-codigo]").forEach((el) => { el.textContent = atual.codigo; });
    });
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
