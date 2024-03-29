import type { UsersResponse } from '$lib/types/gen/pocketbase-types';
import { redirect, type Actions, fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (locals.user) {
    redirect(303, '/');
  }

  return {
    // form,
  };
};

export const actions: Actions = {
  default: async ({ cookies, url, locals }) => {
    const authMethods = await locals.pb.collection('users').listAuthMethods();

    const redirectURL = `${url.origin}/auth/callback`;
    const discordAuthProvider = authMethods.authProviders.find(
      (provider) => provider.name === 'discord'
    );

    if (!discordAuthProvider) {
      throw fail(500, { message: 'Discord provider not found' });
    }

    const authProviderUrl = `${discordAuthProvider.authUrl}${redirectURL}`;

    const state = discordAuthProvider.state;
    const verifier = discordAuthProvider.codeVerifier;

    cookies.set('state', state, {
      path: '/',
    });

    cookies.set('verifier', verifier, {
      path: '/',
    });

    throw redirect(302, authProviderUrl);
  },
};

const authWithDiscord = async (locals: App.Locals) => {
  try {
    const res = await locals.pb.collection('users').authWithOAuth2({
      provider: 'discord',
      scopes: ['identify', 'email', 'guilds'],
    });

    locals.user = res.record;
    locals.oauth2State = { accessToken: res.meta?.accessToken, meta: res.meta };
  } catch (err: any) {
    throw err;
  }
};
