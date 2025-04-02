import config from "../config.js";

import getPHPSession from "./getPHPSession.js";
const REFRESH_PHPSESSION = true;

export default async function fetchNotesList(evaluationId) {

    let PHPSESSID = await getPHPSession();
    if (!PHPSESSID) {
        PHPSESSID = await getPHPSession(REFRESH_PHPSESSION);
    }


    const URL = config.NOTES_LIST_URL;

    try {
        const response = await fetch(URL + evaluationId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `PHPSESSID=${PHPSESSID}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data.redirect) {
            PHPSESSID = await getPHPSession(REFRESH_PHPSESSION);
            return await fetchData(
              URL + config.SEMESTRES[config.DEFAULT_SEMESTRE_INDEX].id
            ); 
        }
    
        return data;
    } catch (error) {
        console.error(error);
        return false;
    }
}
