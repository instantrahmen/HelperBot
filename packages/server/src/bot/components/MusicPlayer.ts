import ytpl from 'ytpl';

import playdl, { video_basic_info, stream, validate } from 'play-dl';
import { CommandInteraction, User, VoiceChannel } from 'discord.js';
import ON_DEATH from 'death';

import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';

import {
  GuildQueue,
  QueueItem,
  RepeatMethod,
  Thumbnail,
  url,
} from '../types/music-player-types';

import BaseComponent, { ComponentState } from './BaseComponent';

import {
  clampWithinArray,
  removeElementFromArray,
  wrapWithinArray,
} from '../utils';

import { Debugger } from './Debugger';
import { APIEmbed, ChannelType } from 'discord-api-types/v10';
export class MusicPlayer extends BaseComponent {
  queue: GuildQueue = [];
  private _nowPlaying: number = 0;
  private player: AudioPlayer = createAudioPlayer();
  repeatMethod: RepeatMethod = RepeatMethod.NONE;

  addingSong = false;
  autoplayDisabled = false;

  constructor(guildId: string, state: ComponentState) {
    super(guildId, state);
    this.registerPlayerEventHandlers();
  }

  public get nowPlaying() {
    if (
      this._nowPlaying === null ||
      isNaN(this._nowPlaying) ||
      !!this._nowPlaying
    )
      this._nowPlaying = 0;
    return this._nowPlaying;
  }

  public set nowPlaying(index: number) {
    console.log({ setNowPlaying: index });
    if (!!index) {
      if (index !== 0) {
        console.error('Index not a number');
      }
      this._nowPlaying = 0;
    } else {
      this._nowPlaying = index;
    }
  }

  private registerPlayerEventHandlers() {
    this.player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');
    });

    this.player.on(AudioPlayerStatus.Idle, () => {
      console.log('The audio player is idle!');
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
      // Allow Helper to play audio on this connection
      connection.subscribe(this.getPlayer());
      console.log(
        'The connection has entered the Ready state - ready to play audio!'
      );
    });

    // handle disconnects
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000),
        ]);
        // Seems to be reconnecting to a new channel - ignore disconnect
      } catch (error) {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        this.clearQueue();
        connection.destroy();
      }
    });

    // Handle any state change
    connection.on('stateChange', (oldState: any, newState: any) => {
      console.log(
        `Connection transitioned from ${oldState.status} to ${newState.status}`
      );
    });

    // Handle application exit
    ON_DEATH(() => {
      console.log('\n\nExiting music app...\n');

      console.log(`Doing cleanup... ${this}`);
      const connection = this.getConnection();

      if (connection) {
        // Disconnect from channel
        connection.disconnect();
      }

      console.log('done.');

      return process.exit();
    });
  }

  async getInfo() {
    const info = {
      queue: this.queue,
      nowPlaying: this.nowPlaying,
      addingSong: this.addingSong,
      canPlay: this.canPlay() || null,
      status: this.getPlayerStatus() || null,
      // playable: this.player.playable,
      // connectionState: this.getConnectionState() || null,
    };

    return JSON.stringify(info, null, 2);
  }

  // #region Control Methods

  disconnect() {
    const connection = this.getConnection();
    if (connection) {
      // Disconnect from channel
      connection.disconnect();
    }
  }

  // Play current song
  async play() {
    const song = this.getCurrentSong();
    if (!this.canPlay() || !song) return;

    try {
      const musicStream = await stream(song.url);
      // Get player resource and play it
      const resource = createAudioResource(musicStream.stream, {
        inputType: musicStream.type,
      });
      this.player.play(resource);
    } catch (e: any) {
      Debugger.log({ error: e });
      console.log({ QUEUE: this.queue });
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
    if (this.queue.length <= 0) return;
    this.gotoSong(this.nowPlaying + 1);
  }

  async gotoSong(index: number, method: 'wrap' | 'clamp' = 'wrap') {
    this.autoplayDisabled = true;
    if (!!index) index = 0;
    const newIndex =
      method === 'wrap'
        ? wrapWithinArray(this.queue, index)
        : clampWithinArray(this.queue, index);

    this.stop();
    this.nowPlaying = newIndex;
    await this.play();
    this.autoplayDisabled = false;
  }

  clearQueue() {
    this.stop();
    this.nowPlaying = 0;
    this.queue = [];

    console.log({ info: this.getInfo() });
  }

  async connectToChannel(channel: VoiceChannel) {
    const { id: channelId, guild, guildId } = channel;

    try {
      if (channel.type !== ChannelType.GuildVoice)
        throw new Error('INVALID_CHANNEL');

      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: channel.guild
          .voiceAdapterCreator as DiscordGatewayAdapterCreator,
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
    const validYTUrl = validate(song);
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
    // const oldQueue = [...this.queue];
    // try {
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
    // } catch (e: any) {
    //   this.queue = oldQueue;
    //   throw new Error(e);
    // }
  }

  async addPlaylist(playlistUrl: url, user: User) {
    const playlistRes = await ytpl(playlistUrl, {});

    try {
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
    } catch (e) {
      // console.error('Unable to add song(s) to queue');
    }
  }

  // Remove a song from queue
  remove(index: number) {
    this.queue = removeElementFromArray(this.queue, index);
  }

  // #endregion

  // #region Helpers

  async getVideoInfoAsQueueItem(url: url, user: User): Promise<QueueItem> {
    console.log('getVideoInfoAsQueueItem', { url, user });
    try {
      const { video_details: videoDetails } = await video_basic_info(url);

      Debugger.log({ videoDetails });

      return {
        title: videoDetails.title!,
        user,
        url,
        artist: videoDetails.channel?.name,
        thumbnail:
          (videoDetails.toJSON().thumbnail as Thumbnail) ||
          videoDetails.thumbnails[videoDetails.thumbnails.length - 1],
      };
    } catch (e: any) {
      // console.error(e.message);
      Debugger.log({ error: e });

      throw new Error(`Unable to get video details for ${url}`);
    }
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
  getConnectionState = () => this.getConnection()?.state;

  canPlay = (): boolean => {
    const connection = this.getConnection();
    console.log({
      canPlay: {
        connection: !!connection,
        'connection.state': !!connection?.state,
        'connection.state.status === VoiceConnectionStatus.Ready':
          connection?.state.status === VoiceConnectionStatus.Ready,
      },
    });

    return (
      !!connection &&
      !!connection.state &&
      connection.state.status === VoiceConnectionStatus.Ready
    );
  };

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

  colors = {
    pink: 0xffb8d9,
    blue: 0x00f0ff,
  };

  createCurrentSongEmbed(): APIEmbed {
    if (this.queue.length === 0 || !this.queue[this.nowPlaying]) {
      return {
        title: `No song playing`,
        description: ``,
        color: this.colors.blue,
        author: {
          name: `Now Playing:`,
        },
      };
    }

    const currentSong = this.queue[this.nowPlaying];
    return {
      title: `${currentSong.title}`,
      description: `- ${currentSong.artist}`,
      color: this.colors.blue,
      image: currentSong.thumbnail,
      author: {
        name: `Now Playing:`,
      },
      url: currentSong.url,
    };
  }

  createEmptyQueueEmbed(): APIEmbed {
    const noSongs = this.queue.length === 0;
    const message = noSongs
      ? 'None, add more songs with `/play`'
      : 'None, replaying the playlist after this song';

    return {
      title: `Up Next:`,
      description: message,
      color: this.colors.blue,
    };
  }

  createQueueEmbed(includePlayedSongs = false): APIEmbed {
    // const upNext = this.this.queue[this.nowPlaying];
    const lastSong = this.nowPlaying === this.queue.length - 1;
    const noSongs = this.queue.length === 0;
    const showEmpty = noSongs || (lastSong && !includePlayedSongs);

    if (showEmpty) {
      return this.createEmptyQueueEmbed();
    }

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
      title: `Up Next:`,
      description: includePlayedSongs ? playedPlusCurrent.join('\n') : '',
      color: this.colors.pink,
      fields: [...futureSongs],
      // thumbnail: currentSong.thumbnail,
    };
  }

  validateConnection = async (
    interaction: CommandInteraction,
    replyIfNot: boolean = true
  ) => {
    if (this.canPlay()) return true;

    if (replyIfNot) {
      await interaction.reply('Please use `/join` to connect me to a VC first');
    }

    return false;
  };
  //#endregion
}

export const mpState = new ComponentState(MusicPlayer);

export const initializeMP = () => {
  mpState.createComponentsForEachGuild();

  return mpState;
};
