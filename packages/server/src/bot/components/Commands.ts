import { REST } from '@discordjs/rest';
import { CommandInteraction } from 'discord.js';
import config from '../config';
import { Command, CommandBase, CommandsArray, IndexedCommands } from '../types';
import { getDebugger } from './Debugger';
import { Routes } from 'discord-api-types/v9';

const { clientID, guilds, botToken } = config;

const rest = new REST({ version: '9' }).setToken(botToken);

export const commandState = {
  commands: {} as IndexedAppCommands,

  commandsArray() {
    const keys = Object.keys(this.commands);
    const commandsArray: AppCommandsArray = keys.map(
      (key) => this.commands[key]
    );
    return commandsArray;
  },

  registerCommand(commandOptions: Command) {
    const command = new _AppCommand(commandOptions);

    this.commands[commandOptions.name] = command;
  },

  registerCommands(commandOptionsArray: CommandsArray) {
    commandOptionsArray.forEach((commandOptions: Command) => {
      this.registerCommand(commandOptions);
    });
  },

  // Just returns what you give it for now
  createCommand(commandOptions: Command) {
    return commandOptions;
  },

  getCommand(name: string): AppCommand {
    if (!this.commands[name]) throw new Error(`No such command: ${name}`);
    return this.commands[name];
  },

  // Filter out commands based on the debugger state
  createFilter(guildId?: string) {
    return (command: AppCommand): boolean => {
      const guildDebugger = guildId ? getDebugger(guildId) : undefined;

      // If there's no guildId or debugger, don't filter anything
      if (!guildDebugger || !guildId) {
        return true;
      }

      const { commandOptions } = command;

      if (guildDebugger.disableCommands)
        return commandOptions.forceAvailable || false;
      if (commandOptions.debugOnly) return guildDebugger.debugMode || false;

      return true;
    };
  },

  toJSON(guildId?: string) {
    const postBody = this.commandsArray()
      .filter(this.createFilter(guildId))
      .map((command) => command.toJSON());
    console.log({ postBody });

    return postBody;
  },

  async deployForGuild(guildId: string) {
    try {
      await rest.put(Routes.applicationGuildCommands(clientID, guildId), {
        body: commandState.toJSON(guildId),
      });

      return guildId;
    } catch (error: any) {
      throw new Error(error);
    }
  },

  async deployAll() {
    const deploymentPromises = guilds.map((guildId: string) =>
      this.deployForGuild(guildId)
    );

    await Promise.all(deploymentPromises).catch((e) => {
      console.warn(`Couldn't deploy commands`, e);
    });

    return guilds;
  },
};

export default commandState;

class _AppCommand {
  commandOptions: Command;

  constructor(commandOptions: Command) {
    this.commandOptions = commandOptions;
  }

  toCommandBase() {
    return this.commandOptions as CommandBase;
  }

  toJSON() {
    return this.toCommandBase();
  }

  run(interaction: CommandInteraction) {
    this.commandOptions.do(interaction);
  }
}

// Export AppCommand as a type only, leaving the class "private" and unexported
export type AppCommand = _AppCommand;

export type AppCommandsArray = AppCommand[];

export type IndexedAppCommands = {
  [key: string]: AppCommand;
};
