(function () {
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".menuOverlay");
  const closeBtn = document.querySelector(".menuClose");

  function openMenu() {
    overlay.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    overlay.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (burger && overlay) {
    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu(); else openMenu();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      const panel = document.querySelector(".menuPanel");
      if (panel && !panel.contains(e.target)) closeMenu();
    });
  }

  document.querySelectorAll(".menuPanel a").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  window.addEventListener("scroll", () => {
    if (overlay && !overlay.hidden) closeMenu();
  }, { passive: true });

  // =========================
  // ✅ GA4 EVENT TRACKING
  // =========================

  function fireEvent(name, params) {
    if (typeof gtag === "function") {
      gtag("event", name, params || {});
    }
  }

  // Track click on phone links (tel:) or data-track="call"
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const href = (a.getAttribute("href") || "").trim();
    const isTel = href.startsWith("tel:");
    const isCall = a.getAttribute("data-track") === "call";

    if (isTel || isCall) {
      fireEvent("call_click", {
        link_url: href,
        phone_number: "0660356917"
      });
    }
  });

  // Track form submit intention
  const form = document.querySelector('form[data-track="form"]');
  if (form) {
    form.addEventListener("submit", () => {
      fireEvent("form_intent", { form_name: "contact_mailto" });
    });
  }
})();
