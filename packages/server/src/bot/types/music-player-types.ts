import { User } from 'discord.js';
import { MusicPlayer } from '../components/MusicPlayer';

// Types and Enums
export type QueueItem = {
  title: string;
  user: User;
  url: string;
  thumbnail?: Thumbnail;
  artist?: string;
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type url = string;

export type GuildQueue = QueueItem[];

export type PlayersByGuild = { [guildId: string]: MusicPlayer };

export enum RepeatMethod {
  NONE,
  REPEAT_ONE,
  REPEAT_ALL,
}
