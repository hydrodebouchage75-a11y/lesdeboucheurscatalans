/* ==========================
   CONFIG
========================== */
const BUSINESS_PHONE_RAW = "0660356917"; // tel:
const BUSINESS_PHONE_SMS = "+33660356917"; // sms: (format international conseillé)

/* ==========================
   TRACKING
========================== */
function track(eventName, data = {}) {
  // dataLayer (GTM) si présent
  if (window.dataLayer && typeof window.dataLayer.push === "function") {
    window.dataLayer.push({ event: eventName, ...data });
  }

  // GA4 via gtag si présent
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, data);
  }

  // fallback debug
  if (!window.dataLayer && typeof window.gtag !== "function") {
    console.log("[track]", eventName, data);
  }
}

/* ==========================
   HELPERS
========================== */
function $(id){ return document.getElementById(id); }

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function normalizePhone(str){
  return (str || "").replace(/[^\d+]/g, "").trim();
}

function buildSmsLink(toNumber, bodyText){
  // iOS: sms:+33...&body= ; Android: sms:+33...?body=
  const sep = isIOS() ? "&" : "?";
  return `sms:${toNumber}${sep}body=${encodeURIComponent(bodyText)}`;
}

/* ==========================
   INIT
========================== */
document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const y = $("year");
  if (y) y.textContent = new Date().getFullYear();

  // MENU
  const menuBtn = $("menuBtn");
  const menu = $("menu");
  const overlay = $("overlay");
  const menuClose = $("menuClose");

  function openMenu(){
    if (!menu || !overlay || !menuBtn) return;
    menu.classList.add("is-open");
    overlay.classList.add("is-open");
    menu.setAttribute("aria-hidden","false");
    overlay.setAttribute("aria-hidden","false");
    menuBtn.setAttribute("aria-expanded","true");
  }
  function closeMenu(){
    if (!menu || !overlay || !menuBtn) return;
    menu.classList.remove("is-open");
    overlay.classList.remove("is-open");
    menu.setAttribute("aria-hidden","true");
    overlay.setAttribute("aria-hidden","true");
    menuBtn.setAttribute("aria-expanded","false");
  }

  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  // Fermer menu quand on clique un lien
  document.querySelectorAll(".menu__link").forEach(a => {
    a.addEventListener("click", () => closeMenu());
  });

  // Smooth scroll (lien devis)
  const goDevis = $("goDevis");
  if (goDevis){
    goDevis.addEventListener("click", (e) => {
      // laisser le hash faire, mais on peut smoother
      const target = document.querySelector("#devis");
      if (target){
        e.preventDefault();
        target.scrollIntoView({behavior:"smooth", block:"start"});
      }
    });
  }

  // TRACK appels (tel:)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("tel:")) {
      track("call_click", { phone: BUSINESS_PHONE_RAW, placement: a.id || "link" });
    }
  });

  // FORM -> ouvre SMS pré-rempli
  const form = $("quickForm");
  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const phone = normalizePhone($("f_phone")?.value);
      const city  = ($("f_city")?.value || "").trim();
      const msg   = ($("f_msg")?.value || "").trim();

      if (!phone || phone.length < 6){
        alert("Merci d’indiquer un numéro valide.");
        return;
      }

      track("form_submit", { phone, city });

      const body =
`Demande de devis - Débouchage 66
Téléphone client : ${phone}
Ville : ${city || "-"}
Message : ${msg || "-"}`;

      // ✅ Redirection directe vers l'app SMS (le client clique juste sur Envoyer)
      const smsUrl = buildSmsLink(BUSINESS_PHONE_SMS, body);
      window.location.href = smsUrl;
    });
  }
});
