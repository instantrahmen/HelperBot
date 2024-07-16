import dotenv from 'dotenv-mono';
dotenv.config();

const config = {
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  GUILDS: process.env.GUILDS.split(' '),
  PB_URL: process.env.PB_URL,
};

export default config;