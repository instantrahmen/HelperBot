import type { UsersResponse } from '$lib/types/gen/pocketbase-types';
import { createDiscordOath2Url } from '$lib/utils/auth';
import { redirect, type Actions, fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (locals.user) {
    redirect(303, '/');
  }

  return {};
};

export const actions: Actions = {
  // Discord OAuth login action
  login: async ({ cookies, url, locals }) => {
    const redirectURL = `${url.origin}/auth/callback`;

    const [discordAuthProvider, authProviderUrl] = await createDiscordOath2Url(redirectURL, [
      'identify',
      'email',
      'guilds',
    ]);

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
