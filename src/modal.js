// Get the modal
var modaleAggiungiProgetto = document.getElementById("modaleAggiungiProgetto");
var modaleAggiungiDipendente = document.getElementById("modaleAggiungiDipendente");
var modaleModificaDipendenti = document.getElementById("modaleModificaDipendenti");
var modaleAggiungiProgetto2 = document.getElementById("modaleAggiungiProgetto2");
var modaleAggiungiDipendente2 = document.getElementById("modaleAggiungiDipendente2");

// Get the button that opens the modal
var apriModaleAggiungiProgetto = document.getElementById("apriModaleAggiungiProgetto");
var apriModaleAggiungiDipendente = document.getElementById("apriModaleAggiungiDipendente");
var apriModaleModificaDipendenti = document.getElementById("apriModaleModificaDipendenti");
var apriModaleAggiungiProgetto2 = document.getElementById("apriModaleAggiungiProgetto2");
var apriModaleAggiungiDipendente2 = document.getElementById("apriModaleAggiungiDipendente2");


// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
var span3 = document.getElementsByClassName("close")[2];
var span4 = document.getElementsByClassName("close")[3];
var span5 = document.getElementsByClassName("close")[4];

// When the user clicks the button, open the modal 
apriModaleAggiungiProgetto.onclick = function() {
  modaleAggiungiProgetto.style.display = "block";
}
apriModaleAggiungiDipendente.onclick = function() {
  modaleAggiungiDipendente.style.display = "block";
}
apriModaleModificaDipendenti.onclick = function() {
  caricaDipendentiModale();
  modaleModificaDipendenti.style.display = "block";
}
apriModaleAggiungiProgetto2.onclick = function() {
  modaleAggiungiProgetto2.style.display = "block";
}
apriModaleAggiungiDipendente2.onclick = function() {
  modaleAggiungiDipendente2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modaleAggiungiProgetto.style.display = "none";
}
span2.onclick = function() {
  modaleAggiungiDipendente.style.display = "none";
}
span3.onclick = function() {
  modaleModificaDipendenti.style.display = "none";
}
span4.onclick = function() {
  modaleAggiungiProgetto2.style.display = "none";
}
span5.onclick = function() {
  modaleAggiungiDipendente2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modaleAggiungiProgetto) {
    modaleAggiungiProgetto.style.display = "none";
  } else if(event.target == modaleAggiungiDipendente) {
    modaleAggiungiDipendente.style.display = "none";
  } else if(event.target == modaleModificaDipendenti) {
    modaleModificaDipendenti.style.display = "none";
  } else if (event.target == modaleAggiungiProgetto2) {
    modaleAggiungiProgetto2.style.display = "none";
  } else if(event.target == modaleAggiungiDipendente2) {
    modaleAggiungiDipendente2.style.display = "none";
  }
}