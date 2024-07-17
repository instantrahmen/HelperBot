import { GatewayIntentBits } from 'discord.js';
import envConfig from '@helper/config';

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

const NODE_ENV = (import.meta.env.MODE || 'development') as NodeEnv;

export const config = {
  global: envConfig,
  environment: NODE_ENV,
  botName: 'helper',
  botNameFriendly: 'Helper',
};

const {
  Guilds,
  GuildMembers,
  GuildModeration,
  GuildEmojisAndStickers,
  GuildIntegrations,
  GuildWebhooks,
  GuildInvites,
  GuildVoiceStates,
  GuildPresences,
  GuildMessages,
  GuildMessageReactions,
  GuildMessageTyping,
  DirectMessageReactions,
  DirectMessageTyping,
  DirectMessages,
} = GatewayIntentBits;

export default {
  commandPrefix: 'helper!',
  status: 'starting',
  guilds: config.global.GUILDS,
  clientID: config.global.DISCORD_CLIENT_ID,
  botToken: config.global.DISCORD_BOT_TOKEN,
  clientSecret: config.global.DISCORD_CLIENT_SECRET,
  environment: config.environment,
  debugMode: true,
  // Discord.js intents (https://discordjs.guide/popular-topics/intents.html#privileged-intents)
  intents: [
    Guilds,
    GuildMembers,
    GuildModeration,
    GuildEmojisAndStickers,
    GuildIntegrations,
    GuildWebhooks,
    GuildInvites,
    GuildVoiceStates,
    GuildPresences,
    GuildMessages,
    GuildMessageReactions,
    GuildMessageTyping,
    DirectMessageReactions,
    DirectMessageTyping,
    DirectMessages,
  ],
};
