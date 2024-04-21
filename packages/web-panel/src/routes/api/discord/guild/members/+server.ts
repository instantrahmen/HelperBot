import type { GuildMemberResponse } from '$lib/types/discord';
import { getClient, fetchGuildMembers, verifyAccessToken } from '$lib/utils/discord.server';

export const GET = async ({ cookies, locals, url, request }): Promise<Response> => {
  const guildId = url.searchParams.get('guildId');

  const accessToken =
    cookies.get('accessToken') || request.headers.get('authorization')?.replace('Bearer ', '');

  const { ok, message } = await verifyAccessToken(accessToken);

  if (!locals.discord.client) {
    locals.discord.client = await getClient();
  }

  if (!ok) {
    return new Response(JSON.stringify({ message }), { status: 401 });
  }

  if (!guildId) {
    return new Response(JSON.stringify({ message: 'No guild id provided' }), { status: 400 });
  }

  const guildData = await fetchGuildMembers(locals.discord.client, guildId);

  return new Response(JSON.stringify(guildData));
};
