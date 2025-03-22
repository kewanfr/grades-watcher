import fs from "fs";


export async function parseReleve(dataReleve) {


    // console.log("dataReleve", JSON.stringify(dataReleve, null, 2));
    await fs.writeFileSync("./dataAll.json", JSON.stringify(dataReleve, null, 2));
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
    console.log("dataReleve", dataReleve);
    console.log("ressources", dataReleve.ressources);
    console.log("ressources", Object.entries(dataReleve.ressources));

    for (const [key, value] of Object.entries(dataReleve.ressources)) {
      console.log("ressources", key, value);

      const notes = [];

      for (const [ke, val] of Object.entries(value.evaluations)) {
        notes.push({
          id: val.id,
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
      };
    }




    for (const [key, value] of Object.entries(dataReleve.saes)) {


        const notes = [];

        for (const [ke, val] of Object.entries(value.evaluations)) {

            notes.push({
                id: val.id,
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
