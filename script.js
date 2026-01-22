(function () {
  const menuBtn = document.getElementById("menuBtn");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuClose = document.getElementById("menuClose");

  function openMenu() {
    menuOverlay.classList.add("open");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuOverlay.classList.remove("open");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (menuBtn && menuOverlay && menuClose) {
    menuBtn.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);

    menuOverlay.addEventListener("click", function (e) {
      if (e.target === menuOverlay) closeMenu();
    });

    document.querySelectorAll(".menuLink").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Scroll doux vers #ancres
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const targetId = a.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const el = document.querySelector(targetId);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Formulaire simple
  const form = document.getElementById("quickForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const phoneInput = document.getElementById("phoneInput");
      const phone = (phoneInput?.value || "").trim();

      if (phone.length < 6) {
        alert("Merci d’indiquer un numéro valide.");
        phoneInput?.focus();
        return;
      }

      const success = document.getElementById("successMsg");
      if (success) success.style.display = "block";
    });
  }
})();
