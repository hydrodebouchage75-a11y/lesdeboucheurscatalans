(function () {
  // ===== MENU OVERLAY =====
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
      // ferme si on clique en dehors du panneau
      if (e.target === menuOverlay) closeMenu();
    });

    // Ferme quand on clique un lien du menu
    document.querySelectorAll(".menuLink").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Ferme avec ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ===== SCROLL DOUX vers ancres =====
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

  // ===== FORMULAIRE SIMPLE =====
  const form = document.getElementById("quickForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const phone = (document.getElementById("phoneInput")?.value || "").trim();
      if (phone.length < 6) {
        alert("Merci d’indiquer un numéro valide.");
        document.getElementById("phoneInput")?.focus();
        return;
      }

      // Pour l’instant : simple confirmation (WhatsApp + tracking plus tard)
      const success = document.getElementById("successMsg");
      if (success) success.style.display = "block";

      // Option : reset message/ville (garde le téléphone si tu veux)
      // form.reset();
    });
  }
})();
