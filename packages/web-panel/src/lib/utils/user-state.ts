import { activeGuildStore, type ActiveGuildState } from '$lib/stores/active-guild.svelte';
import type { Fetch } from '$lib/types';
export const saveUserState = async <T>(key: string, state: T, fetch: Fetch): Promise<void> => {
  if (!key || !state) {
    return;
  }

  await fetch('/api/user/state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key, state }),
  });

  return;
};
export const loadUserState = async <T>(key: string, fetch: Fetch): Promise<T | null> => {
  if (!key) {
    return null;
  }

  const res = await fetch(`/api/user/state?key=${key}`).then((res) => res.json());
  if (res) {
    return res.state;
  }
  return null;
};

export const saveGuildState = async (fetch: Fetch) => {
  const { key, state } = activeGuildStore();

  await saveUserState(key, state, fetch);

  return state;
};

export const loadGuildState = async (fetch: Fetch) => {
  const guildState = activeGuildStore();
  const { key } = guildState;

  const state = await loadUserState<ActiveGuildState>(key, fetch);

  if (state) {
    guildState.state = state;
  }
  return guildState.state;
};
