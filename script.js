(function () {
  function track(event, data) {
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event, ...data });
    } else {
      console.log("[track]", event, data);
    }
  }

  // Track clics tel:
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) {
      track("call_click", { phone: "0660356917", href: href });
    }
    if (link.getAttribute("data-track") === "scroll_devis") {
      track("scroll_devis", { target: "#devis" });
    }
  });

  // Form submit (simple)
  var form = document.getElementById("quickForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var phoneInput = document.getElementById("phoneInput");
      var phone = phoneInput ? phoneInput.value.trim() : "";
      if (phone.length < 6) {
        alert("Merci d’indiquer un numéro valide");
        if (phoneInput) phoneInput.focus();
        return;
      }

      track("form_submit", { phone: phone });

      var success = document.getElementById("successMsg");
      if (success) success.style.display = "block";
    });
  }

  // Données sélectionnées
  var selected = {
    city: "",
    address: "",
    postcode: ""
  };

  // Pré-remplissage du devis
  var prefillBtn = document.getElementById("prefillBtn");
  if (prefillBtn) {
    prefillBtn.addEventListener("click", function () {
      var cityInput = document.getElementById("cityInput");
      var msgInput = document.getElementById("msgInput");

      if (cityInput && selected.city) cityInput.value = selected.city;

      if (msgInput) {
        var lines = [];
        if (selected.address) lines.push("Adresse: " + selected.address);
        if (selected.city) lines.push("Ville: " + selected.city);
        if (selected.postcode) lines.push("CP: " + selected.postcode);
        lines.push("Demande: (décris ton problème : WC, évier, douche, etc.)");
        msgInput.value = lines.join("\n");
      }

      track("devis_prefilled", { city: selected.city, address: selected.address });
    });
  }

  // Expose callback pour Google Maps
  window.initAutocomplete = function () {
    var citySearch = document.getElementById("citySearch");
    var addressSearch = document.getElementById("addressSearch");
    var selectedCityChip = document.getElementById("selectedCity");
    var selectedAddrChip = document.getElementById("selectedAddr");

    if (!window.google || !google.maps || !google.maps.places) {
      console.log("Google Maps Places non chargé (clé API ?)");
      return;
    }

    // ✅ BOUNDS approx Pyrénées-Orientales (66) pour limiter les résultats
    // (Google ne permet pas un filtre "département", mais on peut forcer une zone)
    var bounds66 = new google.maps.LatLngBounds(
      new google.maps.LatLng(42.33, 1.70), // SW
      new google.maps.LatLng(42.92, 3.25)  // NE
    );

    // Ville : on utilise Places (cities) + bounds
    var cityAC = new google.maps.places.Autocomplete(citySearch, {
      types: ["(cities)"],
      componentRestrictions: { country: "fr" },
      bounds: bounds66,
      strictBounds: true
    });

    cityAC.addListener("place_changed", function () {
      var place = cityAC.getPlace();
      selected.city = place && place.name ? place.name : (citySearch.value || "");
      selectedCityChip.textContent = "Ville : " + (selected.city || "—");
      track("city_selected", { city: selected.city });

      // Une fois la ville choisie, l’adresse devient plus pertinente
      if (addressSearch) addressSearch.focus();
    });

    // Adresse : Places (addresses) + bounds
    var addrAC = new google.maps.places.Autocomplete(addressSearch, {
      types: ["address"],
      componentRestrictions: { country: "fr" },
      bounds: bounds66,
      strictBounds: true
    });

    addrAC.addListener("place_changed", function () {
      var place = addrAC.getPlace();
      if (!place) return;

      selected.address = place.formatted_address || addressSearch.value || "";
      selectedAddrChip.textContent = "Adresse : " + (selected.address ? "OK" : "—");

      // Récup CP + ville depuis les components
      if (place.address_components) {
        place.address_components.forEach(function (c) {
          if (c.types && c.types.indexOf("postal_code") !== -1) selected.postcode = c.long_name;
          if (c.types && c.types.indexOf("locality") !== -1) selected.city = selected.city || c.long_name;
        });
      }
      if (selectedCityChip && selected.city) selectedCityChip.textContent = "Ville : " + selected.city;

      track("address_selected", { address: selected.address, city: selected.city, postcode: selected.postcode });
    });
  };

})();
