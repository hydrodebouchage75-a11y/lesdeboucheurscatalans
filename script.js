(function(){
  const RECEIVER = "0660356917";

  const phone = document.getElementById("phoneInput");
  const city  = document.getElementById("cityInput");
  const msg   = document.getElementById("msgInput");
  const btn   = document.getElementById("smsSendBtn");
  const ok    = document.getElementById("successMsg");

  function isIOS(){
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  btn.addEventListener("click", function(e){
    e.preventDefault();

    const p = phone.value.trim();
    if(p.replace(/\D/g,'').length < 9){
      alert("Merci d’indiquer un numéro valide");
      phone.focus();
      return;
    }

    const text =
`Demande de rappel – Les Déboucheurs Catalans
Téléphone : ${p}
Ville : ${city.value || "-"}
Message : ${msg.value || "-"}`;

    const url = `sms:${RECEIVER}${isIOS() ? "&" : "?"}body=` + encodeURIComponent(text);

    ok.style.display="block";
    ok.textContent="Ouverture de l’application Messages…";

    window.location.href = url;
  });
})();
