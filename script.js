document.getElementById("smsForm").addEventListener("submit", function(e){
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const message = document.getElementById("message").value.trim();

  if(phone.length < 6){
    alert("Merci d’indiquer un numéro valide.");
    return;
  }

  const smsText =
`Demande de débouchage – Les Déboucheurs Catalans

Téléphone client : ${phone}
Ville : ${city || "Non précisée"}
Message :
${message || "Non précisé"}`;

  const encoded = encodeURIComponent(smsText);

  // iOS & Android compatible
  window.location.href = `sms:0660356917&body=${encoded}`;
});
