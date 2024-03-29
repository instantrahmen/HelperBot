import { getDiscordProvider } from '$lib/utils/auth';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, url, locals }) => {
  const redirectURL = `${url.origin}/auth/callback`;
  const allCookies = cookies.getAll();
  const expectedState = cookies.get('state');
  const expectedVerifier = cookies.get('verifier');

  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  // return new Response(
  //   JSON.stringify({
  //     state,
  //     code,
  //     expectedState: expectedState,
  //     expectedVerifier: expectedVerifier,
  //     redirectURL: redirectURL,
  //     allCookies: allCookies,
  //   })
  // );
  if (!expectedState || !expectedVerifier || !state || !code) {
    console.error('Missing parameters');
    throw redirect(302, '/');
  }

  const discordAuthProvider = await getDiscordProvider();

  try {
    const res = await locals.pb
      .collection('users')
      .authWithOAuth2Code(discordAuthProvider!.name, code, expectedVerifier, redirectURL);

    locals.oauth2State = { accessToken: res.meta?.accessToken, meta: res.meta };

    locals.user = res.record;
    await locals.pb.collection('users').authRefresh();

    console.log(locals.user);
    console.log('success');
  } catch (err: any) {
    console.error(err);
    console.log('ERROR');
    throw redirect(302, '/auth');
  }

  redirect(303, '/');
};
