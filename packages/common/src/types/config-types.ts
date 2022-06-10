export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export type GlobalConfigENV = {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_GUILD_ID: string;
  SUPABASE_ENDPOINT: string;
  SUPABASE_PUBLIC_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  SUPABASE_SECRET: string;
  GUILDS: string[];
};

export type GlobalConfig = {
  [key in NodeEnv]: GlobalConfigENV;
};
