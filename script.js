(function () {
  // ===== MENU =====
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

  // ===== SCROLL DOUX =====
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

  // ===== ZONES -> PREFILL DEVIS =====
  const zoneCity = document.getElementById("zoneCity");
  const zoneAddress = document.getElementById("zoneAddress");
  const zoneStatus = document.getElementById("zoneStatus");
  const prefillBtn = document.getElementById("prefillBtn");

  const cityInput = document.getElementById("cityInput");
  const msgInput = document.getElementById("msgInput");

  function updateZoneStatus() {
    const c = (zoneCity?.value || "").trim();
    zoneStatus.textContent = `✅ Couverture : 66  Ville : ${c ? c : "—"}`;
  }

  if (zoneCity) zoneCity.addEventListener("input", updateZoneStatus);
  updateZoneStatus();

  if (prefillBtn) {
    prefillBtn.addEventListener("click", function () {
      const c = (zoneCity?.value || "").trim();
      const a = (zoneAddress?.value || "").trim();

      if (c && cityInput) cityInput.value = c;

      // On met l'adresse dans le message (pratique)
      if (msgInput) {
        const lines = [];
        lines.push("Demande de devis — Débouchage / urgence");
        if (c) lines.push("Ville : " + c);
        if (a) lines.push("Adresse : " + a);
        lines.push("Problème : ");
        msgInput.value = lines.join("\n");
      }

      // Aller au formulaire
      const devis = document.getElementById("devis");
      if (devis) devis.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ===== FORMULAIRE SIMPLE =====
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

  // ===== OPTION B : GOOGLE PLACES (quand tu auras ta clé)
  // Décommente le script Google dans index.html + colle ta clé
  // Puis décommente ce bloc :
  /*
  if (window.google && google.maps && google.maps.places && zoneAddress) {
    const autocomplete = new google.maps.places.Autocomplete(zoneAddress, {
      types: ["address"],
      componentRestrictions: { country: "fr" },
      fields: ["formatted_address", "address_components"]
    });

    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();
      if (!place) return;

      // Remplir adresse formatée
      if (place.formatted_address) zoneAddress.value = place.formatted_address;

      // Essayer de récupérer la ville
      const comps = place.address_components || [];
      const locality = comps.find(c => c.types.includes("locality")) ||
                       comps.find(c => c.types.includes("postal_town")) ||
                       comps.find(c => c.types.includes("administrative_area_level_2"));

      if (locality && locality.long_name && zoneCity) {
        zoneCity.value = locality.long_name;
        updateZoneStatus();
      }
    });
  }
  */
})();
