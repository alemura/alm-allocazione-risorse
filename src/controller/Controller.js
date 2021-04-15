/* VARIABILI GLOBALI */
var state = new State();
var state2 = new State();
var dipendenteGrabbato = null;
var dipendenteGrabbato2 = null;


$(document).on('mousemove', function (e) {
    let cssIstructions = {
        left: e.pageX - 40,
        top: e.pageY + 5,
        position: "absolute"
    };

    if (dipendenteGrabbato != null) {
        $('div#lista-dipendenti > div#id' + dipendenteGrabbato.id).css(cssIstructions);
    } else if (dipendenteGrabbato2 != null) {
        $('div#lista-dipendenti2 > div#id' + dipendenteGrabbato.id).css(cssIstructions);
    }    
});

function resetPage() {
    $("table#tabella-allocazioni").empty();
    $("div#lista-dipendenti").empty();
    $("table#tabella-allocazioni2").empty();
    $("div#lista-dipendenti2").empty();
}

function refreshPage(data) {
    state.data = data[0].data;
    state.listaDipendentiNonAllocati = data[0].listaDipendentiNonAllocati;
    state.listaProgetti = data[0].listaProgetti;
    state2.data = data[1].data;
    state2.listaDipendentiNonAllocati = data[1].listaDipendentiNonAllocati;
    state2.listaProgetti = data[1].listaProgetti;
    resetPage();
    populatePage(state);
    $('#data').val(state.data);
    $('#data2').val(state2.data);
    populatePage(state, "");
    populatePage(state2, "2");
}

function populatePage(s, area) {
    s.listaProgetti.forEach(function (progetto) {
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
        $("#tabella-allocazioni" + area).append(
            "<tr id='row" + progetto.nome.replace(/\s/g, '') + "'>" +
            "<td id='nome-progetto' style='background-color: " + progetto.colore + "'>&nbsp;&nbsp;" +
            progetto.nome +
            "&nbsp;&nbsp;</td>" +
            htmlDipendentiAllocati +
            "</tr>"
        );
    });
    s.listaDipendentiNonAllocati.forEach(function (dipendente) {
        aggiungiDipendenteListaDipendenti(dipendente, "lista-dipendenti" + area);
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

function aggiungiDipendenteListaDipendenti(dipendente, idHtmlListaDipendenti) {
    let borderColor = dipendente.appartenenza == "internal" ? "; border: 3px solid #000" : "; border: 3px solid #00f9ff";
    dipendente.colore = Utils.getColorFromAnzianita(dipendente.anzianita);
    let style = dipendente.nome == "?" ? "style='border: 3px dashed #000'" : "style='background-color: #" + dipendente.colore + borderColor + "'";
    $("div#" + idHtmlListaDipendenti).append(
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

$('body').contextmenu(function(e) {
    e.preventDefault();
    if (dipendenteGrabbato == null)
        return;
    dipendenteGrabbato = Utils.resetGrab(dipendenteGrabbato);
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
            aggiungiDipendenteListaDipendenti(dipendenteAllocato, "lista-dipendenti");
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
    state.data = $('#data').val();
    state2.data = $('#data2').val();
    let saveData = [state, state2];
    saveData = JSON.stringify(saveData);
    let file = new Blob([saveData], { type: 'txt' });
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

    let area = $("#area-aggiungi-dipendente").val();
    let idDipendente = "";
    let emptyDipendente = new Dipendente(-1, "?", "?", "", "grey", 10000, "");
    if(area == "") {
        idDipendente = Utils.getNewIdDipendente(state.listaProgetti, state.listaDipendentiNonAllocati);
        if (Utils.getDipendenteFromId(state.listaDipendentiNonAllocati, -1) == null) {
            state.listaDipendentiNonAllocati.push(emptyDipendente);
        }
    } else if (area == "2") {
        idDipendente = Utils.getNewIdDipendente(state2.listaProgetti, state2.listaDipendentiNonAllocati);
        if (Utils.getDipendenteFromId(state2.listaDipendentiNonAllocati, -1) == null) {
            state2.listaDipendentiNonAllocati.push(emptyDipendente);
        }
    }

    $("div#lista-dipendenti" + area).append(
        "<div id='id" + emptyDipendente.id + "' class='icona-dipendente' style='border: 3px dashed #000'>" +
            Utils.creaIconaDipendente(emptyDipendente, emptyDipendente.perc) +
        "</div>"
    );

    let dipendente = new Dipendente(
        idDipendente,
        $("#nome-nuovo-dipendente").val().trim(),
        $("#cognome-nuovo-dipendente").val().trim(),
        $("#anzianita-nuovo-dipendente").children("option:selected").val(),
        Utils.getColorFromAnzianita($("#anzianita-nuovo-dipendente").children("option:selected").val()),
        100,
        $("#appartenenza-nuovo-dipendente").children("option:selected").val(),
        $("#sigla-nuovo-dipendente").val().trim()
    );

    if(area == "") {
        state.listaDipendentiNonAllocati.push(dipendente);
    } else if (area == "2") {
        state2.listaDipendentiNonAllocati.push(dipendente);
    }
    
    aggiungiDipendenteListaDipendenti(dipendente, "lista-dipendenti" + area);
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

    createChart(listaDipendenti);
}

function createChart(listaDipendenti) {
    let sizeTirocinanti = listaDipendenti.filter(function (dip) {
        return dip.anzianita == "tirocinante";
    }).length;
    let sizeJunior = listaDipendenti.filter(function (dip) {
        return dip.anzianita == "junior";
    }).length;
    let sizeMiddle = listaDipendenti.filter(function (dip) {
        return dip.anzianita == "middle";
    }).length;
    let sizeSenior = listaDipendenti.filter(function (dip) {
        return dip.anzianita == "senior";
    }).length;
    let tot = sizeTirocinanti + sizeJunior + sizeMiddle + sizeSenior;
    sizeTirocinanti = Math.round(sizeTirocinanti * 100 / tot);
    sizeJunior = Math.round(sizeJunior * 100 / tot);
    sizeMiddle = Math.round(sizeMiddle * 100 / tot);
    sizeSenior = Math.round(sizeSenior * 100 / tot);

    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title:{
            text: "Seniority Dipendenti"
        },
        legend:{
            cursor: "pointer",
            itemclick: explodePie
        },
        data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "{name}: <strong>{y}%</strong>",
            indexLabel: "{name} - {y}%",
            dataPoints: [
                { y: sizeTirocinanti, name: "Tirocinanti", color: "#C4C4C4", exploded: false },
                { y: sizeJunior, name: "Junior", color: "#FFFF00", exploded: false },
                { y: sizeMiddle, name: "Middle", color: "#FF9700", exploded: false },
                { y: sizeSenior, name: "Senior", color: "#BF0000", exploded: false }
            ]
        }]
    });
    chart.render();

    function explodePie (e) {
        if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
        } else {
            e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
        }
        e.chart.render();
    }
}