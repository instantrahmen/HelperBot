import { VoiceConnection } from '@discordjs/voice';
import { CommandInteraction, Interaction } from 'discord.js';
import { createAudioResource, createAudioPlayer } from '@discordjs/voice';
import config from '../../config';
import join from './join';
import play from './play';

export const player = createAudioPlayer();

const { guilds } = config;

player.on('stateChange', (oldState, newState) => {
  console.log(
    `Audio player transitioned from ${oldState.status} to ${newState.status}`
  );
});

// Runs whenever the bot connects to a discord server
export const onConnect = (
  interaction: CommandInteraction,
  connection: VoiceConnection
) => {
  console.log('onConnect', { interaction, connection });
  connection.subscribe(player);
  interaction.editReply(`subscribed to player`);
};

export const onDisconnect = (
  interaction: CommandInteraction,
  connection: VoiceConnection
) => {
  console.log('onDisconnect', { interaction, connection });
  // connection.
};

export default [
  join,
  play,
  {
    name: 'pause',
    description: 'Pause audio',
    do: async (interaction: CommandInteraction) => {
      player.pause();

      interaction.reply(`paused: ${player.state.status}`);
    },
  },
  {
    name: 'unpause',
    description: 'Unpause audio',
    do: async (interaction: CommandInteraction) => {
      player.unpause();

      interaction.reply(`unpaused: ${player.state.status}`);
    },
  },
  {
    name: 'status',
    description: 'Get audio player status',
    do: async (interaction: CommandInteraction) => {
      interaction.reply(`status: ${player.state.status}`);
    },
  },
];
