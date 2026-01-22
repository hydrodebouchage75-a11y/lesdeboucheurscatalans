function track(event, data){
  if(window.dataLayer){
    window.dataLayer.push({ event, ...data });
  } else {
    console.log(event, data);
  }
}

// Track clics téléphone
document.addEventListener("click", function(e){
  const a = e.target.closest("a");
  if(!a) return;

  if(a.href && a.href.startsWith("tel:")){
    track("call_click", { phone: "000000000" });
  }
});

// Formulaire (sécurisé)
const form = document.getElementById("quickForm");

if(form){
  form.addEventListener("submit", function(e){
    e.preventDefault();

    const phoneInput = document.getElementById("phone");
    const phone = phoneInput ? phoneInput.value.trim() : "";

    if(phone.length < 6){
      alert("Merci d’indiquer un numéro valide");
      return;
    }

    track("form_submit", { phone });

    const success = document.getElementById("successMsg");
    if(success){
      success.style.display = "block";
    }
  });
}
