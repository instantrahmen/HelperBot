import { Guild, User, VoiceChannel } from 'discord.js';
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

// ytpl for handling playlist links
import ytpl from 'ytpl';

import config from '../../config';
import { indexWithinArray } from '../helpers';

// Types and Enums
type QueueItem = {
  title: string;
  resource?: any; // Optional for, we'll probably end up grabbing the resource at the last minute when played
  user: User;
  url: string;
};

type url = string;

type GuildQueue = QueueItem[];

type PlayersByGuild = { [guildId: string]: MusicPlayer };

enum RepeatMethod {
  NONE,
  REPEAT_ONE,
  REPEAT_ALL,
}

const allPlayers: PlayersByGuild = {};

// MusicPlayer class to handle music and shit
export class MusicPlayer {
  queue: GuildQueue = [];

  guildId: string;
  nowPlaying: number = 0;
  private player: AudioPlayer = createAudioPlayer();
  repeatMethod: RepeatMethod = RepeatMethod.NONE;

  addingSong = false;

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

    this.player.on(AudioPlayerStatus.Idle, () => {
      console.log('The audio player has started playing!');
    });

    // Whenever song changes, play next song
    this.player.on('stateChange', (oldState, newState) => {
      console.log(
        `Audio player transitioned from ${oldState.status} to ${newState.status}`
      );
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        // Play next song
        this.nextSong();
      }
    });
  }

  private registerConnectionEventHandlers() {
    const connection = this.getConnection()!;

    connection.on(VoiceConnectionStatus.Ready, () => {
      connection.subscribe(this.getPlayer());
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

  toString() {
    const { guildId, nowPlaying, repeatMethod, queue } = this;
    return JSON.stringify(
      {
        guildId,
        nowPlaying,
        queue,
        repeatMethod,
        playerStatus: this.getPlayerStatus(),
      },
      null,
      2
    );
  }
  // #region Control Methods

  // Play current song
  async play() {
    if (!this.canPlay())
      return new Error(
        'I must be in a voice channel in order to play music, sorry! \n Please use the `/join` command to send me to a channel.'
      );

    if (this.getPlayerStatus() === AudioPlayerStatus.Paused) {
      return this.unpause();
    }

    const song = this.getCurrentSong();

    try {
      // Get player resource and play it
      const resource = createAudioResource(
        await ytdl(song.url, { highWaterMark: 1 << 25 })
      );
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
    console.log('Playing next song in queue');
    const nextSongIndex = this.nowPlaying + 1;
    this.stop();

    if (this.repeatMethod === RepeatMethod.REPEAT_ONE) {
      this.play();
      return true;
    }

    const finalSong = this.queue.length - 1;

    if (nextSongIndex > finalSong) {
      if (this.repeatMethod === RepeatMethod.NONE) {
        return false;
      } else if (this.repeatMethod === RepeatMethod.REPEAT_ALL) {
        this.nowPlaying = 0;
      }
    } else {
      this.nowPlaying = nextSongIndex;
    }

    this.play();
    return true;
  }

  prevSong() {
    const prevSongIndex = this.nowPlaying - 1;

    this.nowPlaying = prevSongIndex >= 0 ? prevSongIndex : 0;
    this.play();
  }

  gotoSong(index: number) {
    if (indexWithinArray(this.queue, index)) {
      this.nowPlaying = index;
      this.play();
    }
  }

  clearQueue() {
    this.stop();
    this.nowPlaying = 0;
    this.queue = [];
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

  checkIfYTLink(link: string) {
    const youtubeSubstrings = [
      'youtube',
      'youtu.be',
      'googlevideo.com',
      'gvt1.com',
      'video.google.com',
      'youtube.googleapis.com',
    ];

    for (let substr of youtubeSubstrings) {
      if (link.includes(substr)) {
        return true;
      }
    }
    return false;
  }

  createQueueItem(song: string, user: User) {
    if (song.includes('spotify')) {
      throw new Error('Spotify support coming soon!');
    }

    if (!song.includes('youtu') && !song.includes('googlevideo')) {
      throw new Error(`Not a youtube domain: ${song}`);
    }

    return this.getYTVideo(song, user);
  }

  // Add a song to queue
  async add(song: QueueItem | url, user: User): Promise<number> {
    const oldQueue = [...this.queue];
    try {
      if (typeof song === 'string') {
        this.queue = [...this.queue, { url: song, title: 'Loading...', user }];

        const position = this.queue.length - 1;

        const queueItem = await this.createQueueItem(song, user);

        if (!Array.isArray(queueItem)) {
          this.queue[position] = queueItem;
        } else {
          this.queue = [...this.queue, ...queueItem];
        }
      } else {
        this.queue = [...this.queue, song];
      }

      const status = this.getPlayerStatus();
      if (
        status === AudioPlayerStatus.Idle ||
        status === AudioPlayerStatus.Paused
      ) {
        this.play();
      }

      console.log({ oldQueue, current: this.queue });

      return this.queue.length - 1;
    } catch (e: any) {
      this.queue = oldQueue;
      throw new Error(e);
    }
  }

  async addPlaylist(playlistUrl: url, user: User) {
    // ytdl(playlistUrl, {});
    const playlistRes = await ytpl(playlistUrl, {});
    console.log({ playlistUrl, playlistRes });

    const songPromises = playlistRes.items.map(({ title, url }) =>
      this.add(
        {
          title,
          user,
          url,
        } as QueueItem,
        user
      )
    );

    console.log('Adding songs...');
    const songs = await Promise.all(songPromises);

    console.log({ songs });
  }
  // Remove a song from queue
  remove(index: number) {
    this.queue = this.removeElementFromArray(this.queue, index);
  }

  // #endregion

  // #region Helpers

  async getYTVideo(url: url, user: User): Promise<QueueItem | QueueItem[]> {
    console.log('getYTVideo', {
      url,
    });
    try {
      const title = await youtubedl(url, {
        skipDownload: true,
        getTitle: true,
      });
      console.log({ title });

      if ((title as unknown as string).split('\n').length > 1) {
        // It's a playlist
        const playlist = ytpl(url);
        console.log({ playlist });
        // return
      }
      // if (titl)
      return {
        title: title as unknown as string,
        user,
        url,
      };
    } catch (e: any) {
      console.warn(e.message);
      return { title: `${e.message}`, user, url };
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

  //#endregion
}

const createMusicPlayersForAllGuilds = () => {
  config.guilds.forEach((guildId) => {
    if (!allPlayers[guildId]) {
      new MusicPlayer(guildId);
    } else {
      console.log('guild already has music player');
    }
  });

  console.log({ allPlayers });
};

export const initializeMusicPlayers = () => {
  createMusicPlayersForAllGuilds();
};

export const getMusicPlayer = (guildId: string) => allPlayers[guildId];
