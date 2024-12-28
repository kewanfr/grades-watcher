import fetch from 'node-fetch';    
import FormData from 'form-data'; 

import config from '../config.js'; 

export async function sendDiscordFile(imageBuffer, channel = 1, filename = 'notes-histogram.png') {
  try {
    const WEBHOOK_URL = config.discord.webhookURL[channel]; 

    const form = new FormData();
    form.append('file', imageBuffer, filename);

    const payload = {
      username: 'Notes IUT',
      avatar_url: config.discord.avatarURL,
      embeds: [
        {
          title: 'Répartition des notes',
          image: {
            url: `attachment://${filename}`,
          },
        },
      ],
    };

    form.append('payload_json', JSON.stringify(payload));

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Echec webhook Discord: ${response.status} - ${errText}`);
    }

    console.log('Message + fichier envoyés à Discord avec succès !');
  } catch (error) {
    console.error('Erreur envoi Discord :', error);
  }
}
