import { readFileSync } from 'fs';
import YAML from 'yaml';

export const loadYaml = (filePath: string): any => {
  const file = readFileSync(`${filePath}`, 'utf8');
  return YAML.parse(file);
};
