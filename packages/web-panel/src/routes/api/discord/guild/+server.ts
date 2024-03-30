import { getConfig } from '$lib/utils/config.server';

export const GET = async ({ cookies, locals, url, fetch, request }) => {
  const guildId = url.searchParams.get('guildId');
  const {
    global: { DISCORD_BOT_TOKEN: botToken },
  } = getConfig();
  const accessToken =
    cookies.get('accessToken') || request.headers.get('authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    return new Response(JSON.stringify({ message: 'No access token provided. Please login' }), {
      status: 401,
    });
  }

  // Check if access token is valid
  const { ok, status } = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!ok) {
    return new Response(JSON.stringify({ message: 'Invalid access token' }), { status });
  }

  if (!guildId) {
    return new Response(JSON.stringify({ message: 'No guild id provided' }), { status: 400 });
  }

  const guildData = await fetchGuildData(botToken, guildId);

  return new Response(JSON.stringify(guildData));
};

const fetchGuildData = async (accessToken: string, guildId: string) => {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: {
        Authorization: `Bot ${accessToken}`,
      },
    }).then((res) => res.json());
    return res;
  } catch (err) {
    console.error(err);
    return {};
  }
};
