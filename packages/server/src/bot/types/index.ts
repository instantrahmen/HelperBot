import {
  ApplicationCommand,
  CommandInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';
import {
  APIApplicationCommandOption,
  APIApplicationCommand,
  ChannelType,
} from 'discord-api-types/v10';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export enum OptionType {
  SUB_COMMAND = 1, // SUB_COMMAND sets the option to be a subcommand
  SUB_COMMAND_GROUP = 2, // SUB_COMMAND_GROUP sets the option to be a subcommand group
  STRING = 3, // STRING sets the option to require a string value
  INTEGER = 4, // INTEGER sets the option to require an integer value
  BOOLEAN = 5, // BOOLEAN sets the option to require a boolean value
  USER = 6, // USER sets the option to require a user or snowflake as value
  CHANNEL = 7, // CHANNEL sets the option to require a channel or snowflake as value
  ROLE = 8, // ROLE sets the option to require a role or snowflake as value
  MENTIONABLE = 9, // MENTIONABLE sets the option to require a user, role or snowflake as value
}

export type CommandOption = Merge<
  APIApplicationCommandOption,
  {
    type: OptionType;
    options?: CommandOption;
    channel_types?: ChannelType[];
    min_value?: number;
    max_value?: number;
  }
>;

export type APIAppCommand = APIApplicationCommand;
export type APIAppCommandsForGuild = {
  guildId: string;
  commands: APIAppCommand[];
};

export type CommandBase =
  | {
      name: string;
      description: string;
      options?: CommandOption[];
      // type?: ApplicationCommand['type'];
    }
  | {
      name: string;
      type: 2;
    };

export type Command = CommandBase & {
  debugOnly?: boolean;
  forceAvailable?: boolean;
  do: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export type CommandsArray = Command[];

export type IndexedCommands = {
  [key: string]: Command;
};

export type KVPairs = { [key: string]: any };
