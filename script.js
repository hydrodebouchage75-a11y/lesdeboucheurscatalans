document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  if(phone.length < 6){
    alert("Merci d’indiquer un numéro valide.");
    return;
  }

  alert("Message envoyé. Nous vous rappelons rapidement.");
  this.reset();
});
