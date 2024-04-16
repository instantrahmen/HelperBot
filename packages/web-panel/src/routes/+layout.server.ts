import type { LayoutServerLoad } from './$types';
import { getConfig } from '$lib/utils/config.server';
export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const accessToken = cookies.get('accessToken') || '';

  const {
    global: { DISCORD_CLIENT_ID: clientId },
  } = getConfig();

  return {
    user: locals.user,
    accessToken,
    clientId,
  };
};
