import config from './config.js';
import fs from 'fs';

const transformConfig = (config) => {
  if (!config) {
    throw new Error(
      'No config provided. Please copy config.example.js as config.js and fill it out.'
    );
  }

  const configJson = JSON.stringify(config, null, 2);
  // If './.config.json' exists, delete it
  if (fs.existsSync('./.config.json')) {
    fs.unlinkSync('./.config.json');
  }
  fs.writeFileSync('./.config.json', configJson);
  console.log('Transformed `.config.json`');
};

transformConfig(config);
