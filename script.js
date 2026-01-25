(() => {
  const OWNER_PHONE_TEL = "0660356917";     // pour tel:
  const OWNER_PHONE_SMS = "0660356917";     // pour sms:

  function track(event, data = {}) {
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event, ...data });
    } else {
      // fallback
      console.log("[track]", event, data);
    }
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function buildSmsLink(number, body) {
    // iOS: sms:number&body=...
    // Android: sms:number?body=...
    const sep = isIOS() ? "&" : "?";
    return `sms:${number}${sep}body=${encodeURIComponent(body)}`;
  }

  function scrollToTarget(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Scroll buttons
    document.querySelectorAll("[data-scroll]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-scroll");
        if (target) scrollToTarget(target);
      });
    });

    // Track tel: clicks (pas d'appel auto)
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const trackType = a.getAttribute("data-track");
      if (trackType === "call_click") {
        track("call_click", { phone: OWNER_PHONE_TEL });
      }

      if (a.href && a.href.startsWith("tel:")) {
        track("call_click", { phone: OWNER_PHONE_TEL });
      }
    });

    // Menu overlay
    const overlay = document.getElementById("overlay");
    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");

    function openMenu() {
      if (!overlay || !menuBtn) return;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function hideMenu() {
      if (!overlay || !menuBtn) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (closeMenu) closeMenu.addEventListener("click", hideMenu);
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) hideMenu();
      });
      overlay.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          hideMenu();
        });
      });
    }

    // Form -> ouvre SMS avec message pré-rempli
    const form = document.getElementById("quickForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const phone = (document.getElementById("phone")?.value || "").trim();
        const city = (document.getElementById("city")?.value || "").trim();
        const msg = (document.getElementById("msg")?.value || "").trim();

        // validation simple
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 9) {
          alert("Merci d’indiquer un numéro valide.");
          return;
        }

        track("form_submit", { phone: digits });

        const bodyLines = [
          "Demande de devis — Débouchage (66)",
          `Téléphone client : ${phone}`,
          city ? `Ville : ${city}` : null,
          msg ? `Message : ${msg}` : null
        ].filter(Boolean);

        const body = bodyLines.join("\n");
        const smsUrl = buildSmsLink(OWNER_PHONE_SMS, body);

        // Redirection vers l'app SMS (le client n'a plus qu'à envoyer)
        window.location.href = smsUrl;
      });
    }
  });
})();
