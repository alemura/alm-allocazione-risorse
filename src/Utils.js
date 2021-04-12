class Utils {
    static aggiornaData(e) {
        let data = e.target.value;
        let d = data.slice(8, 10);
        let m = data.slice(5, 7);
        let y = data.slice(0, 4);
        $('#date').text(d + "/" + m + "/" + y);
    }

    static creaIconaDipendente(dipendente, perc) {
        let matchesNome = dipendente.nome.match(/\b(\w)/g);
        if (matchesNome == null || matchesNome == "?") {
            return "?" + "<br><div class='perc'>&nbsp&nbsp&nbsp&nbsp&nbsp</div>";
        }
        let matchesCognome = dipendente.cognome.match(/\b(\w)/g);
        let siglaNome = matchesNome.join('').toUpperCase();
        let siglaCognome = matchesCognome.join('').toUpperCase();
        return siglaNome + siglaCognome + "<br><div class='perc'>" + perc + "%</div>";
    }

    static getDipendenteFromId(listaDipendenti, id) {
        return listaDipendenti.filter(function (dipendente) {
            return dipendente.id == id;
        })[0];
    }

    static getProgettoFromNome(listaProgetti, nomeProgetto) {
        return listaProgetti.filter(function (progetto) {
            return progetto.nome.replace(/\s/g, '') == nomeProgetto;
        })[0];
    }

    static resetGrab(dipendenteGrabbato) {
        $('body').css('cursor', 'grab');
        $('div#id' + dipendenteGrabbato.id).css('position','static');
        return null;
    }

    static aggiornaDipendenteListaDipendenti(dipendente, perc) {
        dipendente.perc = parseInt(dipendente.perc) + parseInt(perc);
        $('tr#lista-dipendenti > td > div#id' + dipendente.id + ' > div.perc').text(dipendente.perc + "%");
    }

    static removeDipendenteFromProgetto(idDipendente, progetto) {
        let index = progetto.listaDipendentiAllocati.findIndex(dipendente => dipendente.id == idDipendente);
        progetto.listaDipendentiAllocati.splice(index, 1);
    }

    static removeDipendenteFromDipendentiNonAllocati(listaDipendentiNonAllocati, idDipendente) {
        let index = listaDipendentiNonAllocati.findIndex(dipendente => dipendente.id == idDipendente);
        listaDipendentiNonAllocati.splice(index, 1);
    }

    static getNewIdDipendente(listaProgetti, listaDipendentiNonAllocati) {
        let id = 0;
        listaProgetti.forEach(function (progetto) {
            progetto.listaDipendentiAllocati.forEach(function (dipendente) {
                id = id < dipendente.id ? dipendente.id : id;
            });
        });
        listaDipendentiNonAllocati.forEach(function (dipendente) {
            id = id < dipendente.id ? dipendente.id : id;
        });
        return id + 1;
    }

    static getColorFromAnzianita(anzianita) {
        let color = '';
        switch (anzianita.toUpperCase().trim()) {
            case "TIROCINANTE":
                color = "C4C4C4";
                break;
            case "SENIOR":
                color = 'BF0000';
                break;
            case "MIDDLE":
                color = 'FF9700';
                break;
            case "JUNIOR":
                color = 'BFBF00';
                break;
            default:
                break;
        }
        
        return color;
    }
}