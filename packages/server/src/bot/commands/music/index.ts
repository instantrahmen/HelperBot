import { VoiceConnection } from '@discordjs/voice';
import { CommandInteraction, Interaction } from 'discord.js';
import { createAudioResource, createAudioPlayer } from '@discordjs/voice';
import { createCommand } from '../../state/_commandState';

import config from '../../config';
import join from './join';
import play from './play';
import { getMusicPlayer, initializeMusicPlayers } from './music-player';
import { OptionType } from '../../types';
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
        // interaction.reply(`Skipped to track ${mp.nowPlaying}`);
        interaction.reply({
          content: `Skipped to track ${mp.nowPlaying + 1}`,
          embeds: [mp.createCurrentSongEmbed()],
        });
      },
    }),

    createCommand({
      name: 'skipto',
      description: 'Skip to specific track',
      options: [
        {
          type: OptionType.INTEGER,
          name: 'track',
          description: 'Track # you want to play',
          required: true,
        },
      ],
      do: async (interaction: CommandInteraction) => {
        const track = interaction.options.getInteger('track', true);
        const mp = getMusicPlayer(interaction.guildId!);
        mp.gotoSong(track - 1);
        // interaction.reply(`Skipped to track ${mp.nowPlaying}`);
        interaction.reply({
          content: `Skipped to track ${mp.nowPlaying + 1}`,
          embeds: [mp.createCurrentSongEmbed()],
        });
      },
    }),

    // prev
    createCommand({
      name: 'prev',
      description: 'Go back to previous track',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.prevSong();

        // interaction.reply(`Playing previous song (track ${mp.nowPlaying})`);
        interaction.reply({
          content: `Playing previous song (track ${mp.nowPlaying})`,
          embeds: [mp.createCurrentSongEmbed()],
        });
      },
    }),

    // replay
    createCommand({
      name: 'replay',
      description: 'Replay this track',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        // mp.prevSong();
        // mp.nextSong();

        mp.autoplayDisabled = true;

        mp.stop();
        setTimeout(() => {
          mp.play();
          mp.autoplayDisabled = false;
        }, 100);
        interaction.reply(`Playing this song again`);
      },
    }),

    // queue
    createCommand({
      name: 'queue',
      description: 'List the items in queue',
      options: [
        {
          type: OptionType.BOOLEAN,
          name: 'includeplayed',
          description: 'Include already played songs in the queue list?',
          required: false,
        },
      ],
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        const includePlayed =
          interaction.options.getBoolean('includeplayed', false) || false;

        const embed1 = mp.createCurrentSongEmbed();

        const embed2 = mp.createQueueEmbed(includePlayed);

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
