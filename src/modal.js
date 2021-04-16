// Get the modal
var modaleAggiungiProgetto = document.getElementById("modaleAggiungiProgetto");
var modaleAggiungiDipendente = document.getElementById("modaleAggiungiDipendente");
var modaleModificaDipendenti = document.getElementById("modaleModificaDipendenti");

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

// When the user clicks the button, open the modal 
apriModaleAggiungiProgetto.onclick = function() {
  $("#area-aggiungi-progetto").val("");
  modaleAggiungiProgetto.style.display = "block";
}
apriModaleAggiungiDipendente.onclick = function() {
  $("#area-aggiungi-dipendente").val("");
  modaleAggiungiDipendente.style.display = "block";
}
apriModaleModificaDipendenti.onclick = function() {
  caricaDipendentiModale();
  modaleModificaDipendenti.style.display = "block";
}
apriModaleAggiungiProgetto2.onclick = function() {
  $("#area-aggiungi-progetto").val("2");
  modaleAggiungiProgetto.style.display = "block";
}
apriModaleAggiungiDipendente2.onclick = function() {
  $("#area-aggiungi-dipendente").val("2");
  modaleAggiungiDipendente.style.display = "block";
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

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modaleAggiungiProgetto) {
    modaleAggiungiProgetto.style.display = "none";
  } else if(event.target == modaleAggiungiDipendente) {
    modaleAggiungiDipendente.style.display = "none";
  } else if(event.target == modaleModificaDipendenti) {
    modaleModificaDipendenti.style.display = "none";
  }
}