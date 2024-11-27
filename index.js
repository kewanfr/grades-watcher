import config from "./config.js";
import { compareReleve } from "./utils/compareReleve.js";

import fetchData from "./utils/fetchData.js";
import { parseReleve } from "./utils/parseReleve.js";
import fs from "fs";
import { saveReleve } from "./utils/saveReleve.js";
import sendDiscordMessage from "./discord/sendMessage.js";
import { Colors, EmbedBuilder } from "discord.js";

if (!fs.existsSync("./releves/old")) {
  fs.mkdirSync("./releves/old", { recursive: true });
}

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

async function main() {
  const data = await fetchData();

//   // await fs.writeFileSync("./data/data.json", JSON.stringify(data))

//   const data = JSON.parse(await fs.readFileSync("./data/data.json"));


  const parsed = await parseReleve(data);
  const resultSave = await saveReleve(parsed);

  if (!fs.existsSync(config.LAST_RELEVE_FILE)) return true;

  const lastReleveData = await fs.readFileSync(
    config.LAST_RELEVE_FILE,
    "utf-8"
  );
  const releveData = await fs.readFileSync(config.RELEVE_FILE, "utf-8");
  const comparaison = await compareReleve(
    JSON.parse(releveData),
    JSON.parse(lastReleveData)
  );

  console.log("comparaison", comparaison);

  for (let nt of comparaison) {
    if (nt.oldNote.note == "~") {

        const embed = new EmbedBuilder()
            .setTitle(`Nouvelle note`)
            .setDescription(`${nt.ressource} - ${nt.note.description} | **${nt.note.note}**`)
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
                    inline: true
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
                  },
            );
        
        const embedGlobal = new EmbedBuilder()
            .setTitle(`Nouvelle note`)
            .setDescription(`${nt.ressource} - ${nt.note.description} | **${nt.note.note}**`)
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
                    inline: true
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
                  },
            );

      await sendDiscordMessage(null, [embed])
    }
  }

}

main();
