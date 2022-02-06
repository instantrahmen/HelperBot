import { Client } from 'discord.js';

import { registerAllCommands } from './register-commands';

import { getIndexedCommands } from '../state/command-state';

export const generateSlashCommands = (client: Client) => {
  const commands = registerAllCommands();

  client.on('interactionCreate', async (interaction) => {
    // console.log({ interaction });
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    getIndexedCommands()[commandName] &&
      getIndexedCommands()[commandName].do(interaction);
  });

  return commands;
};
