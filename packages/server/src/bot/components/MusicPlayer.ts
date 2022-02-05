import ytpl from 'ytpl';
import ytdl from 'ytdl-core-discord';
import { User, VoiceChannel } from 'discord.js';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';

// import BaseComponent, { ComponentState } from './BaseComponent';
import {
  GuildQueue,
  QueueItem,
  RepeatMethod,
  url,
} from '../types/music-player-types';
import BaseComponent, { ComponentState } from './BaseComponent';

export class MusicPlayer extends BaseComponent {
  queue: GuildQueue = [];
  nowPlaying: number = 0;
  private player: AudioPlayer = createAudioPlayer();
  repeatMethod: RepeatMethod = RepeatMethod.NONE;

  addingSong = false;
  autoplayDisabled = false;

  constructor(guildId: string, state: ComponentState) {
    super(guildId, state);
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
        if (!this.autoplayDisabled) {
          this.nextSong();
        }
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
    connection.on('stateChange', (oldState: any, newState: any) => {
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

  createCurrentSongEmbed() {
    const currentSong = this.queue[this.nowPlaying];
    return {
      type: 'rich',
      title: `${currentSong.title}`,
      description: `- ${currentSong.artist}`,
      color: 0x04a9f5,
      image: currentSong.thumbnail,
      author: {
        name: `Now Playing:`,
      },
      url: currentSong.url,
    };
  }

  createQueueEmbed(includePlayedSongs = false) {
    // const upNext = this.this.queue[this.nowPlaying];
    const futureSongs = this.queue
      .map((song, trackNumber) => ({ song, trackNumber }))
      .filter((__, i) => i > this.nowPlaying)
      .map(({ song, trackNumber }) => ({
        name: `${trackNumber + 1}. **${song.title}**`,
        value: song.artist ? `- ${song.artist}` : '\u200B',
      }));

    const currentSong = this.queue[this.nowPlaying];

    const playedSongs = this.queue
      .map((song, trackNumber) => ({ song, trackNumber }))
      .filter((__, i) => i < this.nowPlaying)
      .map(
        ({ song, trackNumber }) =>
          `${trackNumber + 1}. ~~${song.title}~~\n${
            song.artist ? `- ~~${song.artist}~~` : '\u200B'
          }`
      );

    const playedPlusCurrent = [
      ...playedSongs,
      `**${this.nowPlaying + 1}. ${
        currentSong.title
      }**<a:nekodance:938743228251922462>\n${
        currentSong.artist ? `- ${currentSong.artist}` : '\u200B'
      }`,
    ];

    return {
      type: 'rich',
      title: `Up Next:`,
      description: includePlayedSongs ? playedPlusCurrent.join('\n') : '',
      color: 0x04a9f5,
      fields: [...futureSongs],
      // thumbnail: currentSong.thumbnail,
    };
  }
  // #region Control Methods

  // Play current song
  async play() {
    console.log('play()');
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

  prevSong() {
    this.gotoSong(this.nowPlaying - 1);
  }

  nextSong() {
    this.gotoSong(this.nowPlaying + 1);
  }

  clamp(max: number, num: number) {
    if (num < 0) return 0;
    if (num > max) return max;
    return num;
  }

  wrap(max: number, num: number) {
    return num >= 0 ? num % max : ((num % max) + max) % max;
  }

  wrapWithinArray(arr: Array<any>, value: number) {
    return this.wrap(arr.length, value);
  }
  clampWithinArray(arr: Array<any>, value: number) {
    return this.clamp(arr.length - 1, value);
  }

  async gotoSong(index: number, method: 'wrap' | 'clamp' = 'wrap') {
    this.autoplayDisabled = true;
    const newIndex =
      method === 'wrap'
        ? this.wrapWithinArray(this.queue, index)
        : this.clampWithinArray(this.queue, index);

    this.stop();
    this.nowPlaying = newIndex;
    await this.play();
    this.autoplayDisabled = false;
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

  createQueueItem(song: string, user: User) {
    if (song.includes('spotify')) {
      throw new Error('Spotify support coming soon!');
    }

    // validate youtube link
    const validYTUrl = ytdl.validateURL(song);
    if (!validYTUrl) {
      throw new Error(`Not a youtube domain: ${song}`);
    }

    return this.getVideoInfoAsQueueItem(song, user);
  }

  // Add a song to queue
  async add(
    song: QueueItem | url,
    user: User,
    skipPlay = false
  ): Promise<number> {
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
        if (!skipPlay) {
          this.play();
        }
      }

      return this.queue.length - 1;
    } catch (e: any) {
      this.queue = oldQueue;
      throw new Error(e);
    }
  }

  async addPlaylist(playlistUrl: url, user: User) {
    const playlistRes = await ytpl(playlistUrl, {});

    const songPromises = playlistRes.items.map(
      ({ title, url, thumbnails, author, bestThumbnail }) =>
        this.add(
          {
            title,
            user,
            url,
            thumbnail: bestThumbnail,
            artist: author.name,
          } as QueueItem,
          user,
          true
        )
    );

    console.log('Adding songs...');
    const songs = await Promise.all(songPromises);

    if (
      this.getPlayerStatus() === AudioPlayerStatus.Idle ||
      this.getPlayerStatus() === AudioPlayerStatus.Paused
    ) {
      this.play();
    }

    return songs;
  }
  // Remove a song from queue
  remove(index: number) {
    this.queue = this.removeElementFromArray(this.queue, index);
  }

  // #endregion

  // #region Helpers

  async getVideoInfoAsQueueItem(url: url, user: User): Promise<QueueItem> {
    try {
      const { videoDetails } = await ytdl.getInfo(url);

      return {
        title: videoDetails.title,
        user,
        url,
        artist: videoDetails.author.name,
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1],
      };
    } catch (e: any) {
      throw new Error(`Unable to get video details for ${url}`);
    }
  }

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

export const mpState = new ComponentState(MusicPlayer);

export const initializeMP = () => {
  mpState.createComponentsForEachGuild();

  return mpState;
};
