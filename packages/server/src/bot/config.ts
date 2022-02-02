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
  guilds: [
    // Fyn's PP
    // '872562843688517693',

    // Bestie Server
    '862794834800410654',
  ],
  clientID: process.env['DISCORD_CLIENT_ID'] as string,
  guildID: process.env['DISCORD_GUILD_ID'] as string,
  botToken: process.env['DISCORD_BOT_TOKEN'] as string,
  clientSecret: process.env['DISCORD_CLIENT_SECRET'] as string,

  // **All Possible Intents**:
  // GUILDS
  // GUILD_MEMBERS
  // GUILD_BANS
  // GUILD_EMOJIS_AND_STICKERS
  // GUILD_INTEGRATIONS
  // GUILD_WEBHOOKS
  // GUILD_INVITES
  // GUILD_VOICE_STATES
  // GUILD_PRESENCES
  // GUILD_MESSAGES
  // GUILD_MESSAGE_REACTIONS
  // GUILD_MESSAGE_TYPING
  // DIRECT_MESSAGES
  // DIRECT_MESSAGE_REACTIONS
  // DIRECT_MESSAGE_TYPING
  intents: [
    // Intents.FLAGS.GUILDS,
    // Intents.FLAGS.GUILD_PRESENCES,
    // Intents.FLAGS.GUILD_MEMBERS,
    // Intents.FLAGS.GUILD_VOICE_STATES,
    // Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    // Just giving all intents for now. Not recommended but it's fine since it's only going on two servers
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
