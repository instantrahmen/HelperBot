import envConfig from '@helper/config';

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export type GlobalConfigENV = {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  GUILDS: string[];
  DEBUG_MODE?: boolean;
  PB_URL: string;
};

export type PublicConfigENV = {
  SUPABASE_ENDPOINT: string;
  SUPABASE_ANON_KEY: string;
};

export type GlobalConfig = typeof envConfig;

export type PublicConfig = {
  [key in NodeEnv]: PublicConfigENV;
};
