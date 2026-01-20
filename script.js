(function () {
  // Année auto
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu mobile
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".mobilemenu");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!isOpen));
    menu.hidden = isOpen;
  });

  // Fermer menu après clic
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  });
})();
