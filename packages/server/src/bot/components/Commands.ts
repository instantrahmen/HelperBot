import { REST } from '@discordjs/rest';
import { CommandInteraction } from 'discord.js';
import { snakeCase } from 'lodash';

import config from '../config';
import { Command, CommandsArray, APIAppCommand } from '../types';
import { Debugger, getDebugger } from './Debugger';
import { Routes } from 'discord-api-types/v9';
import { botState } from './Bot';
import { getPermissionsArray, permissionLevels } from '../permissions';

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

    return postBody;
  },

  async deployForGuild(guildId: string): Promise<APIAppCommand[]> {
    try {
      const res = await rest.put(
        Routes.applicationGuildCommands(clientID, guildId),
        {
          body: commandState.toJSON(guildId),
        }
      );

      return res as APIAppCommand[];
    } catch (error: any) {
      throw new Error(error);
    }
  },

  async deployAll() {
    console.log('deploying all commands...');
    const deploymentPromises = guilds.map((guildId: string) =>
      this.deployForGuild(guildId)
    );

    // data[0]

    const data = await Promise.all(deploymentPromises).catch((e) => {
      console.warn(`Couldn't deploy commands`, e);
    });

    console.log('deploying all commands finished.');

    if (!data) {
      throw new Error('No data returned from command deploy');
    }

    Debugger.log({ data });

    await this.setPermissions(data);

    return data;
  },

  async setPermissions(apiCommands: APIAppCommand[][]) {
    const response = await Promise.all(
      apiCommands.map((commands) => {
        return Promise.all(
          commands.map(async (command) => {
            const { guild_id: guildId, id: commandId, name } = command;
            const appCommandOptions = this.commands[name].commandOptions;
            if (!appCommandOptions.permissions) return;

            const fetchedCommand = await this.fetchCommandFromAPI(
              guildId!,
              commandId
            );

            // const permissions = getPermissionsArray(
            //   appCommandOptions.permissions,
            //   guildId!
            // );

            // await fetchedCommand?.permissions.add({ permissions });
            // return fetchedCommand?.setDefaultPermission(
            //   appCommandOptions.defaultPermission
            // );
            return fetchedCommand;
          })
        );
      })
    );

    Debugger.log(response);
    return response;
  },

  async fetchCommandFromAPI(guildId: string, commandId: string) {
    const { client } = botState;
    return client.guilds.cache.get(guildId)?.commands.fetch(commandId);
  },
};

export default commandState;

class _AppCommand {
  commandOptions: Command;

  constructor(commandOptions: Command) {
    this.commandOptions = commandOptions;
  }

  // toCommandBase() {
  //   return this.commandOptions as CommandBase;
  // }

  toJSON() {
    // let newObject as API;
    return Object.keys(this.commandOptions).reduce((newObj: any, oldKey) => {
      const newKey = snakeCase(oldKey);
      return { ...newObj, [newKey]: (this.commandOptions as any)[oldKey] };
    }, {});
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
