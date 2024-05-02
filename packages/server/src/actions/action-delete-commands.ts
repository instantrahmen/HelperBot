import { REST, Routes } from 'discord.js';
import { getConfigForEnv, NodeEnv } from '../bot/config';

// const { clientID, botToken, guilds } = config;

const env = process.argv.includes('--prod')
  ? NodeEnv.PRODUCTION
  : NodeEnv.DEVELOPMENT;

const config = getConfigForEnv(env);

const {
  DISCORD_CLIENT_ID: clientID,
  DISCORD_BOT_TOKEN: botToken,
  GUILDS: guilds,
} = config;
export const deleteCommands = async (global = false) => {
  console.log('deleting all', global ? 'global' : 'guild', 'commands');
  const rest = new REST({ version: '10' }).setToken(botToken);

  try {
    if (global) {
      await rest.put(Routes.applicationCommands(clientID), {
        body: [],
      });
    } else {
      await Promise.all(
        guilds.map(async (guildId) => {
          await rest.put(Routes.applicationGuildCommands(clientID, guildId), {
            body: [],
          });
        })
      );
    }
  } catch (error) {
    console.error(error);
  }
};

deleteCommands(process.argv.includes('--global'));
