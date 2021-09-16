require('dotenv').config({ path: __dirname + '/.env' });
// import server from "./graphql/server";
import { initializeBot } from './bot';
import fastify from 'fastify';

const app = fastify({ logger: true });

initializeBot();

// Declare a route
app.get('/', async (req, res) => {
  return { hello: 'world' };
});

app.get('/authenticate', async (req, res) => {
  app.log.info({ query: req.query });
  return { ...(req.query as any) };
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
