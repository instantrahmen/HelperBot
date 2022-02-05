import { createCommand, OptionType } from '../state/_commandState';

export default createCommand({
  name: 'hug',
  description: 'Current bot status',
  options: [
    {
      type: OptionType.USER,
      name: 'target',
      description: 'Who are you hugging?',
      required: true,
    },
  ],
  do: async (interaction) => {
    const target = interaction.options.get('target')?.value?.toString();

    const hugGif = `https://c.tenor.com/ItpTQW2UKPYAAAAM/cuddle-hug.gif`;

    await interaction.reply({
      content: `${interaction.user.toString()} gives <@${target}> a hug!`,
      files: [hugGif],
    });
  },
});
