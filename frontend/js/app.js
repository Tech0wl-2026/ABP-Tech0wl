// O conteúdo e a navegação continuam disponíveis sem JavaScript.
// Ao seguir uma âncora, leva o foco para a seção de destino.
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    return;
  const destination = new URL(link.href, location.href);
  if (destination.pathname !== location.pathname || !destination.hash) return;
  const section = document.getElementById(
    decodeURIComponent(destination.hash.slice(1)),
  );
  if (!section) return;
  section.setAttribute("tabindex", "-1");
  section.focus({ preventScroll: true });
});
