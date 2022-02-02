import { registerCommands, getCommands } from './helpers/_commandState';
import config from '../config';
import { jsonBlock } from './helpers';

import hug from './hug';
import { initializeMusicCommands } from './music';

const musicCommands = initializeMusicCommands();

registerCommands([
  {
    name: 'inspect',
    description: 'Inspect anything',
    do: async (interaction) => {
      const replyText = jsonBlock(interaction.toJSON());
      await interaction.reply(replyText);
    },
  },

  // This is going to be a single 'music' command with multiple subcommands later on, but for now I'll do separate commands by spreading it
  ...musicCommands,
  // hug,
]);

const commands = getCommands();
console.log({ commands });

export default commands;
