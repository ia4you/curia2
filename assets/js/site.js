// Menú móvil y aparición al hacer scroll. Sin dependencias.

const button = document.querySelector("[data-menu-button]");
const nav = document.getElementById("site-nav");

function setMenu(open) {
  if (!button || !nav) return;
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  if (open) nav.setAttribute("data-open", "");
  else nav.removeAttribute("data-open");
}

if (button && nav) {
  button.addEventListener("click", () => setMenu(button.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      button.focus();
    }
  });
  // Al pasar a escritorio el menú deja de ser un panel: se restablece el estado.
  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
}

// Aparición al entrar en pantalla (una sola vez por elemento).
const items = document.querySelectorAll(".reveal");
if (items.length) {
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // También se muestran los que ya quedaron por encima (salto a un ancla o scroll muy rápido).
          if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => observer.observe(el));
  }
}
