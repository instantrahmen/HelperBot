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

    createCommand({
      name: 'unpause',
      description: 'Unpause music',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.unpause();

        interaction.reply(`You ready again? Let's gooooo~`);
      },
    }),

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

    createCommand({
      name: 'skip',
      description: 'Skip to next track',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.nextSong();

        interaction.reply(`Skipped song`);
      },
    }),

    createCommand({
      name: 'prev',
      description: 'Go back to previous track',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);
        mp.prevSong();

        interaction.reply(`Playing previous song`);
      },
    }),

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

        interaction.reply(`**SONG QUEUE**: \n ${formatted} `);
      },
    }),

    createCommand({
      name: 'clearqueue',
      description: 'List the items in queue',
      do: async (interaction: CommandInteraction) => {
        const mp = getMusicPlayer(interaction.guildId!);

        mp.clearQueue();

        interaction.reply('Queue Cleared');
      },
    }),

    //     // intro
    //     createCommand({
    //       name: 'intro',
    //       description: 'Let me introduce myself~',
    //       do: async (interaction: CommandInteraction) => {
    //         const intro = /*md*/ `
    // Hi there, let me introduce myself~!
    // **Name:** Obviously my name is Fynbot dummy!
    // **Birthday:** TBA (not live yet, still in development)
    // **Gender:** I'm a bot, but use she/her pronouns!
    // **Sexuality:** Asexual bc I'm a robot!
    // **Looking for:** I'm just here cuz I wanna be! Not to help everyone or anything like that...
    // **Setup:** Mostly typescript
    // **Games:** I'm a bot, dummy~
    // **Dm policy:** Try all you want, I won't respond~
    // **Other Info:** Created by Aria and I can do all sorts of cool things like music and... well just music for now but more in the future!
    // `;
    //         interaction.reply({
    //           content: intro,

    //           files: [
    //             'https://media.discordapp.net/attachments/862794834800410657/888465266302910464/Fynbot_Smug.png',
    //           ],
    //         });
    //       },
    //     }),
  ];
};

export const player = createAudioPlayer();

// Most below here should be removed later when no longer needed

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
