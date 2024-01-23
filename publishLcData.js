import 'dotenv/config';
import pkg from 'discord.js';
import {getProblemOfTheDay} from './problemOfTheDay.js'
const { Client, IntentsBitField } = pkg;

export async function publishLcDailyChallenge() {
    const client = new Client({intents: 
        [
            IntentsBitField.Flags.Guilds, 
            IntentsBitField.Flags.GuildMessages
        ]
    });
    await client.login(process.env.DISCORD_TOKEN);
    console.log(`Logged in as ${client.user.tag}!`);
    const channel = client.channels.cache.get(process.env.LC_CHANNEL_ID); // Replace with your channel ID
    var lcProblemResponse = {data: {activeDailyCodingChallengeQuestion: {link: ""}}}
    await getProblemOfTheDay()
    .then(response => {lcProblemResponse = response; console.log(response)})
    .catch(error => console.error(error));
    lcProblemResponse = JSON.parse(lcProblemResponse)
    if(channel) {
        const userId = "134893238929719296"
        const content = `Howdy, <@${userId}> problem of the day is: https://leetcode.com${lcProblemResponse["data"]["activeDailyCodingChallengeQuestion"]["link"]}`
        channel.send(content);
    }
}

await publishLcDailyChallenge()