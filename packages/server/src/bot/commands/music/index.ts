import { VoiceConnection } from '@discordjs/voice';
import { CommandInteraction, Interaction } from 'discord.js';
import { createAudioResource, createAudioPlayer } from '@discordjs/voice';
import { createCommand, OptionType } from '../helpers/_commandState';

import config from '../../config';
import join from './join';
import play from './play';
import { getMusicPlayer, initializeMusicPlayers } from './music-player';
// import { format } from 'path/posix';

// const { guilds } = config;

export const initializeMusicCommands = () => {
  initializeMusicPlayers();

  return [
    join(),
    play(),
    // pause
    createCommand({
      name: 'pause',
      description: 'Pause music',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.pause();

        interaction.reply(
          `The music has been paused, but please hurry I'm getting impatient!`
        );
      },
    }),

    // unpause
    createCommand({
      name: 'unpause',
      description: 'Unpause music',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.unpause();

        interaction.reply(`You ready again? Let's gooooo~`);
      },
    }),

    // playerstatus
    createCommand({
      name: 'playerstatus',
      description: 'Get music player status',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        // interaction.reply(`\`\`\`json ${mp.toString()}\`\`\``);
        interaction.reply(
          `Current status: ${mp.getPlayerStatus()} \n Song: ${
            mp.getCurrentSong().title
          }`
        );
      },
    }),

    // skip
    createCommand({
      name: 'skip',
      description: 'Skip to next track',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.nextSong();

        interaction.reply(`Skipped song`);
      },
    }),

    // prev
    createCommand({
      name: 'prev',
      description: 'Go back to previous track',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.prevSong();

        interaction.reply(`Playing previous song`);
      },
    }),

    // replay
    createCommand({
      name: 'replay',
      description: 'Replay this track',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.prevSong();
        mp.nextSong();
        interaction.reply(`Playing this song again`);
      },
    }),

    // queue
    createCommand({
      name: 'queue',
      description: 'List the items in queue',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        const formatted = mp.queue
          .map((item, index) => {
            if (index === mp.nowPlaying) {
              return `**\\> [${index + 1}] - ${item.title}** [now playing]`;
            }
            return `[${index + 1}] - ${item.title}`;
          })
          .join('\n');

        const embed1 = mp.createCurrentSongEmbed();

        const embed2 = mp.createQueueEmbed();
        // interaction.reply(`**SONG QUEUE**: \n ${formatted} `);
        interaction.reply({
          embeds: [embed1, embed2],
        });
      },
    }),

    // clearqueue
    createCommand({
      name: 'clearqueue',
      description: 'List the items in queue',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);

        mp.clearQueue();

        interaction.reply('Queue Cleared');
      },
    }),
  ];
};

export const player = createAudioPlayer();

// Runs whenever Fynni connects to a VC
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
};
