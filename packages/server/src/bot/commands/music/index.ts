import { VoiceConnection } from '@discordjs/voice';
import { CommandInteraction } from 'discord.js';
import { createAudioPlayer } from '@discordjs/voice';

import join from './join';
import play from './play';
import { createCommand } from '../../state/command-state';

import { MusicPlayer, initializeMP } from '../../components/MusicPLayer';

import { OptionType } from '../../types';
import { jsonBlock } from '../../utils';

export const initializeMusicCommands = () => {
  // initializeMusicPlayers();
  // MusicPlayer.createComponentsForAllGuilds();
  const mpState = initializeMP();

  return [
    join(),
    play(),
    // pause
    createCommand({
      name: 'pause',
      description: 'Pause music',
      do: async (interaction: CommandInteraction) => {
        // const mp = getMusicPlayer(interaction.guildId!);
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

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
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

        mp.unpause();

        interaction.reply(`You ready again? Let's gooooo~`);
      },
    }),

    // playerstatus
    createCommand({
      name: 'playerstatus',
      description: 'Get music player status',
      do: async (interaction: CommandInteraction) => {
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

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
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

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
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

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
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

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
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

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
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

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
      name: 'clear-queue',
      description: 'List the items in queue',
      do: async (interaction: CommandInteraction) => {
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
        await mp.validateConnection(interaction);

        mp.clearQueue();

        interaction.reply('Queue Cleared');
      },
    }),

    // connection status
    createCommand({
      name: 'connection-status',
      description: 'List the items in queue',
      debugOnly: true,
      do: async (interaction: CommandInteraction) => {
        const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;

        const connectionState = mp.getConnectionState();

        // mp.clearQueue();

        interaction.reply(jsonBlock(connectionState));
      },
    }),
  ];
};
