// TODO: Needs a serious refactor
import { Command, CommandsArray, IndexedCommands } from '../types';

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
  const newIndexedCommands = getIndexedCommands();

  commands.forEach((command: Command) => {
    newIndexedCommands[command.name] = command;
  });

  setCommands(createCommandsArray(newIndexedCommands));
};

export const getCommands = () => [..._commandState.commands];
export const getIndexedCommands = () => ({ ..._commandState.indexedCommands });
