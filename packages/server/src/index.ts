require('dotenv').config({ path: __dirname + '/.env' });

import { initialize } from './bot';
import stringify from 'safe-json-stringify';
import fastify from 'fastify';
import { mpState } from './bot/components/MusicPlayer';

const botState = initialize();

import { Debugger } from './bot/components/Debugger';
import commandState from './bot/components/Commands';

const app = fastify({ logger: true });

app.get('/', async (req, res) => {
  return { running: 'true' };
});

app.get('/authenticate', async (req: any) => {
  app.log.info({ query: req.query });
  return { ...(req.query as any) };
});

app.get('/bot/info', async () => {
  return stringify(botState, null, 2);
});

app.get('/bot/debug', async () => {
  return stringify(Debugger.inMemoryDebugLog, null, 2);
});

// Run the server
const start = async () => {
  try {
    await app.listen({
      port: 5000,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

process.on('SIGINT', async () => {
  console.log('Caught interrupt signal');
  console.log('Cleaning up and exiting...');

  console.log({ mpState });

  console.log('Disconnecting music players...');
  Object.keys(mpState.componentsByGuild).forEach((key) => {
    mpState.componentsByGuild[key].disconnect();
    mpState.componentsByGuild[key].destroy();
  });

  console.log('unregistering commands...');

  await commandState.deployAll(true);

  console.log('done.');
  process.exit();
});
