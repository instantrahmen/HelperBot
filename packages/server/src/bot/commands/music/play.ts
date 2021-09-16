import { createCommand, OptionType } from '../helpers/_commandState';
import { jsonBlock } from '../helpers';
import youtubedl from 'youtube-dl-exec';
import {
  getVoiceConnection,
  VoiceConnectionStatus,
  createAudioResource,
} from '@discordjs/voice';
import ytdl from 'ytdl-core-discord';

import { player } from './index';

export default createCommand({
  name: 'play',
  description: 'Play a song',
  options: [
    {
      type: OptionType.STRING,
      name: 'url',
      description: 'Youtube URL to song you want to play',
      required: true,
    },
  ],
  do: async (interaction) => {
    const url = interaction.options.getString('url', false);
    const guildId = interaction.guildId!;
    const connection = getVoiceConnection(guildId);
    const status = connection?.state.status;

    try {
      console.log(connection?.state.status);
      if (
        status !== VoiceConnectionStatus.Ready &&
        status !== VoiceConnectionStatus.Signalling
      )
        throw new Error('Not connected');
    } catch (e) {
      return await interaction.reply(
        `***Error***: Must be in a voice channel to play a song: ${status} `
      );
    }

    if (!url) {
      // Play the already streaming video
      return await interaction.reply(`Not yet implemented, sorry~ `);
    }

    // let title;
    getVideo(url).then(({ title, stream }) => {
      // interaction.channel?.send(`got video: ${title}`);
      try {
        player.play(stream!);
        interaction.editReply(`Playing song
        ${jsonBlock({
          url,
          title,
          player: player.state.status,
        })}`);
      } catch (e: any) {
        interaction.editReply(`Failed to play song
        ${jsonBlock({
          url,
          title,
          error: e.message,
        })}`);
      }
    });

    await interaction.reply(`Getting video...
    ${jsonBlock({
      url,
      title: 'fetching...',
      status,
    })}`);
  },
});

const getVideo = async (url: string) => {
  try {
    // youtube-dl --skip-download --get-title --no-warnings $URL | sed 2d
    const title = youtubedl(url, {
      skipDownload: true,
      getTitle: true,
    });

    // youtube-dl -f 251 https://www.youtube.com/watch?v=CSKewNVWD0Y -o -
    // const video = await youtubedl(url, {});

    return { title: await title, stream: createAudioResource(await ytdl(url)) };
  } catch (e: any) {
    console.warn(e.message);
    return { title: `error: ${e.message}` };
  }
};
