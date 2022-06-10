import yaml from 'js-yaml';
import { GlobalConfig } from './types/config-types';

export const config = {
  global: yaml.load('../../../.config.yml') as GlobalConfig,
};

export default config;
