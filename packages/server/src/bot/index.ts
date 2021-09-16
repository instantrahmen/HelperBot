import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { Client, Intents } from 'discord.js';
import config from './config';
import { generateSlashCommands } from './commands';
import { deployCommandsAllGuilds } from './commands/helpers/_deployCommands';

export const initializeBot = () => {
  // Create a new client instance
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });

  generateSlashCommands(client);

  // When the client is ready, run this code (only once)
  client.once('ready', async () => {
    console.log('Deploying commands...');

    await deployCommandsAllGuilds();
    console.log('deployed commands');

    console.log('Ready.');
  });

  // Login to Discord with your client's token
  client.login(config.botToken);

  return client;
};
