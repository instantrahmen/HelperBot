import { ChatInputCommandInteraction, Client } from 'discord.js';

import commandState from '../components/Commands';
import { registerAllCommands } from './register-commands';

export const generateSlashCommands = (client: Client) => {
  registerAllCommands();

  client.on('interactionCreate', async (interaction) => {
    // console.log({ interaction });
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    commandState.getCommand(commandName).run(interaction);
  });
};
