/* VARIABILI GLOBALI */
var state = new State();
var state2 = new State();
var dipendenteGrabbato = null;
var dipendenteGrabbato2 = null;
var listaDipendentiOld = null;


$(document).on('mousemove', function (e) {
    let cssIstructions = {
        left: e.pageX - 40,
        top: e.pageY + 5,
        position: "absolute"
    };

    if (dipendenteGrabbato != null) {
        $('div#lista-dipendenti > div#id' + dipendenteGrabbato.id).css(cssIstructions);
    } else if (dipendenteGrabbato2 != null) {
        cssIstructions.left = cssIstructions.left - getWidth() / 2
        $('div#lista-dipendenti2 > div#id' + dipendenteGrabbato2.id).css(cssIstructions);
    }    
});

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

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


/* INTERAZIONE MOUSE */
$("#body > div.container-left").click(function (e) {
    if (dipendenteGrabbato == null && e.target.id.slice(0, 2) == 'id' && $(e.target).parents('table#tabella-allocazioni').length == 0) {
        selezionaDipendenteDaAllocare(e, "1");
    } else if (dipendenteGrabbato == null && e.target.id.slice(0, 2) == 'id' && $(e.target).parents('table#tabella-allocazioni').length > 0) {
        rimuoviAllocazioneDipendente(e, state, "");
        selezionaDipendenteDaAllocare(e, "1");
    } else if (dipendenteGrabbato != null) {
        allocaDipendente(e, state, "", dipendenteGrabbato);
    } else if (dipendenteGrabbato == null && e.target.id == "nome-progetto") {
        let confermaCancellazione = confirm("Vuoi eliminare il progetto?");
        if(confermaCancellazione)
            eliminaProgetto(e, state);
    }
});

$("#body > div.container-right").click(function (e) {
    if (dipendenteGrabbato2 == null && e.target.id.slice(0, 2) == 'id' && $(e.target).parents('table#tabella-allocazioni2').length == 0) {
        selezionaDipendenteDaAllocare(e, "2");
    } else if (dipendenteGrabbato2 == null && e.target.id.slice(0, 2) == 'id' && $(e.target).parents('table#tabella-allocazioni2').length > 0) {
        rimuoviAllocazioneDipendente(e, state2, "2");
        selezionaDipendenteDaAllocare(e, "2");
    } else if (dipendenteGrabbato2 != null) {
        allocaDipendente(e, state2, "2", dipendenteGrabbato2);
    } else if (dipendenteGrabbato2 == null && e.target.id == "nome-progetto") {
        let confermaCancellazione = confirm("Vuoi eliminare il progetto?");
        if(confermaCancellazione)
            eliminaProgetto(e, state2);
    }
});

$('#body > div.container-left').contextmenu(function(e) {
    e.preventDefault();
    if (dipendenteGrabbato == null)
        return;
    dipendenteGrabbato = Utils.resetGrab(dipendenteGrabbato);
});

$('#body > div.container-right').contextmenu(function(e) {
    e.preventDefault();
    if (dipendenteGrabbato2 == null)
        return;
    dipendenteGrabbato2 = Utils.resetGrab(dipendenteGrabbato2);
});

function selezionaDipendenteDaAllocare(e, area) {
    $('body').css('cursor', 'grabbing');
    if(area == "1") {
        dipendenteGrabbato = Utils.getDipendenteFromId(state.listaDipendentiNonAllocati, e.target.id.slice(2, e.target.id.length));
    } else if (area == "2") {
        dipendenteGrabbato2 = Utils.getDipendenteFromId(state2.listaDipendentiNonAllocati, e.target.id.slice(2, e.target.id.length));
    }
}

function rimuoviAllocazioneDipendente(e, s, area) {
    let idDipendente = e.target.id.slice(2, e.target.id.length);
    let progettoSelezionato = Utils.getProgettoByNome(s.listaProgetti, e.target.parentElement.parentElement.id.slice(3));
    let dipendenteAllocato = Utils.getDipendenteFromId(progettoSelezionato.listaDipendentiAllocati, idDipendente);
    let dipendenteNonAllocato = Utils.getDipendenteFromId(s.listaDipendentiNonAllocati, idDipendente);
    if (dipendenteAllocato.nome == "?") {
        $(e.target).parents("tr > td").remove();
        Utils.removeDipendenteFromProgetto(idDipendente, progettoSelezionato);
        return;
    }

    if (dipendenteNonAllocato) {
        dipendenteNonAllocato.perc = parseInt(dipendenteNonAllocato.perc) + parseInt(dipendenteAllocato.perc);
        $('div#lista-dipendenti' + area + ' > div#id' + dipendenteNonAllocato.id + ' > div.perc').text(dipendenteNonAllocato.perc + "%");
    } else {
        aggiungiDipendenteListaDipendenti(dipendenteAllocato, "lista-dipendenti" + area);
        s.listaDipendentiNonAllocati.push(dipendenteAllocato);
    }
    $(e.target).parents("tr > td").remove();
    Utils.removeDipendenteFromProgetto(idDipendente, progettoSelezionato);
}

function allocaDipendente(e, s, area, dipendenteGrab) {
    s.listaProgetti.forEach(function (progetto) {
        let nomeProgetto = progetto.nome.replace(/\s/g, '');
        if (e.target.id == 'row' + nomeProgetto || $(e.target).parents("#row" + nomeProgetto).length) {
            if (progetto.listaDipendentiAllocati.findIndex(dipendente => dipendente.id == dipendenteGrab.id) > -1)
                return

            let perc = prompt('Inserisci la percentuale allocazione');
            if (perc == null || perc > 100 || !(/^\d+$/.test(perc)) || parseInt(perc) > parseInt(dipendenteGrab.perc)) {
                perc = dipendenteGrab.perc;
            }

            let allocationDip = new Dipendente(
                dipendenteGrab.id,
                dipendenteGrab.nome,
                dipendenteGrab.cognome,
                dipendenteGrab.anzianita,
                dipendenteGrab.colore,
                perc,
                dipendenteGrab.appartenenza,
                dipendenteGrab.sigla
            );

            if (dipendenteGrab.nome == "?") {
                $("#tabella-allocazioni" + area + " > tr#row" + nomeProgetto).append(
                    "<td id='id" + dipendenteGrab.id + "'>" +
                    "<div id='id" + dipendenteGrab.id + "' class='icona-dipendente' style='border: 3px dashed #000'>" +
                    Utils.creaIconaDipendente(dipendenteGrab, perc) +
                    "</div>" +
                    "</td>"
                );
                progetto.listaDipendentiAllocati.push(allocationDip);
                dipendenteGrab = Utils.resetGrab(dipendenteGrab);
                return;
            }

            let borderColor = dipendenteGrab.appartenenza == "internal" ? "; border: 3px solid #000" : "; border: 3px solid #00f9ff";
            $("#tabella-allocazioni" + area + " > tr#row" + nomeProgetto).append(
                "<td id='id" + dipendenteGrab.id + "'>" +
                "<div id='id" + dipendenteGrab.id + "' class='icona-dipendente' " +
                "style='background-color: #" + dipendenteGrab.colore + borderColor + "'>" +
                Utils.creaIconaDipendente(dipendenteGrab, perc) +
                "</div>" +
                "</td>"
            );

            progetto.listaDipendentiAllocati.push(allocationDip);

            if (perc == dipendenteGrab.perc) {
                $('div#lista-dipendenti' + area + ' > div#id' + dipendenteGrab.id).remove();
                Utils.removeDipendenteFromDipendentiNonAllocati(s.listaDipendentiNonAllocati, dipendenteGrab.id);
            } else {
                dipendenteGrab.perc -= perc;
                $('div#lista-dipendenti' + area + ' > div#id' + dipendenteGrab.id + ' > div.perc').text(dipendenteGrab.perc + '%');
            }

            if(area == "")
                dipendenteGrabbato = Utils.resetGrab(dipendenteGrab);
            if(area == "2")
                dipendenteGrabbato2 = Utils.resetGrab(dipendenteGrab);
        }
    });
}

function eliminaProgetto(event, s) {
    Utils.eliminaProgettoByNome(s.listaProgetti, event.target.innerText.trim(), s.listaDipendentiNonAllocati);
    let data = [
        state,
        state2
    ];
    refreshPage(data);
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

    let area = $("#area-aggiungi-progetto").val();
    let nomeNuovoProgetto = $("#nome-nuovo-progetto").val().trim();
    let coloreNuovoProgetto = $("#colore-nuovo-progetto").children("option:selected").val();
    let progetto = new Progetto(nomeNuovoProgetto, coloreNuovoProgetto);

    if(area == "") {
        state.listaProgetti.push(progetto);
    } else if (area == "2") {
        state2.listaProgetti.push(progetto);
    }

    aggiungiProgettoTableAllocazioni(progetto, "tabella-allocazioni" + area);
    $("#modaleAggiungiProgetto").css({ display: "none" });
});

function aggiungiProgettoTableAllocazioni(progetto, idHtmlTabellaAllocazioni) {
    $("#" + idHtmlTabellaAllocazioni).append(
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
            $("div#lista-dipendenti" + area).append(
                "<div id='id" + emptyDipendente.id + "' class='icona-dipendente' style='border: 3px dashed #000'>" +
                    Utils.creaIconaDipendente(emptyDipendente, emptyDipendente.perc) +
                "</div>"
            );
        }
    } else if (area == "2") {
        idDipendente = Utils.getNewIdDipendente(state2.listaProgetti, state2.listaDipendentiNonAllocati);
        if (Utils.getDipendenteFromId(state2.listaDipendentiNonAllocati, -1) == null) {
            state2.listaDipendentiNonAllocati.push(emptyDipendente);
            $("div#lista-dipendenti" + area).append(
                "<div id='id" + emptyDipendente.id + "' class='icona-dipendente' style='border: 3px dashed #000'>" +
                    Utils.creaIconaDipendente(emptyDipendente, emptyDipendente.perc) +
                "</div>"
            );
        }
    }
    
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
            "<th>Appart.</th>" +
            "<th></th>" +
        "</tr>"
    );

    let listaDipendenti = Utils.getListaDipendenti(state, state2);
    
    let count = 1;
    listaDipendenti.forEach(function(dipendente){
        dipendente.index = count;
        let sigla = dipendente.sigla ? dipendente.sigla : "";
        $("table#tabella-modifica-dipendenti").append(
            "<tr id='modifica-dipendente'>" +
                "<td>"+ dipendente.index +"</td>" +
                "<td><input class='input-none' value='" + sigla + "'/></td>" +
                "<td><input class='input-none' value='" + dipendente.nome + "'/></td>" +
                "<td><input class='input-none' value='" + dipendente.cognome + "'/></td>" +
                "<td><input class='input-none' value='" + dipendente.anzianita + "'/></td>" +
                "<td><input class='input-none' value='" + dipendente.appartenenza + "'/></td>" +
                "<td><input class='save-button' type='button' onclick='salvaDipendente(event)' value='&nbsp;&nbsp;&nbsp;'/></td>" +
            "</tr>"
        );
        count++;
    });

    createChart(listaDipendenti);
    listaDipendentiOld = listaDipendenti;
}

function salvaDipendente(e) {
    if(e.target.parentElement.parentElement.id != "modifica-dipendente")
        return;

    let datiDipendente = e.target.parentElement.parentElement.children;
    let countIndex = 0;
    let siglaIndex = 1;
    let nomeIndex = 2;
    let cognomeIndex = 3;
    let anzianitaIndex = 4;
    let appartenenzaIndex = 5;

    let index = datiDipendente[countIndex].outerText;
    let sigla = datiDipendente[siglaIndex].children[0].value;
    let nome = datiDipendente[nomeIndex].children[0].value;
    let cognome = datiDipendente[cognomeIndex].children[0].value;
    let anzianita = datiDipendente[anzianitaIndex].children[0].value;
    let appartenenza = datiDipendente[appartenenzaIndex].children[0].value;

    let d = listaDipendentiOld.find(dip => dip.index == index);
    let dipendenteOld = new Dipendente(d.id, d.nome, d.cognome, d.anzianita, d.colore, d.perc, d.appartenenza, d.sigla);
    dipendenteOld.index = d.index;
    modificaDatiDipendenteNonAllocato(state, index, sigla, nome, cognome, anzianita, appartenenza, dipendenteOld);
    modificaDatiDipendenteNonAllocato(state2, index, sigla, nome, cognome, anzianita, appartenenza, dipendenteOld);
    modificaDatiDipendenteAllocato(state, index, sigla, nome, cognome, anzianita, appartenenza, dipendenteOld);
    modificaDatiDipendenteAllocato(state2, index, sigla, nome, cognome, anzianita, appartenenza, dipendenteOld);
    refreshPage([state, state2]);
}

function modificaDatiDipendenteNonAllocato(s, index, sigla, nome, cognome, anzianita, appartenenza, dipendenteOld) {
    let dipendenteNonAllocato = s.listaDipendentiNonAllocati.find(function(dip) {
        return dip.nome == dipendenteOld.nome && dip.cognome == dipendenteOld.cognome && dip.sigla == dipendenteOld.sigla;
    });

    dipendenteNonAllocato.sigla = sigla;
    dipendenteNonAllocato.nome = nome;
    dipendenteNonAllocato.cognome = cognome;
    dipendenteNonAllocato.anzianita = anzianita;
    dipendenteNonAllocato.appartenenza = appartenenza;
}

function modificaDatiDipendenteAllocato(s, index, sigla, nome, cognome, anzianita, appartenenza, dipendenteOld) {
    s.listaProgetti.forEach(function(progetto) {
        let dipendenteAllocato = progetto.listaDipendentiAllocati.find(function(dip) {
            return dip.nome == dipendenteOld.nome && dip.cognome == dipendenteOld.cognome && dip.sigla == dipendenteOld.sigla;
        });

        if(dipendenteAllocato) {
            dipendenteAllocato.sigla = sigla;
            dipendenteAllocato.nome = nome;
            dipendenteAllocato.cognome = cognome;
            dipendenteAllocato.anzianita = anzianita;
            dipendenteAllocato.appartenenza = appartenenza;
        }
    });
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