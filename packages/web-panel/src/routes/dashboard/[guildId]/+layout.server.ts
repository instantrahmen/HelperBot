// load function

import { getConfig } from '$lib/utils/config.server';
import { redirect } from '@sveltejs/kit';
import { fetchGuildData } from '$lib/stores/guild-data.svelte';

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

  let guildData = null;
  try {
    guildData = await fetchGuildData(guildId, null, {
      serverFetch: fetch,
    });
  } catch (err) {
    console.error(err);
    guildData = null;
  }

  return {
    user: locals.user,
    meta: locals.user.meta || {},
    guildId,
    clientId,
    guildData,
  };
};
