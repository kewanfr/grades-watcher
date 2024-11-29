import config from "./config.js";
import { compareReleve } from "./utils/compareReleve.js";

import fetchData from "./utils/fetchData.js";
import { parseReleve } from "./utils/parseReleve.js";
import fs from "fs";
import { saveReleve } from "./utils/saveReleve.js";
import sendDiscordMessage from "./discord/sendMessage.js";
import { Colors, EmbedBuilder } from "discord.js";
import { getTimeForLog } from "./utils/functions.js";

if (!fs.existsSync("./releves/old")) {
  fs.mkdirSync("./releves/old", { recursive: true });
}

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

async function watchForNote() {
  const data = await fetchData();

  if (!data) return false


  const parsed = await parseReleve(data);
  const resultSave = await saveReleve(parsed);

  if (!fs.existsSync(config.LAST_RELEVE_FILE)) {
    console.log(`[${getTimeForLog()}] Aucun nouvelle note`);
    
    return true;
  }

  const lastReleveData = await fs.readFileSync(
    config.LAST_RELEVE_FILE,
    "utf-8"
  );
  const releveData = await fs.readFileSync(config.RELEVE_FILE, "utf-8");
  const comparaison = await compareReleve(
    JSON.parse(releveData),
    JSON.parse(lastReleveData)
  );

  if (comparaison.length == 0 || comparaison == false) {
    console.log(`[${getTimeForLog()}] Aucun nouvelle note`);
    return false
  }

  console.log("comparaison", comparaison);

  for (let nt of comparaison) {
    if (nt.oldNote.note == "~") {
      const embed = new EmbedBuilder()
        .setTitle(`Nouvelle note`)
        .setDescription(
          `${nt.ressource} - ${nt.note.description} | **${nt.note.note}**`
        )
        .setColor(Colors.Blurple)
        .addFields(
          {
            name: "Note",
            value: nt.note.note,
            inline: false,
          },
          {
            name: "Note Minimum",
            value: nt.note.noteMin,
            inline: true,
          },
          {
            name: "Note Maximum",
            value: nt.note.noteMax,
            inline: true,
          },
          {
            name: "Moyenne",
            value: nt.note.moy,
            inline: true,
          }
        );

      await sendDiscordMessage([embed], null, 1);

      console.log("Nouvelle note", nt);
    } else {
      console.log(`[${getTimeForLog()}] Aucun nouvelle note`)
    }
  }
}

setInterval(() => {
  watchForNote();
}, 1000);