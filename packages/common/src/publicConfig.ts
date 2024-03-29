import { loadYaml } from './lib/helpers';
import { NodeEnv, PublicConfig } from './types/config-types';

const NODE_ENV = (process.env.NODE_ENV || 'development') as NodeEnv;

// The global configuration is stored in the root under `.config.yml`. This file should has important secrets and should not be committed. Please use the included example.config.yml as a template.
const publicConfigYaml = loadYaml(
  `${__dirname}/../../../public.config.yml`
) as PublicConfig;

export const publicConfig = {
  environment: process.env.NODE_ENV as NodeEnv,
  public: publicConfigYaml[NODE_ENV],
};

export default publicConfig;
