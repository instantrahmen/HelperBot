import { initialize } from './bot';
import stringify from 'safe-json-stringify';
import fastify from 'fastify';
import config from './bot/config';

import { Debugger } from './bot/components/Debugger';
import commandState from './bot/components/Commands';

const serializeWithBigInts = (k: string, v: unknown) => {
  if (typeof v === 'bigint') {
    return v.toString();
  }
  return v;
};

const app = async () => {
  const { environment } = config;
  console.log('running in', environment);

  const app = fastify({ logger: true });

  let botState: any;
  if (process.argv.includes('--cleanup')) {
    // clean up
    console.log('cleaning up...');
    await commandState.deployGlobal(true);
    app.close();
    process.exit(0);
  } else {
    botState = initialize();
  }

  app.get('/', async (req, res) => {
    return { running: 'true' };
  });

  app.get('/authenticate', async (req: any) => {
    app.log.info({ query: req.query });
    return { ...(req.query as any) };
  });

  app.get('/bot/info', async () => {
    return stringify(botState, serializeWithBigInts, 2);
  });

  app.get('/bot/debug', async () => {
    return stringify(Debugger.inMemoryDebugLog, serializeWithBigInts, 2);
  });

  return app;
};

export const viteNodeApp = app();
