import { Client } from 'discord.js';

import './register-commands';

import { getIndexedCommands } from '../state/_commandState';

export const generateSlashCommands = (client: Client) => {
  client.on('interactionCreate', async (interaction) => {
    // console.log({ interaction });
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    getIndexedCommands()[commandName] &&
      getIndexedCommands()[commandName].do(interaction);
  });
};
