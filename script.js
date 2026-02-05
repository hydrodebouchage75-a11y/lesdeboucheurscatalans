const PHONE_DISPLAY = "06 60 35 69 17";
const SMS_URI = "+33660356917";

function track(event, data = {}) {
  try {
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event, ...data });
    } else {
      console.log("[track]", event, data);
    }
  } catch (e) {
    console.log("[track-error]", e);
  }
}

function $(id) { return document.getElementById(id); }

function scrollToId(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cleanPhone(s) {
  return (s || "").replace(/[^\d+]/g, "").trim();
}

function buildSmsLink(to, body) {
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const sep = isiOS ? "&" : "?";
  return `sms:${to}${sep}body=${encodeURIComponent(body)}`;
}

/* MENU */
(function menuInit() {
  const menuBtn = $("menuBtn");
  const closeBtn = $("closeMenuBtn");
  const overlay = $("menuOverlay");
  if (!menuBtn || !closeBtn || !overlay) return;

  function openMenu() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    track("menu_open");
  }
  function closeMenu() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  overlay.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
})();

/* SCROLL */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-scroll]");
  if (!btn) return;
  const target = btn.getAttribute("data-scroll");
  if (target) scrollToId(target);
});

/* TRACK tel: */
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href") || "";
  if (href.startsWith("tel:")) {
    track("call_click", { phone: PHONE_DISPLAY });
  }
});

/* FORM -> OPEN SMS PREFILLED */
(function formInit() {
  const form = $("quickForm");
  const err = $("formError");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (err) err.textContent = "";

    const phone = cleanPhone($("phone")?.value);
    const city = ($("city")?.value || "").trim();
    const msg = ($("msg")?.value || "").trim();

    const digits = phone.replace(/\D/g, "");
    if (!digits || digits.length < 10) {
      if (err) err.textContent = "Merci d’indiquer un numéro valide (ex : 06 00 00 00 00).";
      return;
    }

    track("form_submit", { phone: phone, city: city || undefined });

    const parts = [
      "Demande de devis / rappel",
      `Téléphone client : ${phone}`,
      city ? `Ville : ${city}` : null,
      msg ? `Message : ${msg}` : null,
      "— Envoyé depuis le site"
    ].filter(Boolean);

    const body = parts.join("\n");
    window.location.href = buildSmsLink(SMS_URI, body);
  });
})();

/* YEAR */
(function year() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
