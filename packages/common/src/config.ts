import { GlobalConfig, NodeEnv } from './types/config-types';
import envConfig from '@helper/config';


const NODE_ENV = (process.env.NODE_ENV || 'development') as NodeEnv;

if (typeof window !== 'undefined') {
  throw new Error('Config should not be imported in the browser.');
}

const globalConfig: GlobalConfig = envConfig;

export const config = {
  global: globalConfig[NODE_ENV] as GlobalConfig['development'],
  environment: process.env.NODE_ENV as NodeEnv,
  botName: 'helper',
  botNameFriendly: 'Helper',
};

export default config;
