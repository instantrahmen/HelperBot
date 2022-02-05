import { Client } from 'discord.js';
import config from './config';
import { generateSlashCommands } from './commands';
import { deployCommandsAllGuilds } from './commands/helpers/deploy-commands';

import FynniEmotionsController from './state/emotions-state';

process.on('uncaughtException', function (err) {
  console.log(err);
});

export const initializeBot = () => {
  // Create a new client instance
  const client = new Client({
    intents: config.intents,
  });

  generateSlashCommands(client);

  client.once('ready', async () => {
    // Deploy commands every time server starts up
    console.log('Deploying commands...');
    await deployCommandsAllGuilds();
    console.log('deployed commands');

    console.log('Ready.');
  });

  const FynniController = new FynniEmotionsController(client);

  client.on('messageCreate', (message) => {
    FynniController.handleMentions(message);
  });

  // Login to Discord with token
  client.login(config.botToken);

  return client;
};
