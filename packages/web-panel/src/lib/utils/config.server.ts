import envConfig from '@helper/config';

type NodeEnv = 'production' | 'development';
type GlobalConfig = typeof envConfig;

const NODE_ENV = (process.env.NODE_ENV || 'development') as NodeEnv;

const globalConfig: GlobalConfig = envConfig;

export const config = {
  global: globalConfig[NODE_ENV] as GlobalConfig['development'],
  environment: process.env.NODE_ENV as NodeEnv,
  botName: 'helper',
  botNameFriendly: 'Helper',
};

export const getConfig = () => config;
