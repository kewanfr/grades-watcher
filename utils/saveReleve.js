import fs from 'fs';
import config from '../config.js';

export async function saveReleve(releve) {

    return await fs.writeFileSync(config.RELEVE_FILE, JSON.stringify(releve, null, 2));
}