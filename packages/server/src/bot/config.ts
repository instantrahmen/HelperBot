import { GatewayIntentBits } from 'discord.js';
import envConfig from '@helper/config';

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}
export type GlobalConfig = typeof envConfig;

const NODE_ENV = (import.meta.env.MODE || 'development') as NodeEnv;
// const mode = import.meta.env.MODE;

const globalConfig: GlobalConfig = envConfig;

export const getConfigForEnv = (env: NodeEnv) => globalConfig[env];

export const config = {
  global: globalConfig[NODE_ENV] as GlobalConfig['development'],
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
