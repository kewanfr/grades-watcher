import fs from 'fs';
import config from '../config.js';

export async function compareReleve(releve) {

    const oldReleveStr = await fs.readFileSync(config.RELEVE_FILE, 'utf8');
    var oldReleve = null;
    try {
        oldReleve = JSON.parse(oldReleveStr);
    } catch (error) {
        console.error("Error parsing releve file", error);
        return false;
    }

    if (oldReleve === releve) {
        return false;
    }

    var diff = [];
    
    for (const R in releve.ressources) {
        console.log(R);
        const ressource = releve.ressources[R];
        const oldRessource = oldReleve.ressources[R];
        if (oldRessource === ressource) {
            continue;
        }
        for (const N in ressource.notes) {
            const note = ressource.notes[N];
            const oldNote = oldRessource.notes[N];
            if (oldNote === note) {
                continue;
            }
            
            if (note.note !== oldNote.note) {
                console.log('note différente');
                console.log(note, oldNote)

                diff.push({
                    ressource: R,
                    index: N,
                    note: note,
                    oldNote: oldNote,
                });
            }
        }
    }

    return diff;
}