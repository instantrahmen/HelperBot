import { getConfig } from '$lib/utils/config.server';
import { verifyAccessToken } from '$lib/utils/discord.server';

export const GET = async ({ cookies, locals, url, fetch, request }) => {
  const guildId = url.searchParams.get('guildId');
  const {
    global: { DISCORD_BOT_TOKEN: botToken },
  } = getConfig();
  const accessToken =
    cookies.get('accessToken') || request.headers.get('authorization')?.replace('Bearer ', '');

  const { ok, message } = await verifyAccessToken(accessToken);

  if (!ok) {
    return new Response(JSON.stringify({ message }), { status: 401 });
  }

  if (!guildId) {
    return new Response(JSON.stringify({ message: 'No guild id provided' }), { status: 400 });
  }

  const guildData = await fetchGuildMembers(botToken, guildId);

  return new Response(JSON.stringify(guildData));
};

const fetchGuildMembers = async (accessToken: string, guildId: string) => {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members`, {
      headers: {
        Authorization: `Bot ${accessToken}`,
      },
    }).then((res) => res.json());
    return res;
  } catch (err) {
    console.error(err);
    return [];
  }
};
