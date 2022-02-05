import { getMusicPlayer, MusicPlayer } from './music-player';
import { createCommand } from '../../state/command-state';
import { CommandInteraction } from 'discord.js';
import { OptionType } from '../../types';

export default () => {
  return createCommand({
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
      const guildId = interaction.guildId!;

      const musicPlayer = getMusicPlayer(guildId);

      try {
        if (url.includes('list')) {
          addPlaylist(url, interaction, musicPlayer);
        } else {
          addSong(url, interaction, musicPlayer);
        }
      } catch (e: any) {
        interaction.editReply(`Failed to add song. \n \`${e.message}\``);
      }
    },
  });
};

const addSong = async (
  url: string,
  interaction: CommandInteraction,
  musicPlayer: MusicPlayer
) => {
  await interaction.reply(`Loading song info...`);
  const songIndex = await musicPlayer.add(url, interaction.user);

  interaction.editReply(
    `Added **${musicPlayer.queue[songIndex].title}** to my queue at position ${
      songIndex + 1
    }`
  );
};

const addPlaylist = async (
  url: string,
  interaction: CommandInteraction,
  musicPlayer: MusicPlayer
) => {
  await interaction.reply(`Loading song info...`);
  await musicPlayer.addPlaylist(url, interaction.user);

  interaction.editReply(`Added the playlist to my queue!`);
};
