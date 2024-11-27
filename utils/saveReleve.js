import fs from 'fs';
import config from '../config.js';
import { getTimeFileName } from './functions.js';
import path from 'path';

export async function saveReleve(releve) {

    const fileName = getTimeFileName() + ".txt";
    const filePath = path.join(config.OLD_RELEVE_FOLDER, fileName);

    await fs.writeFileSync(filePath, JSON.stringify(releve, null, 2));

    if (!fs.existsSync(config.RELEVE_FILE)) {
        return await fs.writeFileSync(config.RELEVE_FILE, JSON.stringify(releve, null, 2));
    }
    
    const oldReleve = await fs.readFileSync(config.RELEVE_FILE, 'utf8');

    await fs.writeFileSync(config.LAST_RELEVE_FILE, oldReleve)
    return await fs.writeFileSync(config.RELEVE_FILE, JSON.stringify(releve, null, 2));

    

}