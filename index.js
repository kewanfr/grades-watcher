import config from "./config.js";
import { compareReleve } from "./utils/compareReleve.js";

import fetchData from "./utils/fetchData.js";
import { parseReleve } from "./utils/parseReleve.js";
import fs from "fs";
import { saveReleve } from "./utils/saveReleve.js";
import sendDiscordMessage from "./discord/sendMessage.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, userMention } from "discord.js";
import { getTimeForLog } from "./utils/functions.js";

if (!fs.existsSync("./releves/old")) {
  fs.mkdirSync("./releves/old", { recursive: true });
}

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

async function watchForNote() {
  const data = await fetchData();

  if (!data) return false;

  const parsed = await parseReleve(data);

  if (!fs.existsSync(config.LAST_RELEVE_FILE)) {
    console.log(`[${getTimeForLog()}] Aucune nouvelle note`);

    return true;
  }

  // const lastReleveData = await fs.readFileSync(
  //   config.LAST_RELEVE_FILE,
  //   "utf-8"
  // );
  const releveData = await fs.readFileSync(config.RELEVE_FILE, "utf-8");
  const releve = parsed;
  const oldReleve = JSON.parse(releveData);
  const comparaison = await compareReleve(releve, oldReleve);

  const resultSave = await saveReleve(parsed);

  console.log(`resultSave`, resultSave);

  const summaryDiff = {
    new: releve.summary,
    old: oldReleve.summary,
  };

  console.log("comparaison", comparaison);

  if (comparaison.length == 0 || comparaison == false) {
    console.log(`[${getTimeForLog()}] Aucune nouvelle note`);
    return false;
  }

  console.log("comparaison", comparaison);

  for (let nt of comparaison) {
    if (nt.oldNote.note == "~") {
      const embed = new EmbedBuilder()
        .setTitle(`Nouvelle note`)
        .setDescription(
          `${nt.ressource} - ${nt.note.description} | **${nt.note.note}** \n\n` +
          `Ma moyenne : ${summaryDiff.new.moyenne} ${summaryDiff.new.moyenne != summaryDiff.old.moyenne
            ? summaryDiff.new.moyenne > summaryDiff.old.moyenne
              ? `▲ (${summaryDiff.old.moyenne})`
              : `▼ (${summaryDiff.old.moyenne})`
            : ""
          }\n` +
          `Mon rang : #${summaryDiff.new.rang} ${summaryDiff.new.rang != summaryDiff.old.rang
            ? summaryDiff.new.rang > summaryDiff.old.rang
              ? `▲ (#${summaryDiff.old.rang})`
              : `▼ (#${summaryDiff.old.rang})`
            : ""
          } \n\n\n` +
          `Moyenne de la promo : ${summaryDiff.new.moy_promo} ${summaryDiff.new.moy_promo != summaryDiff.old.moy_promo
            ? summaryDiff.new.moy_promo > summaryDiff.old.moy_promo
              ? `▲ (${summaryDiff.old.moy_promo})`
              : `▼ (${summaryDiff.old.moy_promo})`
            : ""
          } \n`
        )
        .setColor(Colors.Blurple)
        .addFields(
          {
            name: "Note",
            value: nt.note.note,
            inline: false,
          },
          {
            name: "Minimum / Maximum",
            value: `${nt.note.noteMin} / ${nt.note.noteMax}`,
            inline: true,
          },
          {
            name: "Moyenne",
            value: nt.note.moy,
            inline: true,
          }
      );
      
      
      // Message pour toute la classe
      const embedGlobal = new EmbedBuilder()
        .setTitle(`Nouvelle note`)
        .setDescription(
          `${nt.ressource} - ${nt.note.description} \n\n` +
          `Moyenne de la promo : ${summaryDiff.new.moy_promo} ${summaryDiff.new.moy_promo != summaryDiff.old.moy_promo
            ? summaryDiff.new.moy_promo > summaryDiff.old.moy_promo
              ? `▲ (${summaryDiff.old.moy_promo})`
              : `▼ (${summaryDiff.old.moy_promo})`
            : ""
          } \n`
        )
        .setColor(Colors.Blurple)
        .addFields(
          {
            name: "Minimum / Maximum",
            value: `${nt.note.noteMin} / ${nt.note.noteMax}`,
            inline: true,
          },
          {
            name: "Moyenne",
            value: nt.note.moy,
            inline: true,
          }
        );
      

      await sendDiscordMessage([embed], `${userMention("355402435893919754")} ${config.URL_SITE}`, 1);
      await sendDiscordMessage([embedGlobal], `${config.URL_SITE}`, 2);

      console.log("Nouvelle note", nt);
    } else {
      console.log(`[${getTimeForLog()}] Aucune nouvelle note`);
    }
  }
}

watchForNote();
setInterval(() => {
  watchForNote();
}, config.REFRESH_INTERVAL);