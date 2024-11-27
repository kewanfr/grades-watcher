import fs from 'fs';

export async function saveReleve(releve) {

    return await fs.writeFileSync("./data/releve.json", JSON.stringify(releve, null, 2));
}