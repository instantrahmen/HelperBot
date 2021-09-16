import dotenv from 'dotenv';
dotenv.config();

const config = {
  commandPrefix: 'fyn!',
  status: 'starting',
  guilds: [
    // Fyn's PP
    '872562843688517693',

    // Bestie Server
    '862794834800410654',
  ],
  clientID: process.env['DISCORD_CLIENT_ID'] as string,
  guildID: process.env['DISCORD_GUILD_ID'] as string,
  botToken: process.env['DISCORD_BOT_TOKEN'] as string,
  clientSecret: process.env['DISCORD_CLIENT_SECRET'] as string,
};

export default config;
