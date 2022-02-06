import { Client } from 'discord.js';

import { generateSlashCommands } from './commands';
import config from './config';
import FynniEmotionsController from './state/emotions-state';
import commandState from './components/Commands';

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
    await commandState.deployAll();
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
