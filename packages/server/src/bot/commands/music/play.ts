import { CommandInteraction } from 'discord.js';
import { OptionType } from '../../types';
import { MusicPlayer, mpState } from '../../components/MusicPlayer';
import commandState from '../../components/Commands';

export default () => {
  const { createCommand } = commandState;

  return createCommand({
    name: 'play',
    description:
      'Add a song to the queue. Plays immediately if the queue is empty.',
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

      const mp = mpState.getComponent(interaction.guildId!) as MusicPlayer;
      await mp.validateConnection(interaction);

      try {
        if (url.includes('list')) {
          addPlaylist(url, interaction, mp);
        } else {
          addSong(url, interaction, mp);
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
  try {
    await interaction.reply(`Loading song info...`);
    const songIndex = await musicPlayer.add(url, interaction.user);

    interaction.editReply(
      `Added **${
        musicPlayer.queue[songIndex].title
      }** to my queue at position ${songIndex + 1}`
    );
  } catch (e: any) {
    interaction.editReply(`Failed to add song. \n \`${e.message}\``);
  }
};

const addPlaylist = async (
  url: string,
  interaction: CommandInteraction,
  musicPlayer: MusicPlayer
) => {
  try {
    await interaction.reply(`Loading song info...`);
    await musicPlayer.addPlaylist(url, interaction.user);

    interaction.editReply(`Added the playlist to my queue!`);
  } catch (e: any) {
    // throw new Error(e.message);
    interaction.editReply(`Failed to add playlist. \n \`${e.message}\``);
  }
};
