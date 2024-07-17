import { botState } from './bot/components/Bot';
import { initialize } from './bot';
import stringify from 'safe-json-stringify';
import fastify from 'fastify';
import config from './bot/config';
import envConfig from '@helper/config';

import { Debugger } from './bot/components/Debugger';
import commandState from './bot/components/Commands';
import { Client } from 'discord.js';
import HelperEmotionsController from './bot/state/emotions-state';

const serializeWithBigInts = (k: string, v: unknown) => {
  if (typeof v === 'bigint') {
    return v.toString();
  }
  return v;
};

const app = async () => {
  const { environment } = config;
  console.log('running in', environment);
  // console.log('config', config);

  const app = fastify({ logger: true });

  console.log('args', process.argv);
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
// Run the server
// const start = async () => {
//   try {
//     await app.listen({
//       port: 5000,
//     });
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };

// start();

// process.on('SIGINT', async () => {
//   console.log('Caught interrupt signal');
//   console.log('Cleaning up and exiting...');

//   console.log({ mpState });

//   console.log('Disconnecting music players...');
//   Object.keys(mpState.componentsByGuild).forEach((key) => {
//     mpState.componentsByGuild[key].disconnect();
//     mpState.componentsByGuild[key].destroy();
//   });

//   console.log('unregistering commands...');

// await commandState.deployAll(true);

//   console.log('done.');
//   process.exit();
// });

export const viteNodeApp = app();
