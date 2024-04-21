import type { CompleteGuildDataResponse } from '$lib/types/discord';
import { fetchCompleteGuildData, verifyAccessToken } from '$lib/utils/discord.server';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url, fetch, cookies }) => {
  const accessToken = cookies.get('accessToken') || url.searchParams.get('accessToken');

  const guildId = url.searchParams.get('guildId');

  console.log({
    accessToken,
  });
  const { ok, message } = await verifyAccessToken(accessToken || '');

  if (!ok) {
    return new Response(JSON.stringify({ message }), { status: 401 });
  }

  if (!guildId) {
    return new Response(JSON.stringify({ message: 'No guild id provided' }), { status: 400 });
  }

  if (!locals.discord.client) {
    return new Response(JSON.stringify({ message: 'No discord client' }), { status: 500 });
  }

  try {
    const completeGuildData: CompleteGuildDataResponse = await fetchCompleteGuildData({
      guildId,
      client: locals.discord.client,
      fetch,
    });

    return new Response(JSON.stringify(completeGuildData, null, 2));
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
};
