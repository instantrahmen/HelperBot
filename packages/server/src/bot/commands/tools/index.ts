import { CommandInteraction } from 'discord.js';
import { times } from 'lodash';
import commandState from '../../components/Commands';
import { timeout } from '../../utils';

export const initializeDebugCommands = () => {
  const { createCommand } = commandState;

  return [
    createCommand({
      name: 'roll',
      description: 'Roll some dice',
      forceAvailable: true,
      defaultPermission: true,

      do: async (interaction) => {
        const guildId = interaction.guild!.id;

        await animateReply('Rolling dice', interaction);
      },
    }),
  ];
};

const animateReply = async (
  text: string,
  interaction: CommandInteraction,
  ticks = 4
) => {
  await interaction.reply(`${text}`);

  for (let currentTick = 1; currentTick < ticks; currentTick++) {
    let dots = times(currentTick, () => '·').join(' ');
    await interaction.editReply(`${text} ${dots}`);
    await timeout(500);
  }
  Promise.resolve();
};
