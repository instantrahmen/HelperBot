import { config } from '@helper/common';
import { GatewayIntentBits } from 'discord.js';

const {
  Guilds,
  GuildMembers,
  GuildBans,
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
  // guildId: config.global.DISCORD_GUILD_ID,
  botToken: config.global.DISCORD_BOT_TOKEN,
  clientSecret: config.global.DISCORD_CLIENT_SECRET,
  environment: config.environment,
  // Discord.js intents (https://discordjs.guide/popular-topics/intents.html#privileged-intents)
  intents: [
    Guilds,
    GuildMembers,
    GuildBans,
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
