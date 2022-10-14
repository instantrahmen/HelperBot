// Copy required non-commited files to server. Requires filling out deploy.config.js and running `pm2 deploy setup` first
// scp file.txt remote_username@10.10.0.2:/remote/directory
const { Client } = require('node-scp');
const deploy = require('./deploy.config');
const fs = require('fs');

const requiredFiles = ['.config.yml'];

const environment = process.argv[2] || 'production';

const postDeploy = async () => {
  // Connect to the server

  console.log({ deploy, environment });

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
        `./${file}`,
        `${deploy[environment].path}/source/${file}`
        // options?: TransferOptions
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

  process.exit(0);
};

postDeploy();
