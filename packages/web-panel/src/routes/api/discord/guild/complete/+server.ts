import type { CompleteGuildDataResponse } from '$lib/types/discord';
import {
  fetchCompleteGuildData,
  verifyAccessToken,
  type VerifiedAccessToken,
} from '$lib/utils/discord.server';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url, fetch, cookies }) => {
  const accessToken = cookies.get('accessToken') || url.searchParams.get('accessToken');

  const guildId = url.searchParams.get('guildId');

  console.log({
    accessToken,
  });

  const { ok, message } = await verifyAccessToken(accessToken || '', guildId || 'unknown');

  // const { ok, message } = await tryToVerifyAccessToken(5, accessToken || '', guildId);

  if (!ok) {
    console.log('invalid access token', accessToken);
    console.warn(message);
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

const tryToVerifyAccessToken = async (
  maxTries: number,
  accessToken: string,
  guildId: string | null,
  lastError?: string
): Promise<VerifiedAccessToken> => {
  if (maxTries <= 0) {
    return { ok: false, message: lastError || 'Invalid access token' };
  }

  console.log('tries left', maxTries);

  try {
    const { ok, message } = await verifyAccessToken(accessToken || '', guildId ?? 'unknown');

    if (!ok) {
      console.log('invalid access token', accessToken);
      console.warn(message);
      return tryToVerifyAccessToken(maxTries - 1, accessToken, guildId, message);
    } else {
      console.log('success', accessToken);
      return { ok, message };
    }
  } catch (err: any) {
    return tryToVerifyAccessToken(maxTries - 1, accessToken, guildId, err.message);
  }
};
