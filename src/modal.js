// Get the modal
var modaleAggiungiProgetto = document.getElementById("modaleAggiungiProgetto");
var modaleAggiungiDipendente = document.getElementById("modaleAggiungiDipendente");

// Get the button that opens the modal
var apriModaleAggiungiProgetto = document.getElementById("apriModaleAggiungiProgetto");
var apriModaleAggiungiDipendente = document.getElementById("apriModaleAggiungiDipendente");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal 
apriModaleAggiungiProgetto.onclick = function() {
  modaleAggiungiProgetto.style.display = "block";
}
apriModaleAggiungiDipendente.onclick = function() {
  modaleAggiungiDipendente.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modaleAggiungiProgetto.style.display = "none";
}
span2.onclick = function() {
  modaleAggiungiDipendente.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modaleAggiungiProgetto) {
    modaleAggiungiProgetto.style.display = "none";
  } else if(event.target == modaleAggiungiDipendente) {
    modaleAggiungiDipendente.style.display = "none";
  }
}