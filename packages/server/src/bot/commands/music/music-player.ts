import { User, VoiceChannel } from 'discord.js';
import youtubedl from 'youtube-dl-exec';
import {
  AudioPlayer,
  createAudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  getVoiceConnection,
  VoiceConnection,
  VoiceConnectionStatus,
  joinVoiceChannel,
  entersState,
} from '@discordjs/voice';

import ytdl from 'ytdl-core-discord';

type QueueItem = {
  title: string;
  resource?: any; // Optional for, we'll probably end up grabbing the resource at the last minute when played
  user: User;
  url: string;
};

type url = string;

type GuildQueue = QueueItem[];

type PlayersByGuild = { [guildId: string]: MusicPlayer };

export const allPlayers: PlayersByGuild = {};

class MusicPlayer {
  private queue: GuildQueue = [];

  guildId: string;
  nowPlaying: number = 0;
  player: AudioPlayer = createAudioPlayer();

  constructor(guildId: string) {
    this.guildId = guildId;

    if (!allPlayers[guildId])
      console.warn(
        'Two music players created for the same guild. This is likely in error. Replacing old one with new one'
      );
    allPlayers[guildId] = this;

    this.registerPlayerEventHandlers();
  }

  private registerPlayerEventHandlers() {
    this.player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');
    });
  }

  private registerConnectionEventHandlers() {
    const connection = this.getConnection()!;

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(
        'The connection has entered the Ready state - ready to play audio!'
      );
    });

    // handle disconnects
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
        // Seems to be reconnecting to a new channel - ignore disconnect
      } catch (error) {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        connection.destroy();
      }
    });

    // Handle any state change
    connection.on('stateChange', (oldState, newState) => {
      console.log(
        `Connection transitioned from ${oldState.status} to ${newState.status}`
      );
    });
  }

  // Control Methods

  // Play current song
  async play() {
    if (!this.canPlay()) return;

    const song = this.getCurrentSong();

    try {
      // this.player.play(stream!);
      // Get player resource and play it
      const resource = createAudioResource(await ytdl(song.url));
      this.player.play(resource);
    } catch (e: any) {
      throw new Error(`Unable to play song: ${e.message}`);
    }
  }

  pause() {
    return this.player.pause();
  }

  unpause() {
    return this.player.unpause();
  }

  stop() {
    return this.player.stop();
  }

  nextSong() {
    this.stop();
    this.nowPlaying = this.nowPlaying + 1;
    this.play();
  }

  prevSong() {
    this.nowPlaying = this.nowPlaying - 1;
    this.play();
  }

  async connectToChannel(channel: VoiceChannel) {
    const { id: channelId, guild, guildId } = channel;

    try {
      if (channel.type !== 'GUILD_VOICE') throw new Error('INVALID_CHANNEL');

      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      this.registerConnectionEventHandlers();
      return connection;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  // Add a song to queue
  async add(song: QueueItem | url, user: User): Promise<number> {
    if (typeof song === 'string') {
      this.queue = [...this.queue, await this.getYTVideo(song, user)];
    } else {
      this.queue = [...this.queue, song];
    }
    return this.queue.length - 1;
  }

  // Remove a song from queue
  remove(index: number) {
    this.queue = this.removeElementFromArray(this.queue, index);
  }

  // Helper Methods

  async getYTVideo(url: url, user: User): Promise<QueueItem> {
    try {
      const title = await youtubedl(url, {
        skipDownload: true,
        getTitle: true,
      });

      return {
        title: title as unknown as string,
        user,
        url,
      };
    } catch (e: any) {
      console.warn(e.message);
      return { title: `error: ${e.message}`, user, url };
    }
  }

  // public on = this.player && this.player.on;

  removeElementFromArray(items: Array<any>, index: number) {
    return [...items.slice(0, index), ...items.slice(index + 1)];
  }

  getCurrentSong = () => this.queue[this.nowPlaying];
  getConnection = (): VoiceConnection | undefined =>
    getVoiceConnection(this.guildId);

  getPlayer = () => this.player;

  // Idle - the initial state of an audio player. The audio player will be in this state when there is no audio resource for it to play.
  // Bufferring - the state an audio player will be in while it is waiting for an audio resource to become playable. The audio player may transition from this state to either the Playing state (success) or the Idle state (failure).
  // Playing - the state a voice connection enters when it is actively playing an audio resource. When the audio resource comes to an end, the audio player will transition to the Idle state.
  // AutoPaused - the state a voice connection will enter when the player has paused itself because there are no active voice connections to play to. This is only possible with the noSubscriber behavior set to Pause. It will automatically transition back to Playing once at least one connection becomes available again.
  // Paused - the state a voice connection enters when it is paused by the user.
  getPlayerStatus = () => this.player.state.status;

  canPlay = () => {
    const connection = this.getConnection();

    return (
      connection && connection.state.status === VoiceConnectionStatus.Ready
    );
  };
}
