import dotenv from "dotenv";

dotenv.config({
  path: ".env",
  debug: true,
  override: true,
});

// console.log(process.env);
export default {
  GMAIL_CODE: process.env.GMAIL_CODE,
  onProduction: process.env.NODE_ENV === "production",

  PORT: process.env.PORT || 3000,

  chromium_path: process.env.CHROMIUM_PATH || "/snap/bin/chromium",

  webhookURL: "",
  DEFAULT_SEMESTRE_INDEX: 1,
  SEMESTRES: [
    {
      name: "S1",
      id: 1021,
      enabled: false,
    },
    {
      name: "S2",
      id: 1087,
      enabled: true,
    },
  ],
  DATA_URL:
    "https://notes.iut-nantes.univ-nantes.fr/services/data.php?q=relev%C3%A9Etudiant&semestre=",
  // DATA_URL2: "https://notes.iut-nantes.univ-nantes.fr/services/data.php?q=relev%C3%A9Etudiant&semestre=1087",
  // DATA_URL: "https://notes.iut-nantes.univ-nantes.fr/services/data.php?q=dataPremièreConnexion",
  NOTES_LIST_URL:
    "https://notes.iut-nantes.univ-nantes.fr/services/data.php?q=listeNotes&eval=",
  LOGIN_PAGE_URL:
    "https://notes.iut-nantes.univ-nantes.fr/services/doAuth.php?href=https%3A%2F%2Fnotes.iut-nantes.univ-nantes.fr%2F",
  URL_SITE: "https://notes.iut-nantes.univ-nantes.fr/",

  PHPSESSION_FILE: "./data/phpsession.json",
  RELEVE_FILE: "./releves/releve.json",
  LAST_RELEVE_FILE: "./releves/lastReleve.json",

  OLD_RELEVE_FOLDER: "./releves/old/",

  HEADLESS: false,

  login: {
    username: process.env.CAS_USERNAME,
    password: process.env.CAS_PASSWORD,
  },

  discord: {
    avatarURL:
      "https://yt3.googleusercontent.com/RNnAGLlbC2gUCLcMtxzRBeZq2YEchUFvzgPyV8AMkYos-V38ZugWGTglAgLQYqAPXVDj07bliQ=s900-c-k-c0x00ffffff-no-rj",
    webhookURL: {
      1: process.env.DISCORD_WEBHOOK_URL_1,
      2: process.env.DISCORD_WEBHOOK_URL_2,
      3: process.env.DISCORD_WEBHOOK_URL_3,
    },
  },

  REFRESH_INTERVAL: 1000 * 60 * 25, // 25 minutes (100ms * 60s * 25 min)
  // REFRESH_INTERVAL: 1000*60*60*2 // 15 minutes (100ms * 60s * 60min * 2h)
};
