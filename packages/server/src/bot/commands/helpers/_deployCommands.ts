import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../../config';
import { getCommands } from '../../state/command-state';
import { Command } from '../../types';
import { getDebugger } from '../debug/debugger';

const { clientID, guilds, botToken } = config;

const commandFilter = (guildId: string) => (command: Command) => {
  const guildDebugger = getDebugger(guildId);

  if (guildDebugger.disableCommands) return command.forceAvailable || false;
  if (command.debugOnly) return guildDebugger.debugMode || false;

  return true;
};

const generateCommandsPostBody = (guildId: string) => {
  return getCommands()
    .filter(commandFilter(guildId))
    .map((command) => {
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
};

const rest = new REST({ version: '9' }).setToken(botToken);

export const deployCommands = async (guildID: string) => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
      body: generateCommandsPostBody(guildID),
    });
    return guildID;
  } catch (error) {
    console.error(error);
  }
};

export const deployCommandsAllGuilds = async () => {
  config.status = 'deploying commands';

  const deploymentPromises = guilds.map((guildID: string) =>
    deployCommands(guildID)
  );

  await Promise.all(deploymentPromises).catch((e) => {
    console.warn(`Couldn't deploy commands`, e);
  });

  config.status = 'running';
  return guilds;
};
