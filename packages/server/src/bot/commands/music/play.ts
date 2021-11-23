import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';

import { getMusicPlayer } from './music-player';
import { createCommand, OptionType } from '../helpers/_commandState';
import { jsonBlock } from '../helpers';

export default () =>
  createCommand({
    name: 'play',
    description: 'Add a song to the queue',
    options: [
      {
        type: OptionType.STRING,
        name: 'url',
        description: 'Youtube URL to song you want to play',
        required: true,
      },
    ],
    do: async (interaction) => {
      const url = interaction.options.getString('url', true);
      const user = interaction.user;
      const guildId = interaction.guildId!;

      const musicPlayer = getMusicPlayer(guildId);

      try {
        await interaction.reply(`Loading song info...`);
        const songIndex = await musicPlayer.add(url, user);

        interaction.editReply(
          `Added ${
            musicPlayer.queue[songIndex].title
          } to queue! Added at position ${songIndex + 1}`
        );
      } catch (e: any) {
        interaction.editReply(
          `Error adding song to queue! \n Error: ${e.message}`
        );
      }
    },
  });

// try {
//   console.log(connection?.state.status);
//   if (
//     status !== VoiceConnectionStatus.Ready &&
//     status !== VoiceConnectionStatus.Signalling
//   )
//     throw new Error('Not connected');
// } catch (e) {
//   return await interaction.reply(
//     `***Error***: Must be in a voice channel to play a song: ${status} `
//   );

// getVideo(url).then(({ title, stream }) => {
//   // interaction.channel?.send(`got video: ${title}`);
//   try {
//     player.play(stream!);
//     interaction.editReply(`Playing song
//     ${jsonBlock({
//       url,
//       title,
//       player: player.state.status,
//     })}`);
//   } catch (e: any) {
//     interaction.editReply(`Failed to play song
//     ${jsonBlock({
//       url,
//       title,
//       error: e.message,
//     })}`);
//   }
// });

// await interaction.reply(`Getting video...
// ${jsonBlock({
//   url,
//   title: 'fetching...',
//   status,
// })}`);
