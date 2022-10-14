// Copy required non-commited files to server. Requires filling out deploy.config.js and running `pm2 deploy setup` first
const { Client } = require('node-scp');
const deploy = require('./deploy.config');
const fs = require('fs');

const requiredFiles = ['.config.yml', 'ecosystem.json'];

const environment = process.argv[2] || 'production';

const postDeploy = async () => {
  // Connect to the server

  await uploadRequiredFiles();

  process.exit(0);
};

const uploadRequiredFiles = async () => {
  const client = await Client({
    host: deploy[environment].host,
    username: deploy[environment].user,
    port: 22,
    privateKey: fs.readFileSync(deploy[environment]['local-private-key']),
  }).catch((e) =>
    console.error(`Unable to connect to server. \n\n${e.message}`)
  );

  try {
    // Upload required files
    console.log('Connected to server');

    const uploadPromises = requiredFiles.map((file) => {
      return client.uploadFile(
        `${__dirname}/../${file}`,
        `${deploy[environment].path}/source/${file}`
      );
    });
    console.log('uploading files...');
    await Promise.all(uploadPromises);
    console.log('done.');
  } catch (e) {
    console.error(`Unable to upload files. \n\n${e.message}`);
  }

  try {
    client.close();
  } catch (e) {
    // Close seems to always error. Shouldn't be a big deal since we exit immediately;
  }
};

postDeploy();
