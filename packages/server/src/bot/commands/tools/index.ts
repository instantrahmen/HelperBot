import { CommandInteraction } from 'discord.js';
import { times } from 'lodash';
import commandState from '../../components/Commands';
import { createDiceEmbed, rollDice } from '../../components/Dice';
import { OptionType } from '../../types';
import { jsonBlock, timeout } from '../../utils';

export const initializeToolCommands = () => {
  const { createCommand } = commandState;

  return [
    createCommand({
      name: 'roll',
      description: 'Roll some dice',
      forceAvailable: false,
      options: [
        {
          type: OptionType.INTEGER,
          name: 'amount',
          description: 'How many dice do you want me to roll? (default: 1)',
          required: false,
          min_value: 1,
        },
        {
          type: OptionType.INTEGER,
          name: 'sides',
          description: 'How many sides should the dice have? (default: 6)',
          required: false,
          min_value: 2,
        },
      ],
      do: async (interaction) => {
        const amount = interaction.options.getInteger('amount', false) || 1;
        const sides = interaction.options.getInteger('sides', false) || 6;

        await animateReply('Rolling', interaction);
        const results = rollDice(sides, amount);
        await interaction.editReply({
          content: `${interaction.user.toString()} rolled \`${amount}\` \`D${sides}\``,
          embeds: [createDiceEmbed(sides, amount, results)],
        });
      },
    }),

    createCommand({
      name: 'coinflip',
      description: 'Flip a coin',
      forceAvailable: false,
      options: [],
      do: async (interaction) => {
        await animateReply('Flipping coin', interaction);
        const rolls = rollDice(2, 1);
        const result = rolls.sum === 1 ? 'heads' : 'tails';
        await interaction.editReply({
          content: `> Looks like it landed on *${result}*!`,
        });
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
    await timeout(800);
  }
  Promise.resolve();
};
