import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, startCronJob } from './utils.js';
import { getProblemOfTheDay } from './problemOfTheDay.js';
import { publishLcDailyChallenge} from './publishLcData.js'


// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    console.log(`Incoming request for ${name} command`)
    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }
    else if (name === "get-problem-of-day") {
      console.log("LC getter started")
      // Send a message into the channel where command was triggered from
      var lcProblemResponse = {data: {activeDailyCodingChallengeQuestion: {link: ""}}}
      await getProblemOfTheDay()
      .then(response => {lcProblemResponse = response; console.log(response)})
      .catch(error => console.error(error));
      lcProblemResponse = JSON.parse(lcProblemResponse)
      console.log(typeof(lcProblemResponse))
      console.log(`Got ${lcProblemResponse["data"]}`)
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches today's LC problem of the day
          content:"Problem of the day is: " + "https://leetcode.com" + lcProblemResponse["data"]["activeDailyCodingChallengeQuestion"]["link"]
        },
      }); 
    }
  }
});

publishLcDailyChallenge()
startCronJob(publishLcDailyChallenge)

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
