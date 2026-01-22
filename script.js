(function () {
  // =========================
  // Tracking (GA4/GTM friendly)
  // =========================
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

  // =========================
  // Form submit (simple)
  // =========================
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

  // =========================
  // Ville + Adresse (toutes les communes du 66)
  // APIs officielles (France) :
  // - Communes: https://geo.api.gouv.fr
  // - Adresses: https://api-adresse.data.gouv.fr
  // =========================
  var citySearch = document.getElementById("citySearch");
  var cityResults = document.getElementById("cityResults");
  var addressSearch = document.getElementById("addressSearch");
  var addressResults = document.getElementById("addressResults");
  var prefillBtn = document.getElementById("prefillBtn");
  var selectedCityChip = document.getElementById("selectedCity");

  var cityInput = document.getElementById("cityInput");
  var msgInput = document.getElementById("msgInput");

  // Données sélectionnées
  var selected = {
    cityName: "",
    cityCode: "",
    postcode: "",
    addressLabel: ""
  };

  // Cache local des communes 66
  var communes66 = [];
  var communesLoaded = false;

  function show(el) { if (el) el.style.display = "block"; }
  function hide(el) { if (el) el.style.display = "none"; }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  function renderList(container, items, onPick) {
    if (!container) return;
    container.innerHTML = "";
    if (!items.length) {
      hide(container);
      return;
    }
    items.forEach(function (it) {
      var div = document.createElement("div");
      div.className = "resultItem";
      div.innerHTML = '<strong>' + escapeHtml(it.title) + '</strong>' +
        (it.subtitle ? '<span class="resultSmall">' + escapeHtml(it.subtitle) + '</span>' : '');
      div.addEventListener("click", function () { onPick(it); });
      container.appendChild(div);
    });
    show(container);
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, function (m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m];
    });
  }

  async function loadCommunes66() {
    if (communesLoaded) return;
    // On récupère toutes les communes du 66
    // fields=nom,code,codesPostaux + tri par population pour suggestions plus pertinentes
    var url = "https://geo.api.gouv.fr/communes?codeDepartement=66&fields=nom,code,codesPostaux,population&format=json";
    var res = await fetch(url);
    var data = await res.json();
    communes66 = (data || [])
      .sort(function (a, b) { return (b.population || 0) - (a.population || 0); })
      .map(function (c) {
        return {
          nom: c.nom,
          code: c.code,
          codesPostaux: (c.codesPostaux || [])
        };
      });
    communesLoaded = true;
  }

  function suggestCities(q) {
    q = (q || "").trim().toLowerCase();
    if (!q) return [];
    var out = [];
    for (var i = 0; i < communes66.length; i++) {
      var c = communes66[i];
      if (c.nom.toLowerCase().indexOf(q) !== -1) {
        out.push({
          title: c.nom,
          subtitle: (c.codesPostaux && c.codesPostaux[0]) ? ("CP: " + c.codesPostaux[0]) : "Commune du 66",
          cityCode: c.code,
          postcode: (c.codesPostaux && c.codesPostaux[0]) ? c.codesPostaux[0] : ""
        });
      }
      if (out.length >= 8) break;
    }
    return out;
  }

  async function searchAddress(q, cityCode) {
    q = (q || "").trim();
    if (!q || q.length < 3) return [];
    // Filtre par code commune si dispo (meilleure pertinence)
    var url = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(q) + "&limit=8";
    if (cityCode) url += "&citycode=" + encodeURIComponent(cityCode);

    var res = await fetch(url);
    var data = await res.json();
    var features = (data && data.features) ? data.features : [];
    return features.map(function (f) {
      var props = f.properties || {};
      return {
        title: props.label || "",
        subtitle: (props.postcode ? ("CP: " + props.postcode) : "") + (props.city ? (" • " + props.city) : ""),
        label: props.label || "",
        city: props.city || "",
        postcode: props.postcode || ""
      };
    });
  }

  // Init si la section existe
  if (citySearch && addressSearch) {
    // Charge les communes une fois
    loadCommunes66().catch(function () {
      // Si l’API tombe, on laisse l’utilisateur taper manuellement
      communesLoaded = false;
    });

    // City typing
    citySearch.addEventListener("input", debounce(function () {
      var q = citySearch.value;
      if (!communesLoaded) {
        // fallback sans suggestions
        hide(cityResults);
        return;
      }
      var suggestions = suggestCities(q);
      renderList(cityResults, suggestions, function (it) {
        selected.cityName = it.title;
        selected.cityCode = it.cityCode;
        selected.postcode = it.postcode;
        selectedCityChip.textContent = "Ville : " + it.title + (it.postcode ? (" (" + it.postcode + ")") : "");
        citySearch.value = it.title;
        hide(cityResults);

        // active recherche adresse
        addressSearch.disabled = false;
        addressSearch.focus();
        track("city_selected", { city: it.title, cityCode: it.cityCode });
      });
    }, 150));

    // Close list when clicking outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".fieldWrap")) {
        hide(cityResults);
        hide(addressResults);
      }
    });

    // Address typing
    addressSearch.addEventListener("input", debounce(async function () {
      var q = addressSearch.value;
      var results = await searchAddress(q, selected.cityCode).catch(function () { return []; });
      renderList(addressResults, results, function (it) {
        selected.addressLabel = it.label;
        // Si pas de ville sélectionnée, on prend celle de l’adresse
        if (!selected.cityName && it.city) selected.cityName = it.city;
        if (!selected.postcode && it.postcode) selected.postcode = it.postcode;

        addressSearch.value = it.label;
        hide(addressResults);
        track("address_selected", { address: it.label });
      });
    }, 180));
  }

  // Prefill -> remplit Ville + Message du devis
  if (prefillBtn) {
    prefillBtn.addEventListener("click", function () {
      var cityVal = selected.cityName || (citySearch ? citySearch.value.trim() : "");
      var addrVal = selected.addressLabel || (addressSearch ? addressSearch.value.trim() : "");

      if (cityInput && cityVal) cityInput.value = cityVal;

      if (msgInput) {
        var lines = [];
        if (addrVal) lines.push("Adresse: " + addrVal);
        if (cityVal) lines.push("Ville: " + cityVal);
        lines.push("Demande: (décris ton problème : WC, évier, douche, etc.)");
        msgInput.value = lines.join("\n");
      }

      track("devis_prefilled", { city: cityVal, address: addrVal });
    });
  }

})();
