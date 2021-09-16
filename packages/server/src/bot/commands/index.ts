import { Client } from 'discord.js';

import './_commands';

import { getIndexedCommands } from './helpers/_commandState';

export const generateSlashCommands = (client: Client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    getIndexedCommands()[commandName] &&
      getIndexedCommands()[commandName].do(interaction);
  });
};
