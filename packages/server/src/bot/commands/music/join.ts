import { VoiceChannel } from 'discord.js';
import { OptionType } from '../../types';

import { mpState, MusicPlayer } from '../../components/MusicPLayer';
import commandState from '../../components/Commands';
import { ChannelTypes } from 'discord.js/typings/enums';

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
        channel_types: [ChannelTypes.GUILD_VOICE],
      },
    ],
    do: async (interaction) => {
      // const target = interaction.options.get('target')?.value?.toString();
      const channel = interaction.options.getChannel(
        'channel',
        true
      ) as VoiceChannel;

      const { id: channelId, guild, guildId } = channel;
      const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;

      console.log('Fynni joining channel', {
        // channel,
      });

      if (channel.type !== 'GUILD_VOICE') {
        const errorResponse = `Can't do that, dummy! ${channel.toString()} isn't even a voice channel!`;

        await interaction.reply(errorResponse);
      }

      await interaction.reply({
        content: `I'll tryyyy to join ${channel.toString()}... no promises though.`,
      });

      try {
        await mp.connectToChannel(channel);

        const gif = 'https://c.tenor.com/bOR-CXcBQ8QAAAAC/djaymano-dj.gif';

        await interaction.editReply({
          content: `DJ Fynni in the house~ \n\n(joined ${channel.toString()})`,
          files: [gif],
        });
      } catch (e: any) {
        const replyText = `Darn coudn't join ${channel.toString()}! \n ${
          e.message
        }`;

        if (interaction.replied) {
          interaction.editReply(replyText);
        } else {
          return await interaction.reply({
            content: replyText,
          });
        }
      }
    },
  });
};
