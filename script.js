/************************************************************
  PERSONNALISATION RAPIDE
  - Numéro d'appel (à garder) : 06 60 35 69 17
  - Option A WhatsApp : redirection vers wa.me (message pré-rempli)
  - Option B Webhook : envoi POST vers Make/Zapier
************************************************************/

// ✅ Tracking : dataLayer.push si dataLayer existe, sinon console.log
function trackEvent(eventName, payload) {
  payload = payload || {};
  payload.event = eventName;

  if (window.dataLayer && typeof window.dataLayer.push === "function") {
    window.dataLayer.push(payload);
  } else {
    console.log("[track]", payload);
  }
}

// FORM SEND MODE
// "WHATSAPP" = Option A (simple) => redirection wa.me
// "WEBHOOK"  = Option B (pro)    => POST webhook Make/Zapier
const FORM_SEND_MODE = "WHATSAPP"; // <-- change en "WEBHOOK" si tu veux

// Option A: numéro WhatsApp (format international sans + ni espaces)
// ⚠️ Mets ton numéro WhatsApp si différent
const WA_NUMBER = "33660356917";

// Option B: URL webhook Make/Zapier
// Exemple Make : https://hook.eu1.make.com/xxxxxx
// Exemple Zapier : https://hooks.zapier.com/hooks/catch/xxxxxx/xxxxxx
const WEBHOOK_URL = "https://EXEMPLE-URL-WEBHOOK-ICI";

// Helpers
function normalizePhone(input) {
  return (input || "").toString().trim().replace(/[^\d+]/g, "");
}

function isValidFrenchPhone(raw) {
  const p = normalizePhone(raw);
  // 0XXXXXXXXX ou +33XXXXXXXXX
  if (/^0\d{9}$/.test(p)) return true;
  if (/^\+33\d{9}$/.test(p)) return true;
  return false;
}

// Track call clicks globally (tel:)
document.addEventListener("click", function (e) {
  const a = e.target.closest("a");
  if (!a) return;

  const href = (a.getAttribute("href") || "").trim();
  if (href.startsWith("tel:") || a.getAttribute("data-track") === "call") {
    trackEvent("call_click", {
      link_url: href,
      phone_number: "0660356917"
    });
  }

  if (a.getAttribute("data-track") === "scroll_devis") {
    trackEvent("scroll_devis", { target: "#devis" });
  }
});

// Form submit
const form = document.getElementById("quickForm");
const successMsg = document.getElementById("successMsg");

if (form) {
  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const msg = document.getElementById("msg").value;

    if (!phone || !isValidFrenchPhone(phone)) {
      alert("Merci d’indiquer un numéro valide (ex: 06XXXXXXXX ou +33XXXXXXXXX).");
      document.getElementById("phone").focus();
      return;
    }

    trackEvent("form_submit", {
      form_name: "quickForm",
      phone_provided: true,
      city_provided: !!(city && city.trim()),
      message_provided: !!(msg && msg.trim())
    });

    const cleanPhone = normalizePhone(phone);
    const cityVal = (city || "").trim();
    const msgVal = (msg || "").trim();

    const textLines = [
      "Demande de rappel – Les Déboucheurs Catalans",
      "Téléphone: " + cleanPhone,
      cityVal ? ("Ville: " + cityVal) : null,
      msgVal ? ("Message: " + msgVal) : null
    ].filter(Boolean);

    const messageText = textLines.join("\n");

    // Option A: WhatsApp redirect
    if (FORM_SEND_MODE === "WHATSAPP") {
      successMsg.style.display = "block";
      const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(messageText);

      setTimeout(() => {
        window.location.href = url;
      }, 350);
      return;
    }

    // Option B: Webhook POST
    if (FORM_SEND_MODE === "WEBHOOK") {
      if (!WEBHOOK_URL || WEBHOOK_URL.includes("EXEMPLE-URL-WEBHOOK-ICI")) {
        alert("Webhook non configuré. Remplace WEBHOOK_URL dans script.js.");
        return;
      }

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "lesdeboucheurscatalans.fr",
            phone: cleanPhone,
            city: cityVal || null,
            message: msgVal || null,
            timestamp: new Date().toISOString()
          })
        });

        if (!res.ok) throw new Error("HTTP " + res.status);

        successMsg.style.display = "block";
        form.reset();
        return;
      } catch (err) {
        console.error(err);
        alert("Erreur d’envoi. Appelez-nous directement au 06 60 35 69 17.");
        return;
      }
    }
  });
}
