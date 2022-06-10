// import yaml from 'js-yaml';
import { loadYaml } from './lib/helpers';
import { GlobalConfig, NodeEnv } from './types/config-types';

const NODE_ENV = (process.env.NODE_ENV || 'development') as NodeEnv;

const globalConfig = loadYaml(
  `${__dirname}/../../../.config.yml`
) as GlobalConfig;

console.log({ globalConfig });

export const config = {
  global: globalConfig[NODE_ENV],
  environment: process.env.NODE_ENV,
  botName: 'helper',
  botNameFriendly: 'Helper',
};

export default config;
