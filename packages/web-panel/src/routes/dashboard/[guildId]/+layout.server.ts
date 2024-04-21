// load function

import { getConfig } from '$lib/utils/config.server';
import { redirect } from '@sveltejs/kit';
export const ssr = false;

export const load = async ({ locals, params, fetch }) => {
  const { guildId }: { guildId: string } = params;

  const {
    global: { DISCORD_CLIENT_ID: clientId },
  } = getConfig();

  // protect from unauthorized access
  if (!locals.user) {
    throw redirect(302, '/auth');
  }

  return {
    user: locals.user,
    meta: locals.user.meta || {},
    guildId,
    clientId,
  };
};
