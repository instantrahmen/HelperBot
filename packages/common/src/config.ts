import { loadYaml } from './lib/helpers';
import { GlobalConfig, NodeEnv } from './types/config-types';

const NODE_ENV = (process.env.NODE_ENV || 'development') as NodeEnv;

// The global configuration is stored in the root under `.config.yml`. This file should has important secrets and should not be committed. Please use the included example.config.yml as a template.
const globalConfig = loadYaml(
  `${__dirname}/../../../.config.yml`
) as GlobalConfig;

export const config = {
  global: globalConfig[NODE_ENV],
  environment: process.env.NODE_ENV as NodeEnv,
  botName: 'helper',
  botNameFriendly: 'Helper',
};

export default config;
