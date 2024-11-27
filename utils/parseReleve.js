

export async function parseReleve(dataReleve) {
    console.log(dataReleve);

    var res = {};

    res.summary = {
        moyenne: dataReleve.semestre?.notes?.value,
        min: dataReleve.semestre?.notes?.min,
        moy_promo: dataReleve.semestre?.notes?.moy,
        max_promo: dataReleve.semestre?.notes?.max,
        rang: dataReleve.semestre?.rang?.value,
    }

    res.ressources = {}

    for (const [key, value] of Object.entries(dataReleve.ressources)) {


        const notes = [];

        for (const [ke, val] of Object.entries(value.evaluations)) {

            notes.push({
                description: val.description,
                note: val.note.value,
                noteMin: val.note.min,
                noteMax: val.note.max,
                moy: val.note.moy,
                coef: val.note.coef,
                poids: val.poids,
            });
        }


        res.ressources[key] = {
            key: key, 
            nom: value.titre,
            notes: notes,
        }
    }

    return res;

}
