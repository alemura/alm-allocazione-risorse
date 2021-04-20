class Utils {
    static creaIconaDipendente(dipendente, perc) {
        let matchesNome = dipendente.nome.match(/\b(\w)/g);
        if ((matchesNome == null || matchesNome == "?") && (!dipendente.sigla || dipendente.sigla.trim() == "")) {
            return "?" + "<br><div class='perc'>&nbsp&nbsp&nbsp&nbsp&nbsp</div>";
        }
        let matchesCognome = dipendente.cognome.match(/\b(\w)/g);
        let siglaNome = matchesNome == null ? "" : matchesNome.join('').toUpperCase();
        let siglaCognome = matchesCognome == null ? "" : matchesCognome.join('').toUpperCase();
        if(dipendente.sigla && dipendente.sigla.trim() != "") 
            return dipendente.sigla.toUpperCase() + "<br><div class='perc'>" + perc + "%</div>";
        else 
            return siglaNome + siglaCognome + "<br><div class='perc'>" + perc + "%</div>";
    }

    static getDipendenteFromId(listaDipendenti, id) {
        return listaDipendenti.filter(function (dipendente) {
            return dipendente.id == id;
        })[0];
    }

    static getProgettoByNome(listaProgetti, nomeProgetto) {
        return listaProgetti.filter(function (progetto) {
            return progetto.nome.replace(/\s/g, '') == nomeProgetto;
        })[0];
    }

    static eliminaProgettoByNome(listaProgetti, nomeProgetto, listaDipendentiNonAllocati) {
        let index = listaProgetti.findIndex(progetto => progetto.nome == nomeProgetto);
        if(index == -1)
            return;

        let listaDipendentiAllocati = listaProgetti[index].listaDipendentiAllocati;
        if(listaDipendentiAllocati.length > 0) {
            listaDipendentiAllocati.forEach(function(dipendente) {
                let indexDipendenteNonAllocato = listaDipendentiNonAllocati.findIndex(dip => dip.id == dipendente.id);
                if(indexDipendenteNonAllocato == -1) {
                    listaDipendentiNonAllocati.push(dipendente);
                } else {
                    listaDipendentiNonAllocati[indexDipendenteNonAllocato].perc = parseInt(listaDipendentiNonAllocati[indexDipendenteNonAllocato].perc) + parseInt(dipendente.perc);
                }
            });
        }
        
        listaProgetti.splice(index, 1);
    }

    static resetGrab(dipendenteGrabbato) {
        $('body').css('cursor', 'grab');
        $('div#id' + dipendenteGrabbato.id).css('position','static');
        return null;
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
                color = 'FFFF00';
                break;
            default:
                break;
        }
        
        return color;
    }

    static getListaDipendenti(state, state2) {
        let listaDipendentiLeft = Utils.getListaDipendentiSingolaArea(state);
        let listaDipendentiRight = Utils.getListaDipendentiSingolaArea(state2);
        let listaDipendenti = [];

        if (listaDipendentiLeft.length > listaDipendentiRight.length) {
            listaDipendenti = listaDipendentiLeft;
            listaDipendentiRight.forEach(function(dipendente) {
                let index = listaDipendenti.findIndex(function(dip) {
                    return dip.nome == dipendente.nome && dip.cognome == dipendente.cognome && dip.sigla == dipendente.sigla;
                });
                if(index == -1) {
                    listaDipendenti.push(dipendente);
                }
            });
        } else {
            listaDipendenti = listaDipendentiRight;
            listaDipendentiLeft.forEach(function(dipendente) {
                let index = listaDipendenti.findIndex(function(dip) {
                    return dip.nome == dipendente.nome && dip.cognome == dipendente.cognome && dip.sigla == dipendente.sigla;
                });
                if(index == -1) {
                    listaDipendenti.push(dipendente);
                }
            });
        }

        listaDipendenti.sort(function (dip1, dip2) {
            if( dip1.cognome < dip2.cognome ) {
                return -1;
            }
            if( dip1.cognome > dip2.cognome ) {
                return 1;
            }
            return 0;
        });

        return listaDipendenti;
    }

    static getListaDipendentiSingolaArea(state) {
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
          
        return listaDipendenti;
    }
}