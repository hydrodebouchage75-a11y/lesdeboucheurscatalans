// ========= Tracking simple (dataLayer si présent, sinon console) =========
function track(event, data = {}) {
  try {
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event, ...data });
    } else if (typeof window.gtag === "function") {
      // si GA4 est chargé plus tard
      window.gtag("event", event, data);
    } else {
      console.log("[track]", event, data);
    }
  } catch (e) {
    console.log("[track error]", e);
  }
}

// Track clicks tel:
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href") || "";
  if (href.startsWith("tel:")) {
    track("call_click", { phone: "0660356917" });
  }
});

// ========= Menu overlay =========
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const closeMenu = document.getElementById("closeMenu");

function openMenu() {
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function hideMenu() {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuBtn?.addEventListener("click", openMenu);
closeMenu?.addEventListener("click", hideMenu);
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) hideMenu();
});
document.querySelectorAll(".overlay__link").forEach((link) => {
  link.addEventListener("click", () => setTimeout(hideMenu, 120));
});

// ========= Scroll helpers =========
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("scrollDevis")?.addEventListener("click", () => scrollToId("devis"));
document.getElementById("scrollDevis2")?.addEventListener("click", () => scrollToId("devis"));
document.getElementById("stickyDevis")?.addEventListener("click", () => scrollToId("devis"));

// ========= Form -> redirection SMS pré-rempli =========
// IMPORTANT : sur iOS, format sms:+33...&body= ; sur Android souvent ?body=
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function normalizePhoneForMessage(p) {
  return (p || "").trim().replace(/\s+/g, " ");
}

function buildSmsLink(toNumberE164, body) {
  const encoded = encodeURIComponent(body);
  // iOS: sms:+33...&body=...
  // Android: sms:+33...?body=...
  if (isIOS()) return `sms:${toNumberE164}&body=${encoded}`;
  return `sms:${toNumberE164}?body=${encoded}`;
}

const quickForm = document.getElementById("quickForm");
quickForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const phone = normalizePhoneForMessage(document.getElementById("fPhone")?.value);
  const city = normalizePhoneForMessage(document.getElementById("fCity")?.value);
  const msg  = normalizePhoneForMessage(document.getElementById("fMsg")?.value);

  if (!phone || phone.replace(/\D/g, "").length < 8) {
    alert("Merci d’indiquer un numéro valide.");
    return;
  }

  track("form_submit", { phone });

  const parts = [];
  parts.push("Demande de débouchage (66)");
  parts.push(`Téléphone client : ${phone}`);
  if (city) parts.push(`Ville : ${city}`);
  if (msg)  parts.push(`Message : ${msg}`);
  parts.push("— Envoyé depuis le site lesdeboucheurscatalans.fr");

  const smsBody = parts.join("\n");

  // Ton numéro (destinataire du SMS)
  const to = "+33660356917";

  // Redirection directe vers l’app SMS avec message pré-rempli
  window.location.href = buildSmsLink(to, smsBody);
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();
