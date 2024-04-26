// get

import { getClient } from '$lib/utils/discord.server';

export const GET = async ({ locals, url }) => {
  const client = await getClient();

  // client.
  return new Response('Hello, world!');
};
