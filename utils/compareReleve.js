import fs from 'fs';
import config from '../config.js';

export async function compareReleve(releve, oldReleve = null) {

    if (oldReleve == null) {

        if (!fs.existsSync(config.RELEVE_FILE)){
            return false
        }

        const oldReleveStr = await fs.readFileSync(config.RELEVE_FILE, "utf8");

        try {
            oldReleve = JSON.parse(oldReleveStr);
        } catch (error) {
            console.error("Error parsing releve file", error);
            return false;
        }

    }

    var diff = [];
    
    if (oldReleve === releve) {
      return diff;
    }
    
    for (const R in releve.ressources) {
        // console.log(R);
        const ressource = releve.ressources[R];
        const oldRessource = oldReleve.ressources[R];
        if (oldRessource === ressource) {
            continue;
        }
        for (const N in ressource.notes) {
            const note = ressource.notes[N];
            const oldNote = oldRessource ? oldRessource.notes[N] : note;
            if (oldNote === note) {
                continue;
            }

            console.log("note", note, "oldNote", oldNote);

            if (note && note.note && note.note != oldNote.note) {
              // console.log('note différente');
              // console.log(note, oldNote)

              diff.push({
                id: note.id,
                ressource: R,
                nom: releve.ressources[R].nom,
                index: N,
                note: note,
                oldNote: oldNote,
              });
            }
        }
    }


    for (const S in releve.saes) {
        // console.log(R);
        const sae = releve.saes[S];
        const oldSae = oldReleve.saes ? oldReleve.saes[S] : sae;
        if (oldSae === sae) {
            continue;
        }
        for (const N in sae.notes) {
            const note = sae.notes[N];
            const oldNote = oldSae ? oldSae.notes[N] : note;
            if (oldNote === note) {
                continue;
            }
            
            if (note.note != oldNote.note) {
              // console.log('note différente');
              // console.log(note, oldNote)

              diff.push({
                id: note.id,
                ressource: S,
                nom: releve.saes[S].nom,
                index: N,
                note: note,
                oldNote: oldNote,
              });
            }
        }
    }

    return diff;
}