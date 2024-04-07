// @ts-check
const YAML = require('yaml');
const fs = require('fs');

const { readFileSync } = fs;

const loadYaml = (filePath) => {
  const file = readFileSync(`${filePath}`, 'utf8');
  return YAML.parse(file);
};

// const { deploy, ssh } = loadYaml(`${__dirname}/../.config.yml`);
// const { deploy, ssh } = loadYaml(`${__dirname}/../packages/config/config.yml`);
const { deploy, ssh } = require('../config/');

module.exports = { deploy, ssh };
