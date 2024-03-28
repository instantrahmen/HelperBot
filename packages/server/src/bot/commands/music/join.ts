import { ChannelType, VoiceChannel } from 'discord.js';
import { OptionType } from '../../types';

import { mpState, MusicPlayer } from '../../components/MusicPlayer';
import commandState from '../../components/Commands';

export default () => {
  const { createCommand } = commandState;

  return createCommand({
    name: 'join',
    description: 'Join a channel',
    options: [
      {
        type: OptionType.CHANNEL,
        name: 'channel',
        description: 'Which channel should I join?',
        required: true,
        channel_types: [ChannelType.GuildVoice],
      },
    ],
    do: async (interaction) => {
      // const target = interaction.options.get('target')?.value?.toString();
      const channel = interaction.options.getChannel(
        'channel',
        true
      ) as VoiceChannel;

      const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;

      await interaction.reply({
        content: `I'll tryyyy to join ${channel.toString()}... no promises though.`,
      });

      try {
        await mp.connectToChannel(channel);

        await interaction.editReply({
          content: `Joined ${channel.toString()}`,
          // files: [gif],
        });
      } catch (e: any) {
        const replyText = `Darn coudn't join ${channel.toString()}! \n ${
          e.message
        }`;

        if (interaction.replied) {
          interaction.editReply(replyText);
        } else {
          await interaction.reply({
            content: replyText,
          });
        }
      }
    },
  });
};
