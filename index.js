import config from "./config.js";
import { compareReleve } from "./utils/compareReleve.js";

import fetchData from "./utils/fetchData.js";
import { parseReleve } from "./utils/parseReleve.js";
import fs from "fs";
import { saveReleve } from "./utils/saveReleve.js";
import sendDiscordMessage from "./discord/sendMessage.js";
import { Colors, EmbedBuilder, userMention } from "discord.js";
import { getTimeForLog } from "./utils/functions.js";
import { generateChartBuffer } from "./utils/generateChart.js";
import { sendDiscordFile } from "./discord/sendDiscordFile.js";
import fetchNotesList from "./utils/fetchNotesList.js";
import sendMail from "./utils/sendMail.js";

import express from "express";
import bodyParser from "body-parser";

if (!fs.existsSync("./releves/old")) {
  fs.mkdirSync("./releves/old", { recursive: true });
}

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

async function watchForNote(DATA_URL = config.DATA_URL, sendRes = false) {
  const data = await fetchData(DATA_URL);


  // return false
  
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

  // console.log(`resultSave`, resultSave);

  const summaryDiff = {
    new: releve.summary,
    old: oldReleve.summary,
  };

  console.log("comparaison", comparaison);

  if (comparaison.length == 0 || comparaison == false) {
    console.log(`[${getTimeForLog()}] Aucune nouvelle note`);
    if (sendRes) {
      sendDiscordMessage([], `Aucune nouvelle note`, 3);
    }
    return false;
  }

  // console.log("comparaison", comparaison);

  for (let nt of comparaison) {
    if (nt.oldNote.note == "~") {
      const embed = new EmbedBuilder()
        .setTitle(`Nouvelle note`)
        .setDescription(
          `${nt.ressource} ${nt.nom}${nt.note.description != "" ? ` - ${nt.note.description}` : ""} | **${nt.note.note}** \n\n` +
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
          } \n\n` +
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
      
      var subject = `📚 [NOTE] ${nt.note.note} - ${nt.ressource} ${nt.nom}`;
      var html = `${nt.ressource} <b style="text-decoration: underline;">${nt.nom}${nt.note.description != "" ? ` - ${nt.note.description}` : ""}</b> => <b>x${nt.note.note}</b><br /><br />` +
        `Ma moyenne : ${summaryDiff.new.moyenne} ${summaryDiff.new.moyenne != summaryDiff.old.moyenne
          ? summaryDiff.new.moyenne > summaryDiff.old.moyenne
            ? `▲ (${summaryDiff.old.moyenne})`
            : `▼ (${summaryDiff.old.moyenne})`
          : ""
        }<br />` +
        `Mon rang : #${summaryDiff.new.rang} ${summaryDiff.new.rang != summaryDiff.old.rang
          ? summaryDiff.new.rang > summaryDiff.old.rang
            ? `▲ (#${summaryDiff.old.rang})`
            : `▼ (#${summaryDiff.old.rang})`
          : ""
        } <br /><br />` +
        `Moyenne de la promo : ${summaryDiff.new.moy_promo} ${summaryDiff.new.moy_promo != summaryDiff.old.moy_promo
          ? summaryDiff.new.moy_promo > summaryDiff.old.moy_promo
            ? `▲ (${summaryDiff.old.moy_promo})`
            : `▼ (${summaryDiff.old.moy_promo})`
          : ""
        } <br/> <br/> Lien du site: <a href="${config.URL_SITE}">${config.URL_SITE}</a>`;

      sendMail("mail@kewan.fr", subject, html);
      

      // Message pour toute la classe
      const embedGlobal = new EmbedBuilder()
        .setTitle(`Nouvelle note`)
        .setDescription(
          `${nt.ressource} ${nt.nom}${nt.note.description != "" ? ` - ${nt.note.description}` : ""} \n\n` +
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
      
      // console.log("Nouvelle note", embedGlobal);

      
      const filename = 'notes-histogram.png';
      
      const notesList = await fetchNotesList(nt.id);
      // console.log("notesList", notesList);
      const imageBuffer = await generateChartBuffer(notesList);

      
      await sendDiscordMessage([embed], `${userMention("355402435893919754")} ${config.URL_SITE}`, 1); // Message for notes-test
      await sendDiscordMessage([embed], `${userMention("355402435893919754")} ${config.URL_SITE}`, 3); // Message for down detector channel
      await sendDiscordMessage([embedGlobal], `${config.URL_SITE}`, 2); // Message for all the class
      await sendDiscordFile(imageBuffer, 2, filename)

    } else {
      console.log(`[${getTimeForLog()}] Aucune nouvelle note`);
      if (sendRes) {
        sendDiscordMessage([], `Aucune nouvelle note`, 3);
      }
    }
  }
}

watchForNote();
setInterval(() => {
  watchForNote();
  watchForNote(config.DATA_URL2);
}, config.REFRESH_INTERVAL);

const app = express();

app.use(bodyParser.json());

app.get('/update', (req, res) => {
  try {
    watchForNote(config.DATA_URL, true);
  } catch (error) {
    console.error(error);
    sendDiscordMessage([], `Erreur lors de la mise à jour manuelle : ${error}`, 3);
  }
  console.log('Received Webhook:', req.body);
  res.status(200).send('OK');
});

const PORT = process.env.PORT || config.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Webhook receiver listening on port ${PORT}`);
});