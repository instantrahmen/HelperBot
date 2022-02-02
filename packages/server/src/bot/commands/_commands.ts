import { registerCommands, getCommands } from './helpers/_commandState';
import config from '../config';
import { jsonBlock } from './helpers';

import hug from './hug';
import { initializeMusicCommands } from './music';

const musicCommands = initializeMusicCommands();

registerCommands([
  // {
  //   name: 'status',
  //   description: 'Current bot status',
  //   do: async (interaction) => {
  //     await interaction.reply(`Hi! My current status is: ${config.status}`);
  //   },
  // },
  // {
  //   name: 'user',
  //   description: 'User Info',
  //   do: async (interaction) => {
  //     await interaction.reply(
  //       `Info for ${interaction.user.toString()}${jsonBlock({
  //         user: interaction.user,
  //       })}`
  //     );
  //   },
  // },
  // {
  //   name: 'inspect',
  //   description: 'Inspect anything',
  //   do: async (interaction) => {
  //     const replyText = jsonBlock(interaction.toJSON());
  //     await interaction.reply(replyText);
  //   },
  // },
  // {
  //   name: 'debug',
  //   description: 'debug',
  //   do: async (interaction) => {
  //     const replyText = jsonBlock(interaction.toJSON());
  //     await interaction.reply(replyText);
  //   },
  // },
  // {
  //   name: 'server',
  //   description: 'Server Info',
  //   do: async (interaction) => {
  //     const text = `Current Server: ${interaction.guild?.name}`;
  //     await interaction.reply(text);
  //   },
  // },

  // This is going to be a single 'music' command with multiple subcommands later on, but for now I'll do separate commands by spreading it
  ...musicCommands,
  // hug,
]);

const commands = getCommands();
console.log({ commands });

export default commands;
