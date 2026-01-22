function track(event, data){
  if(window.dataLayer){
    window.dataLayer.push({event, ...data});
  } else {
    console.log(event, data);
  }
}

// Track appels
document.addEventListener("click", function(e){
  const a = e.target.closest("a");
  if(!a) return;
  if(a.href && a.href.startsWith("tel:")){
    track("call_click",{phone:"000000000"});
  }
});

// Formulaire
document.getElementById("quickForm").addEventListener("submit", function(e){
  e.preventDefault();

  const phone = document.getElementById("phone").value;
  if(phone.length < 6){
    alert("Merci d’indiquer un numéro valide");
    return;
  }

  track("form_submit",{phone});

  document.getElementById("successMsg").style.display = "block";
});
