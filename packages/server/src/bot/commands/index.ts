import { Client } from 'discord.js';

import commandState from '../components/Commands';
import { registerAllCommands } from './register-commands';

let called = 0;
export const generateSlashCommands = (client: Client) => {
  called++;
  console.log(`=== generateSlashCommands() called ${called} times ===`);
  registerAllCommands();

  client.on('interactionCreate', async (interaction) => {
    // console.log({ interaction });
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    commandState.getCommand(commandName).run(interaction);
  });
};
