import { createCommand, OptionType } from '../helpers/_commandState';
import {
  getVoiceConnection,
  VoiceConnectionStatus,
  joinVoiceChannel,
  JoinVoiceChannelOptions,
  CreateVoiceConnectionOptions,
} from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';

type VCOptions = JoinVoiceChannelOptions & CreateVoiceConnectionOptions;

import { onConnect } from './index';

export default createCommand({
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
    const { voiceAdapterCreator: adapterCreator } = guild;

    if (channel.type !== 'GUILD_VOICE')
      return await interaction.reply({
        content: `Unable to join ${channel.toString()} because it isn't a voice channel!`,
      });

    await interaction.reply({
      content: `Joining channel ${channel.toString()}! \n \`\`\`json${JSON.stringify(
        channel,
        null,
        2
      )}}\`\`\``,
    });

    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    // setTimeout(() => {
    //   console.log('voice channel connected');

    //   onConnect(interaction, connection);
    // }, 2000);

    connection.on('stateChange', (oldState, newState) => {
      console.log(
        `Connection transitioned from ${oldState.status} to ${newState.status}`
      );
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('voice channel connected');

      onConnect(interaction, connection);
    });
    connection.on(VoiceConnectionStatus.Signalling, () => {
      console.log('voice channel connected');

      onConnect(interaction, connection);
    });
  },
});
