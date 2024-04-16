import { fetchGuildData, verifyAccessToken } from '$lib/utils/discord.server';

export const GET = async ({ cookies, locals, url, fetch, request }) => {
  const guildId = url.searchParams.get('guildId');

  const accessToken =
    cookies.get('accessToken') || request.headers.get('authorization')?.replace('Bearer ', '');

  const { ok, message } = await verifyAccessToken(accessToken);

  if (!ok) {
    return new Response(JSON.stringify({ message }), { status: 401 });
  }

  if (!guildId) {
    return new Response(JSON.stringify({ message: 'No guild id provided' }), { status: 400 });
  }

  const guildData = await fetchGuildData(guildId, fetch);

  return new Response(JSON.stringify(guildData));
};
