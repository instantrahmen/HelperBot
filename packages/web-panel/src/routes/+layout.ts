// +layout.ts
import { type ActiveGuildState, activeGuildContext } from '$lib/stores/active-guild.svelte';
import { loadUserState } from '$lib/utils/user-state';
export const load = async ({ fetch, data: { user, accessToken, clientId } }) => {
  return {
    user,
    accessToken,
    clientId,
  };
};
