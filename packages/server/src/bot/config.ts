import dotenv from 'dotenv';
import { Intents } from 'discord.js';

dotenv.config();

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

const config = {
  commandPrefix: 'fyn!',
  status: 'starting',
  guilds:
    process.env.NODE_ENV === 'production'
      ? [
          // Fyn's PP
          '872562843688517693',

          // Bestie Server
          '862794834800410654',
        ]
      : ['862794834800410654'],
  clientID: process.env['DISCORD_CLIENT_ID'] as string,
  guildId: process.env['DISCORD_GUILD_ID'] as string,
  botToken: process.env['DISCORD_BOT_TOKEN'] as string,
  clientSecret: process.env['DISCORD_CLIENT_SECRET'] as string,

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

export default config;
