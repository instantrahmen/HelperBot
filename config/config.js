import dotenv from 'dotenv-mono';

if (process.env.NODE_ENV !== 'production' && !!dotenv && !!dotenv.config) {
  dotenv.config();
}

/**
 * Returns the value if it is truthy, otherwise returns an empty string.
 *
 * @param {string} value - The input value to check.
 * @return {string} The value if truthy, otherwise an empty string.
 */
const valueOrEmpty = (value) => {
  return value || '';
};

const config = {
  DISCORD_CLIENT_ID: valueOrEmpty(process.env.DISCORD_CLIENT_ID),
  DISCORD_CLIENT_SECRET: valueOrEmpty(process.env.DISCORD_CLIENT_SECRET),
  DISCORD_BOT_TOKEN: valueOrEmpty(process.env.DISCORD_BOT_TOKEN),
  GUILDS: valueOrEmpty(process.env.GUILDS).split(' '),
  PB_URL: valueOrEmpty(process.env.PB_URL),
};

export default config;