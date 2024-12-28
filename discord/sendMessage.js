import config from "../config.js";

export default function sendDiscordMessage(embeds, content = null, channel = 1, components = null) {
    var params = {
        username: "Notes IUT",
        avatar_url: config.discord.avatarURL,
    }
    if (content){
        params.content = content;
    }
    if (embeds) {
        params.embeds = embeds
    }

    if (components) {
        params.components = components
    }

    fetch(config.discord.webhookURL[channel], {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(async res => {
        if (!res.ok) {
            const errText = await response.text().catch(() => '');
            throw new Error(`Echec webhook Discord: ${response.status} - ${errText}`);
        }
        console.log("Message envoyé");
    })
}