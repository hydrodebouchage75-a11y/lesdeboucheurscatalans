// ===== Menu overlay =====
(function () {
  const overlay = document.getElementById("menuOverlay");
  const btn = document.getElementById("menuBtn");
  const close = document.getElementById("menuClose");

  function openMenu() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  btn?.addEventListener("click", openMenu);
  close?.addEventListener("click", closeMenu);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeMenu();
  });

  document.querySelectorAll(".menuLink").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });
})();


// ===== Scroll doux (liens #...) =====
(function () {
  document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();


// ===== Formulaire simple =====
(function () {
  const form = document.getElementById("quickForm");
  const phone = document.getElementById("phoneInput");
  const success = document.getElementById("successMsg");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const raw = (phone?.value || "").trim();
    const digits = raw.replace(/\D/g, "");

    if (digits.length < 9) {
      alert("Merci d’indiquer un numéro valide.");
      phone?.focus();
      return;
    }

    success.style.display = "block";
    setTimeout(() => { success.style.display = "none"; }, 4500);

    form.reset();
  });
})();
