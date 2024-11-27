import dotenv from 'dotenv';


dotenv.config();

export default {

    webhookURL: "",
    DATA_URL: "https://notes.iut-nantes.univ-nantes.fr/services/data.php?q=dataPremièreConnexion",
    LOGIN_PAGE_URL: "https://notes.iut-nantes.univ-nantes.fr/services/doAuth.php?href=https%3A%2F%2Fnotes.iut-nantes.univ-nantes.fr%2F",

    PHPSESSION_FILE: "./data/phpsession.json",
    RELEVE_FILE: "./releves/releve.json",
    LAST_RELEVE_FILE: "./releves/lastReleve.json",

    OLD_RELEVE_FOLDER: "./releves/old/",

    HEADLESS: false,
    
    login: {
        username: process.env.CAS_USERNAME,
        password: process.env.CAS_PASSWORD
    },

    discord: {
        avatarURL: "https://yt3.googleusercontent.com/RNnAGLlbC2gUCLcMtxzRBeZq2YEchUFvzgPyV8AMkYos-V38ZugWGTglAgLQYqAPXVDj07bliQ=s900-c-k-c0x00ffffff-no-rj",
        webhookURL: process.env.DISCORD_WEBHOOK_URL
    }

}

