/* VARIABILI GLOBALI */
var state = new State();
var dipendenteGrabbato = null;


$(document).on('mousemove', function (e) {
    if (dipendenteGrabbato == null)
        return

    $('div#lista-dipendenti > div#id' + dipendenteGrabbato.id).css({
        left: e.pageX - 40,
        top: e.pageY - 25,
        position: "absolute"
    });
});

function refreshPage(data) {
    state.data = data.data;
    state.listaDipendentiNonAllocati = data.listaDipendentiNonAllocati;
    state.listaProgetti = data.listaProgetti;
    $('#date').text(state.data);
    $("table#tabella-allocazioni").empty();
    $("div#lista-dipendenti").empty();
    state.listaProgetti.forEach(function (progetto) {
        let htmlDipendentiAllocati = '';
        progetto.listaDipendentiAllocati.forEach(function (dipendente) {
            let borderColor = dipendente.appartenenza == "internal" ? "; border: 3px solid #000" : "; border: 3px solid #00f9ff";
            dipendente.colore = Utils.getColorFromAnzianita(dipendente.anzianita);
            let style = dipendente.nome == "?" ? "style='border: 3px dashed #000'>" : "style='background-color: #" + dipendente.colore + borderColor + "'>";
            htmlDipendentiAllocati += "<td id='id" + dipendente.id + "'>" +
                "<div id='id" + dipendente.id + "' class='icona-dipendente' " +
                style +
                Utils.creaIconaDipendente(dipendente, dipendente.perc) +
                "</div>" +
                "</td>";
        });
        $("#tabella-allocazioni").append(
            "<tr id='row" + progetto.nome.replace(/\s/g, '') + "'>" +
            "<td id='nome-progetto' style='background-color: " + progetto.colore + "'>&nbsp;&nbsp;" +
            progetto.nome +
            "&nbsp;&nbsp;</td>" +
            htmlDipendentiAllocati +
            "</tr>"
        );
    });
    state.listaDipendentiNonAllocati.forEach(function (dipendente) {
        aggiungiDipendenteListaDipendenti(dipendente);
    });
}


/* IMPORT DATI */
document.getElementById("carica").addEventListener("click", function () {
    document.getElementById("carica-file").click();
});

document.getElementById("carica-file").addEventListener("change", function () {
    let file = document.getElementById("carica-file").files[0];
    var reader = new FileReader();
    reader.onload = readSuccess;
    function readSuccess(evt) {
        let data = JSON.parse(evt.target.result);
        refreshPage(data);
    };
    reader.readAsText(file);
});

function aggiungiDipendenteListaDipendenti(dipendente) {
    let borderColor = dipendente.appartenenza == "internal" ? "; border: 3px solid #000" : "; border: 3px solid #00f9ff";
    dipendente.colore = Utils.getColorFromAnzianita(dipendente.anzianita);
    let style = dipendente.nome == "?" ? "style='border: 3px dashed #000'" : "style='background-color: #" + dipendente.colore + borderColor + "'";
    $("div#lista-dipendenti").append(
        "<div id='id" + dipendente.id + "' class='icona-dipendente' " + style + ">" +
        Utils.creaIconaDipendente(dipendente, dipendente.perc) +
        "</div>"
    );
}

function createTableAllocazioni(listaProgetti) {
    listaProgetti.forEach(function (progetto) {
        aggiungiProgettoTableAllocazioni(progetto);
    });
}


/* INTERAZIONE MOUSE */
$("body").click(function (e) {
    if (dipendenteGrabbato == null && e.target.id.slice(0, 2) == 'id' && $(e.target).parents('table#tabella-allocazioni').length == 0) {
        selezionaDipendenteDaAllocare(e);
    } else if (dipendenteGrabbato == null && e.target.id.slice(0, 2) == 'id' && $(e.target).parents('table#tabella-allocazioni').length > 0) {
        rimuoviAllocazioneDipendente(e);
    } else if (dipendenteGrabbato != null) {
        allocaDipendente(e);
    } else if (dipendenteGrabbato == null && e.target.id == "nome-progetto") {
        let confermaCancellazione = confirm("Vuoi eliminare il progetto?");
        if(confermaCancellazione)
            eliminaProgetto(e);
    }
});

function selezionaDipendenteDaAllocare(e) {
    $('body').css('cursor', 'grabbing');
    dipendenteGrabbato = Utils.getDipendenteFromId(state.listaDipendentiNonAllocati, e.target.id.slice(2, e.target.id.length));
}

function rimuoviAllocazioneDipendente(e) {
    let flagYesNo = confirm("Vuoi rimuovere l'allocazione?");
    if (flagYesNo) {
        let idDipendente = e.target.id.slice(2, e.target.id.length);
        let progettoSelezionato = Utils.getProgettoByNome(state.listaProgetti, e.target.parentElement.parentElement.id.slice(3));
        let dipendenteAllocato = Utils.getDipendenteFromId(progettoSelezionato.listaDipendentiAllocati, idDipendente);
        let dipendenteNonAllocato = Utils.getDipendenteFromId(state.listaDipendentiNonAllocati, idDipendente);
        if (dipendenteAllocato.nome == "?") {
            $(e.target).parents("tr > td").remove();
            Utils.removeDipendenteFromProgetto(idDipendente, progettoSelezionato);
            return;
        }

        if (dipendenteNonAllocato) {
            Utils.aggiornaDipendenteListaDipendenti(dipendenteNonAllocato, dipendenteAllocato.perc);
        } else {
            aggiungiDipendenteListaDipendenti(dipendenteAllocato);
            state.listaDipendentiNonAllocati.push(dipendenteAllocato);
        }
        $(e.target).parents("tr > td").remove();
        Utils.removeDipendenteFromProgetto(idDipendente, progettoSelezionato);
    }
}

function allocaDipendente(e) {
    state.listaProgetti.forEach(function (progetto) {
        let nomeProgetto = progetto.nome.replace(/\s/g, '');
        if (e.target.id == 'row' + nomeProgetto || $(e.target).parents("#row" + nomeProgetto).length) {
            if (progetto.listaDipendentiAllocati.findIndex(dipendente => dipendente.id == dipendenteGrabbato.id) > -1)
                return

            let perc = prompt('Inserisci la percentuale allocazione');
            if (perc == null || perc > 100 || !(/^\d+$/.test(perc))) {
                perc = dipendenteGrabbato.perc
            }

            let allocationDip = new Dipendente(
                dipendenteGrabbato.id,
                dipendenteGrabbato.nome,
                dipendenteGrabbato.cognome,
                dipendenteGrabbato.anzianita,
                dipendenteGrabbato.colore,
                perc,
                dipendenteGrabbato.appartenenza,
                dipendenteGrabbato.sigla
            );

            if (dipendenteGrabbato.nome == "?") {
                $("#tabella-allocazioni > tr#row" + nomeProgetto).append(
                    "<td id='id" + dipendenteGrabbato.id + "'>" +
                    "<div id='id" + dipendenteGrabbato.id + "' class='icona-dipendente' style='border: 3px dashed #000'>" +
                    Utils.creaIconaDipendente(dipendenteGrabbato, perc) +
                    "</div>" +
                    "</td>"
                );
                progetto.listaDipendentiAllocati.push(allocationDip);
                dipendenteGrabbato = Utils.resetGrab(dipendenteGrabbato);
                return;
            }

            let borderColor = dipendenteGrabbato.appartenenza == "internal" ? "; border: 3px solid #000" : "; border: 3px solid #00f9ff";
            $("#tabella-allocazioni > tr#row" + nomeProgetto).append(
                "<td id='id" + dipendenteGrabbato.id + "'>" +
                "<div id='id" + dipendenteGrabbato.id + "' class='icona-dipendente' " +
                "style='background-color: #" + dipendenteGrabbato.colore + borderColor + "'>" +
                Utils.creaIconaDipendente(dipendenteGrabbato, perc) +
                "</div>" +
                "</td>"
            );

            progetto.listaDipendentiAllocati.push(allocationDip);

            if (perc == dipendenteGrabbato.perc) {
                $('div#lista-dipendenti > div#id' + dipendenteGrabbato.id).remove();
                Utils.removeDipendenteFromDipendentiNonAllocati(state.listaDipendentiNonAllocati, dipendenteGrabbato.id);
            } else {
                dipendenteGrabbato.perc -= perc;
                $('div#lista-dipendenti > div#id' + dipendenteGrabbato.id + ' > div.perc').text(dipendenteGrabbato.perc + '%');
            }
            dipendenteGrabbato = Utils.resetGrab(dipendenteGrabbato);
        }
    });
}

function eliminaProgetto(event) {
    Utils.eliminaProgettoByNome(state.listaProgetti, event.target.innerText.trim(), state.listaDipendentiNonAllocati);
    refreshPage(state);
}

function salva() {
    let filename = "import_allocazioni_" + Date.now();
    state.data = $('#date').text();
    let data = JSON.stringify(state);
    let file = new Blob([data], { type: 'txt' });
    let a = document.createElement("a");
    let url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

$("#annulla").click(function (e) {
    if (dipendenteGrabbato == null)
        return;
    dipendenteGrabbato = Utils.resetGrab(dipendenteGrabbato);
});

/* AGGIUNGI PROGETTO */
document.getElementById("aggiungi-progetto").addEventListener("click", function (event) {
    event.preventDefault();
    let nomeNuovoProgetto = $("#nome-nuovo-progetto").val().trim();
    let coloreNuovoProgetto = $("#colore-nuovo-progetto").children("option:selected").val();
    let progetto = new Progetto(nomeNuovoProgetto, coloreNuovoProgetto);
    state.listaProgetti.push(progetto);
    aggiungiProgettoTableAllocazioni(progetto);
    $("#modaleAggiungiProgetto").css({ display: "none" });
});

function aggiungiProgettoTableAllocazioni(progetto) {
    $("#tabella-allocazioni").append(
        "<tr id='row" + progetto.nome.replace(/\s/g, '') + "'>" +
        "<td id='nome-progetto' style='background-color: " + progetto.colore + "'>&nbsp;&nbsp;" +
        progetto.nome +
        "&nbsp;&nbsp;</td>" +
        "</tr>"
    );
}


/* AGGIUNGI DIPENDENTE */
document.getElementById("aggiungi-dipendente").addEventListener("click", function (event) {
    event.preventDefault();
    let nomeNuovoDipendente = $("#nome-nuovo-dipendente").val().trim();
    let cognomeNuovoDipendente = $("#cognome-nuovo-dipendente").val().trim();
    let siglaNuovoDipendente = $("#sigla-nuovo-dipendente").val().trim();
    let anzianita = $("#anzianita-nuovo-dipendente").children("option:selected").val();
    let appartenenza = $("#appartenenza-nuovo-dipendente").children("option:selected").val();
    let idDipendente = Utils.getNewIdDipendente(state.listaProgetti, state.listaDipendentiNonAllocati);

    if (Utils.getDipendenteFromId(state.listaDipendentiNonAllocati, -1) == null) {
        let emptyDipendente = new Dipendente(-1, "?", "?", "", "grey", 10000, "");
        state.listaDipendentiNonAllocati.push(emptyDipendente);
        $("div#lista-dipendenti").append(
            "<div id='id" + emptyDipendente.id + "' class='icona-dipendente' style='border: 3px dashed #000'>" +
            Utils.creaIconaDipendente(emptyDipendente, emptyDipendente.perc) +
            "</div>"
        );
    }

    let dipendente = new Dipendente(
        idDipendente,
        nomeNuovoDipendente,
        cognomeNuovoDipendente,
        anzianita,
        Utils.getColorFromAnzianita(anzianita),
        100,
        appartenenza,
        siglaNuovoDipendente
    );

    state.listaDipendentiNonAllocati.push(dipendente);
    aggiungiDipendenteListaDipendenti(dipendente);
    $("#modaleAggiungiDipendente").css({ display: "none" });
});


/* MODALE MODIFICA DIPENDENTI */
function caricaDipendentiModale() {
    $("table#tabella-modifica-dipendenti").empty();
    $("table#tabella-modifica-dipendenti").append(
        "<tr>" +
            "<th>#</th>" +
            "<th>Sigla</th>" +
            "<th>Nome</th>" +
            "<th>Cognome</th>" +
            "<th>Anzianita</th>" +
            "<th>Appartenenza</th>" +
        "</tr>"
    );

    let listaDipendenti = [];

    state.listaDipendentiNonAllocati.forEach(function(dipendente) {
        if(dipendente.id != -1)
            listaDipendenti.push(dipendente);
    });

    state.listaProgetti.forEach(function(progetto) {
        progetto.listaDipendentiAllocati.forEach(function(dipendenteAllocato) {
            let index = listaDipendenti.findIndex(dip => dip.id == dipendenteAllocato.id);
            if(index == -1 && dipendenteAllocato.id != -1)
                listaDipendenti.push(dipendenteAllocato);
        });
    });
      
    listaDipendenti.sort(function (dip1, dip2) {
        if( dip1.cognome < dip2.cognome ) {
            return -1;
        }
        if( dip1.cognome > dip2.cognome ) {
            return 1;
        }
        return 0;
    });

    let count = 1;
    listaDipendenti.forEach(function(dipendente){
        let sigla = dipendente.sigla ? dipendente.sigla : "";
        $("table#tabella-modifica-dipendenti").append(
            "<tr>" +
                "<td>" + count + "</td>" +
                "<td>" + sigla + "</td>" +
                "<td>" + dipendente.nome + "</td>" +
                "<td>" + dipendente.cognome + "</td>" +
                "<td>" + dipendente.anzianita + "</td>" +
                "<td>" + dipendente.appartenenza + "</td>" +
            "</tr>"
        );
        count++;
    });
}