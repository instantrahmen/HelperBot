import { getDiscordProvider } from '$lib/utils/auth';
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

    const userGuilds: Partial<APIGuild>[] = await fetch(
      'https://discord.com/api/v10/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${res.meta?.accessToken}`,
        },
      }
    ).then((res) => res.json());

    const adminPermissionsCode = '562949953421311';

    const adminGuilds = userGuilds.filter((guild) => guild.permissions === adminPermissionsCode);

    locals.user = await locals.pb
      .collection('users')
      .update(res.record.id, { meta: { guilds: adminGuilds || [] } });
    locals.oauth2State = { accessToken: res.meta?.accessToken, meta: res.meta };

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
