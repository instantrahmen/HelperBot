import { ChatInputCommandInteraction, Client } from 'discord.js';

import commandState from '../components/Commands';
import { registerAllCommands } from './register-commands';

export const generateSlashCommands = (client: Client) => {
  registerAllCommands();

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    try {
      commandState.getCommand(commandName).run(interaction);
    } catch (error) {
      // Command probably doesn't exist. We'll warn and continue, it's probably handled in the web-panel server.
      // We'll likely eventually make it so all commands are handled in one place.
      console.warn(error);
    }
  });
};
