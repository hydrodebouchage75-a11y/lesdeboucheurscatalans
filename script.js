function track(event, data){
  if(window.dataLayer){
    dataLayer.push({event,...data});
  } else {
    console.log(event, data);
  }
}

document.addEventListener("click", e=>{
  const a=e.target.closest("a");
  if(!a) return;
  if(a.href.startsWith("tel:")){
    track("call_click",{phone:"0660356917"});
  }
});

document.getElementById("quickForm").addEventListener("submit",e=>{
  e.preventDefault();
  const phone=document.getElementById("phone").value;
  if(phone.length<9){
    alert("Numéro invalide");
    return;
  }
  track("form_submit",{phone});
  document.getElementById("successMsg").style.display="block";
});
