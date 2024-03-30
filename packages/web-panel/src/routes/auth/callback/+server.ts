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

    // const userGuilds: Partial<APIGuild>[] = await fetch(
    //   'https://discord.com/api/v10/users/@me/guilds',
    //   {
    //     headers: {
    //       Authorization: `Bearer ${res.meta?.accessToken}`,
    //     },
    //   }
    // ).then((res) => res.json());

    const userGuilds = await fetchGuilds(fetch, res.meta?.accessToken);
    const botGuilds = (await fetchGuilds(fetch)).map((guild) => guild.id);

    // filter guilds in which the user has admin permissions and sort them with bot access first
    const adminPermissionsCode = '562949953421311';
    const adminGuilds = userGuilds
      .filter((guild) => guild.permissions === adminPermissionsCode)
      .map((guild) => ({
        id: guild.id,
        name: guild.name,
        botAccess: botGuilds.includes(guild.id),
        guild,
      }))
      .sort((a, b) => (a.botAccess ? -1 : 1));

    locals.user = await locals.pb
      .collection('users')
      .update(res.record.id, { meta: { guilds: adminGuilds || [] } });

    // set oauth2 state
    // locals.oauth2State = { accessToken: res.meta?.accessToken, meta: res.meta };
    // locals.accessToken = res.meta?.accessToken || '';
    // locals.meta = res.meta || undefined;
    cookies.set('accessToken', res.meta?.accessToken, {
      path: '/',
    });
    cookies.set('meta', JSON.stringify(res.meta), {
      path: '/',
    });

    await locals.pb.collection('users').authRefresh();

    console.log(locals.user);
    console.log('success');
  } catch (err: any) {
    console.error(err);
    console.log('ERROR');
    throw redirect(302, '/auth');
  }

  throw redirect(303, '/');
};
