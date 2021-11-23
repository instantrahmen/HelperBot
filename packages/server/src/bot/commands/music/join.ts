import { createCommand, OptionType } from '../helpers/_commandState';
import {
  getVoiceConnection,
  VoiceConnectionStatus,
  joinVoiceChannel,
  JoinVoiceChannelOptions,
  CreateVoiceConnectionOptions,
} from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';

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

      if (channel.type !== 'GUILD_VOICE') {
        return await interaction.reply({
          content: `Can't do that, SCUM. ${channel.toString()} isn't even a voice channel!`,
        });
      }

      await interaction.reply({
        content: `I'll tryyyy to join ${channel.toString()}... no promises though.`,
      });

      try {
        await musicPlayer.connectToChannel(channel);

        interaction.editReply(
          `DJ Fynbot in the house~ (joined ${channel.toString()})~`
        );

        const gif = 'https://c.tenor.com/bOR-CXcBQ8QAAAAC/djaymano-dj.gif';

        await interaction.editReply({
          // content: `${interaction.user.toString()} gives <@${target}> a hug!`,
          content: `DJ Fynbot in the house~ (joined ${channel.toString()})~`,
          files: [gif],
        });
      } catch (e: any) {
        interaction.editReply(
          `Failed to join channel ${channel.toString()}! \n error: ${e.message}`
        );
      }
    },
  });
