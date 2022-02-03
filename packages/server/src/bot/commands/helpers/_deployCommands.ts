import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../../config';
import { getDebugger } from '../debug/debugger';
import commands from '../_commands';
import { Command } from './_commandState';

const { clientID, guilds, botToken } = config;

// console.log('gen commands', { commands });

const commandFilter = (guildId: string) => (command: Command) => {
  const guildDebugger = getDebugger(guildId);

  if (guildDebugger.disableCommands) return command.forceAvailable || false;
  if (command.debugOnly) return guildDebugger.debugMode || false;

  return true;
};

const generatedCommands = (guildId: string) =>
  commands.filter(commandFilter(guildId)).map((command) => {
    const commandObject = {
      ...new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description),
    } as any;
    if (command.options) {
      // commandObject.options = { ...commandObject.options, ...command.options };
      commandObject.options = command.options;
    }
    return commandObject;
  });

const rest = new REST({ version: '9' }).setToken(botToken);

export const deployCommands = async (guildID: string) => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
      body: generatedCommands(guildID),
    });
    return guildID;
  } catch (error) {
    console.error(error);
  }
};

export const deployCommandsAllGuilds = async () => {
  config.status = 'deploying commands';
  guilds.map(async (guildID: string) => await deployCommands(guildID));

  config.status = 'running';

  return guilds;
};
