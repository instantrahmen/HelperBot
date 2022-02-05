import { VoiceChannel } from 'discord.js';
import { OptionType } from '../../types';

import { createCommand } from '../../state/_commandState';
import { getMusicPlayer } from './music-player';

export default () =>
  createCommand({
    name: 'join',
    description: 'Join a channel',
    options: [
      {
        type: OptionType.CHANNEL,
        name: 'channel',
        description: 'Which channel should I join?',
        required: true,
      },
    ],
    do: async (interaction) => {
      // const target = interaction.options.get('target')?.value?.toString();
      const channel = interaction.options.getChannel(
        'channel',
        true
      ) as VoiceChannel;

      const { id: channelId, guild, guildId } = channel;
      const musicPlayer = getMusicPlayer(guildId);

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
        await musicPlayer.connectToChannel(channel);

        interaction.editReply(
          `DJ Fynni in the house~ (joined ${channel.toString()})~`
        );

        const gif = 'https://c.tenor.com/bOR-CXcBQ8QAAAAC/djaymano-dj.gif';

        await interaction.editReply({
          // content: `${interaction.user.toString()} gives <@${target}> a hug!`,
          content: `DJ Fynni in the house~ (joined ${channel.toString()})~`,
          files: [gif],
        });
      } catch (e: any) {
        const replyText = `Failed to join channel ${channel.toString()}! \n ${
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
