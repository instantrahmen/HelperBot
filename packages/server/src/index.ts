require('dotenv').config({ path: __dirname + '/.env' });

import { initialize } from './bot';
import stringify from 'safe-json-stringify';

const botState = initialize();

import fastify from 'fastify';
import { Debugger } from './bot/components/Debugger';
// import ON_DEATH from 'death';

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
