import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../../config';
import commands from '../_commands';

const { clientID, guilds, botToken } = config;

// console.log('gen commands', { commands });
const generatedCommands = commands.map((command) => {
  // console.log({ command });
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
      body: generatedCommands,
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
