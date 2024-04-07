// import { loadYaml } from './lib/helpers';
import { GlobalConfig, NodeEnv } from './types/config-types';
import envConfig from 'config/config';

const NODE_ENV = (process.env.NODE_ENV || 'development') as NodeEnv;

// import path from 'path';
// import { fileURLToPath } from 'url';

// Recreate __dirname, since it isn't available in svelte-kit
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (typeof window !== 'undefined') {
  throw new Error('This file should not be imported in the browser.');
}

// The global configuration is stored in the root under `.config.yml`. This file should has important secrets and should not be committed. Please use the included example.config.yml as a template.
// const globalConfig = loadYaml(
//   `${__dirname}/../../../.config.yml`
// ) as GlobalConfig;
const globalConfig = envConfig satisfies GlobalConfig;

export const config = {
  global: globalConfig[NODE_ENV],
  environment: process.env.NODE_ENV as NodeEnv,
  botName: 'helper',
  botNameFriendly: 'Helper',
};

export default config;
