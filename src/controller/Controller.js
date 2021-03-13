/* VARIABILI GLOBALI */
var state = new State();
var dipendenteGrabbato = null;

$(document).on('mousemove', function(e){
    if(dipendenteGrabbato == null)
        return

    $('tr#lista-dipendenti > td > div#id' + dipendenteGrabbato.id).css({
       left:  e.pageX - 40,
       top:   e.pageY - 25,
       position: "absolute"
    });
});

/* IMPORT DATI */
document.getElementById("aggiungi-dipendenti").addEventListener("click", function () {
    document.getElementById("importa-dipendenti").click();
});

document.getElementById("aggiungi-progetti").addEventListener("click", function () {
    document.getElementById("importa-progetti").click();
});

document.getElementById("importa-dipendenti").addEventListener("change", function () {
    let file = document.getElementById("importa-dipendenti").files[0];
    var reader = new FileReader();
    reader.onload = readSuccess;
    function readSuccess(evt) {
        let listaDipendenti = evt.target.result.split('\n');

        let idDipendente = 0;
        listaDipendenti.shift();
        listaDipendenti.forEach(function (rowDipendente) {
            let dipendente = rowDipendente.split(',');
            let nome = dipendente[0].toLowerCase();
            nome = nome[0].toUpperCase() + nome.slice(1);
            let cognome = dipendente[1].toLowerCase();
            cognome = cognome[0].toUpperCase() + cognome.slice(1);
            let anzianita = dipendente[2].toUpperCase().trim();
            let color = '';
            switch (anzianita) {
                case "SENIOR":
                    color = 'BF0000';
                    break;
                case "MIDDLE":
                    color = 'BF7100';
                    break;
                case "JUNIOR":
                    color = 'BFBF00';
                    break;
                default:
                    break;
            }

            dipendente = new Dipendente(idDipendente, nome, cognome, anzianita, color, 100);
            state.listaDipendentiNonAllocati.push(dipendente);
            aggiungiDipendenteListaDipendenti(dipendente);
            idDipendente++;
        });
    };
    reader.readAsText(file);
});

document.getElementById("importa-progetti").addEventListener("change", function () {
    let file = document.getElementById("importa-progetti").files[0];
    var reader = new FileReader();
    reader.onload = readSuccess;
    function readSuccess(evt) {
        let progetti = evt.target.result.split('\n');
        progetti.shift();
        progetti.forEach(function (progettoRow) {
            let progetto = progettoRow.split(',');
            let nomeProgetto = progetto[0].trim();
            let color = progetto[1].trim();
            progetto = new Progetto(nomeProgetto, color);
            state.listaProgetti.push(progetto);
        });
        createTableAllocazioni(state.listaProgetti);
    };
    reader.readAsText(file);
});

function aggiungiDipendenteListaDipendenti(dipendente) {
    $("tr#lista-dipendenti").append(
        "<td id='id" + dipendente.id + "'>" +
        "<div id='id" + dipendente.id + "' class='icona-dipendente' style='background-color: #" + dipendente.colore + "''>" +
        Utils.creaIconaDipendente(dipendente, dipendente.perc) +
        "</div>" +
        "</td>"
    );
}

function createTableAllocazioni(listaProgetti) {
    listaProgetti.forEach(function (progetto) {
        $("#tabella-allocazioni").append(
            "<tr id='row" + progetto.nome.replace(/\s/g, '') + "'>" +
            "<td id='nome-progetto' style='background-color: " + progetto.colore + "'>&nbsp;&nbsp;" +
            progetto.nome +
            "&nbsp;&nbsp;</td>" +
            "</tr>"
        );
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
    }
});

function selezionaDipendenteDaAllocare(e) {
    $('body').css('cursor', 'grabbing');
    dipendenteGrabbato = Utils.getDipendenteFromId(state.listaDipendentiNonAllocati, e.target.id.slice(2, e.target.id.length));
}

function rimuoviAllocazioneDipendente(e) {
    let flagYesNo = confirm("Vuoi rimuovere l'allocazione?");
    if (flagYesNo) {
        let dipendente = null;
        for(i = 0; i < state.listaProgetti.length; i++) {
            let progetto = state.listaProgetti[i];
            dipendente = Utils.getDipendenteFromId(progetto.listaDipendentiAllocati, e.target.id.slice(2, e.target.id.length));
            if(dipendente)
                break;
        }
        $(e.target).parents("tr > td").remove();
        if (dipendente.perc == 0) {
            dipendente.perc = e.target.getElementsByClassName("perc")[0].innerHTML.slice(0, -1);
            aggiungiDipendenteListaDipendenti(dipendente);
            Utils.removeDipendenteFromProgetto(state.listaProgetti, dipendente.id);
        } else {
            let perc = e.target.getElementsByClassName("perc")[0].innerHTML.slice(0, -1);
            Utils.aggiornaDipendenteListaDipendenti(dipendente, perc);
            Utils.removeDipendenteFromProgetto(state.listaProgetti, dipendente.id);
        }
    }
}

function allocaDipendente(e) {
    state.listaProgetti.forEach(function (progetto) {
        let nomeProgetto = progetto.nome.replace(/\s/g, '');
        if (e.target.id == 'row' + nomeProgetto || $(e.target).parents("#row" + nomeProgetto).length) {
            if(progetto.listaDipendentiAllocati.findIndex(dipendente => dipendente.id == dipendenteGrabbato.id) > -1)
                return

            let perc = prompt('Inserisci la percentuale allocazione');
            perc = perc ? perc : dipendenteGrabbato.perc;
            $("#tabella-allocazioni > tr#row" + nomeProgetto).append(
                "<td id='id" + dipendenteGrabbato.id + "'>" +
                "<div id='id" + dipendenteGrabbato.id + "' class='icona-dipendente' " +
                "style='background-color: #" + dipendenteGrabbato.colore + "'>" +
                Utils.creaIconaDipendente(dipendenteGrabbato, perc) +
                "</div>" +
                "</td>"
            );
            if (perc == dipendenteGrabbato.perc) {
                $('tr#lista-dipendenti > td#id' + dipendenteGrabbato.id).remove();
                dipendenteGrabbato.perc = 0;
                progetto.listaDipendentiAllocati.push(dipendenteGrabbato);
                Utils.removeDipendenteFromDipendentiNonAllocati(state.listaDipendentiNonAllocati, dipendenteGrabbato.id);
            } else {
                dipendenteGrabbato.perc -= perc;
                $('tr#lista-dipendenti > td > div#id' + dipendenteGrabbato.id + ' > div.perc').text(dipendenteGrabbato.perc + '%');
                progetto.listaDipendentiAllocati.push(dipendenteGrabbato);
            }

            dipendenteGrabbato = Utils.resetGrab(dipendenteGrabbato);
        }
    });
}