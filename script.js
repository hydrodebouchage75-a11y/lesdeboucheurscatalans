document.getElementById("smsForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const message = document.getElementById("message").value.trim();

  if (phone.length < 6) {
    alert("Merci d’indiquer un numéro valide");
    return;
  }

  let smsText = "Demande de devis débouchage :\n";
  smsText += "Téléphone : " + phone + "\n";
  if (city) smsText += "Ville : " + city + "\n";
  if (message) smsText += "Message : " + message;

  const url = "sms:0660356917?&body=" + encodeURIComponent(smsText);
  window.location.href = url;
});
