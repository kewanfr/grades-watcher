import config from "../config.js";

export default function sendDiscordMessage(embeds, content = null, channel = 1) {
    var params = {
        username: "Notes IUT",
        avatar_url: config.discord.avatarURL,
        // content: "Some message you want to send",
        // embeds: [
        //     {
        //         "title": "Some title",
        //         "color": 15258703,
        //         "thumbnail": {
        //             "url": "",
        //         },
        //         "fields": [
        //             {
        //                 "name": "Your fields here",
        //                 "value": "Whatever you wish to send",
        //                 "inline": true
        //             }
        //         ]
        //     }
        // ],
    }
    if (content){
        params.content = content;
    }
    if (embeds) {
        params.embeds = embeds
    }

    // console.log(params)

    fetch(config.discord.webhookURL[channel], {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res => {
        console.log(res);
    })
}