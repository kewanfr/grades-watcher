import { saveReleve } from "./saveReleve.js";


export async function parseReleve(dataReleve) {


    // console.log("dataReleve", JSON.stringify(dataReleve, null, 2));
    if (dataReleve["relevé"]){
        dataReleve = dataReleve["relevé"]
    }

    var res = {};

    res.summary = {
        moyenne: dataReleve.semestre?.notes?.value,
        min: dataReleve.semestre?.notes?.min,
        moy_promo: dataReleve.semestre?.notes?.moy,
        max_promo: dataReleve.semestre?.notes?.max,
        rang: dataReleve.semestre?.rang?.value,
    }

    res.ressources = {}
    res.saes = {}


    for (const [key, value] of Object.entries(dataReleve.ressources)) {


        const notes = [];

        for (const [ke, val] of Object.entries(value.evaluations)) {

            notes.push({
                description: val.description,
                note: val.note.value,
                noteMin: val.note.min,
                noteMax: val.note.max,
                moy: val.note.moy,
                // coef: val.note.coef,
                poids: val.poids,
            });
        }


        res.ressources[key] = {
            key: key, 
            nom: value.titre,
            notes: notes,
        }
    }




    for (const [key, value] of Object.entries(dataReleve.saes)) {


        const notes = [];

        for (const [ke, val] of Object.entries(value.evaluations)) {

            notes.push({
                description: val.description,
                note: val.note.value,
                noteMin: val.note.min,
                noteMax: val.note.max,
                moy: val.note.moy,
                // coef: val.note.coef,
                poids: val.poids,
            });
        }


        res.saes[key] = {
            key: key, 
            nom: value.titre,
            notes: notes,
        }
    }

    // await saveReleve(res);

    return res;

}
