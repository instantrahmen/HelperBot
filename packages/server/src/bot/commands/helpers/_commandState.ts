import {
  ApplicationCommandOption,
  ApplicationCommandOptionChoice,
  CommandInteraction,
  Options,
} from 'discord.js';

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

// Options
export type CommandOption = {
  type: OptionType; // value of application command option type
  name: string; // 1-32 lowercase character name matching ^[\w-]{1,32}$
  description: string; // 1-100 character description
  required: boolean; // if the parameter is required or optional--default false
  choices?: ApplicationCommandOptionChoice[]; // choices for string and int types for the user to pick from
  options?: CommandOption[]; // if the option is a subcommand or subcommand group type, this nested options will be the parameters
};

export type Command = {
  name: string;
  description: string;
  options?: CommandOption[];
  do: (interaction: CommandInteraction) => Promise<void>;
};

export type CommandsArray = Command[];

export type IndexedCommands = {
  [key: string]: Command;
};

// Underscore to indicate it's private. Do not set directly outside of here. Instead use setCommands
const _commandState = {
  commands: [] as CommandsArray,
  indexedCommands: {} as IndexedCommands,
};

// [{name, ...}] => {[name]: {name, ...}}
const createIndexedCommands = (commands: CommandsArray): IndexedCommands =>
  commands.reduce((obj, command) => {
    return { ...obj, [command.name]: command };
  }, {});

const createCommandsArray = (commands: IndexedCommands): CommandsArray => {
  const keys = Object.keys(commands);
  const commandsArray: CommandsArray = keys.map((key) => commands[key]);
  return commandsArray;
};

const setCommands = (commands: CommandsArray) => {
  _commandState.commands = commands;
  _commandState.indexedCommands = createIndexedCommands(commands);
  return commands;
};

export const registerCommand = (command: Command) => {
  const newIndexedCommands = getIndexedCommands();
  newIndexedCommands[command.name] = command;

  setCommands(createCommandsArray(newIndexedCommands));
};

// Command factory. Currently just returns what you give it, but will maybe update it in the future to do more
export const createCommand = (command: Command): Command => command;

export const registerCommands = (commands: CommandsArray) => {
  // console.log({ registerCommands: commands });
  const newIndexedCommands = getIndexedCommands();

  commands.forEach((command: Command) => {
    newIndexedCommands[command.name] = command;
  });

  setCommands(createCommandsArray(newIndexedCommands));
};
export const getCommands = () => [..._commandState.commands];
export const getIndexedCommands = () => ({ ..._commandState.indexedCommands });
