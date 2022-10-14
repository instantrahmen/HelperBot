const YAML = require('yaml');
const fs = require('fs');

const { readFileSync } = fs;

const loadYaml = (filePath) => {
  const file = readFileSync(`${filePath}`, 'utf8');
  return YAML.parse(file);
};

const { deploy } = loadYaml(`${__dirname}/../.config.yml`);

module.exports = deploy;
