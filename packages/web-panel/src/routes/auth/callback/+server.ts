import type { Meta } from '$lib/types';
import { getDiscordProvider } from '$lib/utils/auth';
import { fetchGuilds } from '$lib/utils/discord.server';
import { redirect } from '@sveltejs/kit';
import type { APIGuild } from 'discord-api-types/v10';
export const GET = async ({ cookies, url, locals, fetch }) => {
  // get data from cookies and url
  const redirectURL = `${url.origin}/auth/callback`;
  const expectedState = cookies.get('state');
  const expectedVerifier = cookies.get('verifier');

  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!expectedState || !expectedVerifier || !state || !code) {
    console.error('Missing parameters');
    throw redirect(302, '/');
  }

  const discordAuthProvider = await getDiscordProvider();

  // Login with OAuth2 code
  try {
    const res = await locals.pb
      .collection('users')
      .authWithOAuth2Code(discordAuthProvider!.name, code, expectedVerifier, redirectURL);

    if (!res.meta?.accessToken) throw new Error('No access token provided');

    const userGuilds = await fetchGuilds(fetch, res.meta?.accessToken);
    const botGuilds = (await fetchGuilds(fetch)).map((guild) => guild.id);

    // filter guilds in which the user has admin permissions and sort them with bot access first
    const adminPermissionsCodes = ['562949953421311', '1125899906842623'];
    const adminGuilds = userGuilds
      .filter((guild) => adminPermissionsCodes.includes(guild.permissions || '0'))
      .map((guild) => ({
        id: guild.id,
        name: guild.name,
        botAccess: botGuilds.includes(guild.id),
        guild,
      }))
      .sort((a, b) => (a.botAccess ? -1 : 1));

    console.log({
      adminGuilds,
      userGuilds,
    });

    const meta: Meta = res.meta as Meta;

    locals.user = await locals.pb.collection('users').update(res.record.id, {
      meta: { guilds: adminGuilds || [] },
      name: meta.rawUser.global_name || meta.rawUser.username,
      avatar: meta.avatarUrl,
    });

    cookies.set('accessToken', res.meta?.accessToken, {
      path: '/',
    });
    cookies.set('meta', JSON.stringify(res.meta), {
      path: '/',
    });

    await locals.pb.collection('users').authRefresh();

    console.log('success');
  } catch (err: any) {
    console.error(err);
    console.log('ERROR');
    throw redirect(302, '/auth');
  }

  throw redirect(303, '/');
};
