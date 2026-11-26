/* ============================================================
   curso-temas.js — lista os 12 temas oficiais da certificação
   na área de estudos (RF07 / RP07), consumindo GET /api/temas.
   ============================================================ */
(function () {
  const MAPA_MODULO = [
    "material.html?curso=principios",
    "material.html?curso=principios",
    "material.html?curso=scrum",
    "material.html?curso=scrum",
    "material.html?curso=scrum",
    "material.html?curso=scrum",
    "material.html?curso=kanban-xp",
    "material.html?curso=kanban-xp",
    "material.html?curso=kanban-xp",
    "material.html?curso=ferramentas",
    "material.html?curso=ferramentas",
    "material.html?curso=ferramentas",
  ];

  const IMAGENS = [
    "src/images/fig-principios.png",
    "src/images/curso-principios.png",
    "src/images/fig-scrum.png",
    "src/images/curso-scrum.png",
    "src/images/logoPO.png",
    "src/images/logoSM.png",
    "src/images/fig-kanban.jpg",
    "src/images/fig-xp.png",
    "src/images/curso-kanban-xp.png",
    "src/images/fig-ferramentas.png",
    "src/images/fig-boas-praticas.jpg",
    "src/images/curso-ferramentas.png",
  ];

  async function carregarTemas() {
    const container = document.getElementById("lista-12-temas");
    if (!container) return;

    try {
      const res = await fetch("/api/temas");
      if (!res.ok) return;
      const temas = await res.json();
      if (!Array.isArray(temas) || !temas.length) return;

      container.replaceChildren();
      temas.forEach((t, idx) => {
        const art = document.createElement("article");
        art.className = "curso";

        const img = document.createElement("img");
        img.className = "curso-capa";
        img.src = IMAGENS[idx % IMAGENS.length];
        img.alt = "";

        const corpo = document.createElement("div");
        corpo.className = "curso-corpo";

        const h2 = document.createElement("h2");
        h2.textContent = `${t.ordem || idx + 1}. ${t.nome}`;

        const p = document.createElement("p");
        p.textContent = "Conteúdo didático preparatório alinhado ao tema da certificação.";

        const a = document.createElement("a");
        a.href = MAPA_MODULO[idx % MAPA_MODULO.length];
        a.className = "btn-ver";
        a.textContent = "Estudar";

        corpo.append(h2, p, a);
        art.append(img, corpo);
        container.append(art);
      });
    } catch { /* mantém os módulos padrão se a API estiver indisponível */ }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", carregarTemas);
  else carregarTemas();
})();
