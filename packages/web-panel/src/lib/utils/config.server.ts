import envConfig from '@helper/config';

export const config = {
  global: envConfig,
  environment: process.env.NODE_ENV || 'development',
  botName: 'helper',
  botNameFriendly: 'Helper',
};

export const getConfig = () => config;
