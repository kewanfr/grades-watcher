import dotenv from 'dotenv';


dotenv.config();

export default {

    webhookURL: "",
    DATA_URL: "https://notes.iut-nantes.univ-nantes.fr/services/data.php?q=dataPremièreConnexion",
    LOGIN_PAGE_URL: "https://notes.iut-nantes.univ-nantes.fr/services/doAuth.php?href=https%3A%2F%2Fnotes.iut-nantes.univ-nantes.fr%2F",
    PHPSESSION_PAGE: "./data/phpsession.json",
    HEADLESS: false,
    
    login: {
        username: process.env.CAS_USERNAME,
        password: process.env.CAS_PASSWORD
    }

}

