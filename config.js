import dotenv from 'dotenv';


dotenv.config();

export default {

    webhookURL: "",
    dataURL: "https://notes.iut-nantes.univ-nantes.fr/services/data.php?q=dataPremièreConnexion",
    dataPath: "./data/phpsession.json",
    HEADLESS: false,
    
    login: {
        username: process.env.CAS_USERNAME,
        password: process.env.CAS_PASSWORD
    }

}

