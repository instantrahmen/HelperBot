import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { Client, Intents } from 'discord.js';
import config from './config';
import { generateSlashCommands } from './commands';
import { deployCommandsAllGuilds } from './commands/helpers/_deployCommands';

import { indexArrayByKey } from './commands/helpers';
import FynbotGlobalController from './utils/fynbot-controller';
import { log } from './utils/log';

process.on('uncaughtException', function (err) {
  console.log(err);
});

export const initializeBot = () => {
  // Create a new client instance
  const client = new Client({
    intents: config.intents,
  });

  generateSlashCommands(client);

  // When the client is ready, run this code (only once)
  client.once('ready', async () => {
    console.log('Deploying commands...');

    await deployCommandsAllGuilds();
    console.log('deployed commands');

    console.log('Ready.');
    // console.log({ config });
  });

  // Handle messages other than slash commands

  // const responseControllers = indexArrayByKey(
  //   config.guilds.map((guildId) => ({
  //     guildId,
  //     controller: new EmotionController(guildId),
  //   })),
  //   'guildId'
  // );
  // const FynbotResponder = new EmotionController();
  const FynbotController = new FynbotGlobalController(client);

  client.on('messageCreate', (message) => {
    // const guildId = message.guildId;
    const lowerCaseMsg = message.content.toLocaleLowerCase();
    // log({
    //   message: {
    //     content: message.content,
    //     author: message.author.username,
    //     lowerCaseMsg,
    //     message,
    //   },
    // });

    FynbotController.handleMentions(message);
  });

  // Login to Discord with token
  client.login(config.botToken);

  return client;
};
