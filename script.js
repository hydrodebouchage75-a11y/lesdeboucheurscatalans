document.getElementById("smsForm").addEventListener("submit", function(e){
  e.preventDefault();

  const tel = document.getElementById("telClient").value.trim();
  if(tel.length < 6){
    alert("Merci d’indiquer un numéro valide");
    return;
  }

  const ville = document.getElementById("villeClient").value.trim();
  const msg = document.getElementById("msgClient").value.trim();

  let texte = "Demande de devis – Débouchage 66\n";
  texte += "Téléphone : " + tel + "\n";
  if(ville) texte += "Ville : " + ville + "\n";
  if(msg) texte += "Message : " + msg;

  const smsUrl = "sms:0660356917&body=" + encodeURIComponent(texte);
  window.location.href = smsUrl;
});
