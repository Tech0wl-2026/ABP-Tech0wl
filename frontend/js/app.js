"use strict";

document.documentElement.classList.add("js-ready");
const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navegacao");
menu.hidden = false;
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  navigation.dataset.open = String(open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menu.setAttribute("aria-expanded", "false");
    navigation.dataset.open = "false";
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    menu.setAttribute("aria-expanded", "false");
    navigation.dataset.open = "false";
    menu.focus();
  }
});

const search = document.querySelector("#busca");
const questions = [...document.querySelectorAll(".faq-list details")];
const status = document.querySelector("#resultado-busca");
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
search.addEventListener("input", () => {
  const query = normalize(search.value.trim());
  let visible = 0;
  for (const question of questions) {
    const match = normalize(question.textContent).includes(query);
    question.hidden = !match;
    if (match) visible++;
  }
  status.textContent =
    visible === 0
      ? "Nenhuma dúvida encontrada. Tente outra palavra."
      : `${visible} ${visible === 1 ? "dúvida encontrada" : "dúvidas encontradas"}.`;
});
