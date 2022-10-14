import { Intents } from 'discord.js';
import { config } from '@helper/common';

console.log({ config });
const {
  GUILDS,
  GUILD_MEMBERS,
  GUILD_BANS,
  GUILD_EMOJIS_AND_STICKERS,
  GUILD_INTEGRATIONS,
  GUILD_WEBHOOKS,
  GUILD_INVITES,
  GUILD_VOICE_STATES,
  GUILD_PRESENCES,
  GUILD_MESSAGES,
  GUILD_MESSAGE_REACTIONS,
  GUILD_MESSAGE_TYPING,
  DIRECT_MESSAGES,
  DIRECT_MESSAGE_REACTIONS,
  DIRECT_MESSAGE_TYPING,
} = Intents.FLAGS;

export default {
  commandPrefix: 'helper!',
  status: 'starting',
  guilds: config.global.GUILDS,
  clientID: config.global.DISCORD_CLIENT_ID,
  // guildId: config.global.DISCORD_GUILD_ID,
  botToken: config.global.DISCORD_BOT_TOKEN,
  clientSecret: config.global.DISCORD_CLIENT_SECRET,
  environment: config.environment,
  // Discord.js intents (https://discordjs.guide/popular-topics/intents.html#privileged-intents)
  intents: [
    GUILDS,
    GUILD_MEMBERS,
    GUILD_BANS,
    GUILD_EMOJIS_AND_STICKERS,
    GUILD_INTEGRATIONS,
    GUILD_WEBHOOKS,
    GUILD_INVITES,
    GUILD_VOICE_STATES,
    GUILD_PRESENCES,
    GUILD_MESSAGES,
    GUILD_MESSAGE_REACTIONS,
    GUILD_MESSAGE_TYPING,
    DIRECT_MESSAGES,
    DIRECT_MESSAGE_REACTIONS,
    DIRECT_MESSAGE_TYPING,
  ],
};
