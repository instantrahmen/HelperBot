import { createStore, type Store } from './store.svelte';
import { type CompleteGuildDataResponse } from '$lib/types/discord';
import { goto } from '$app/navigation';
import { userStore } from './user.svelte';
import { browser } from '$app/environment';
import type { Fetch } from '$lib/types';
export const guildDataContext = 'GUILD_DATA_CTX';

export type GuildDataState = CompleteGuildDataResponse | 'loading' | null;
export const guildDataStore = createStore<GuildDataState>('loading', guildDataContext);

const mockGuildState = () => ({
  state: null,
  key: '',
});

type FetchGuildDataOptions = {
  serverFetch?: Fetch;
  guildData?: CompleteGuildDataResponse;
};

/**
 * Fetches guild data based on the provided guildId and guildState.
 *
 * @param guildId - The ID of the guild to fetch data for.
 * @param guildState - A guild data store. Leave as null to do a stateless fetch without a store.
 * @param options - Additional options for fetching guild data.
 * @returns The fetched guild data or null if unsuccessful.
 */
export const fetchGuildData = async (
  guildId: string,
  guildState: Store<GuildDataState> | null,
  { guildData, serverFetch }: FetchGuildDataOptions = {}
): Promise<CompleteGuildDataResponse | null> => {
  const relativeFetch = serverFetch || fetch;

  if (guildData) {
    if (!guildState) {
      return guildData;
    }
    guildState.state = guildData;
    return guildData;
  }

  if (!guildState) {
    guildState = mockGuildState();
  }

  if (!guildId) {
    guildState.state = null;
    return null;
  }

  guildState.state = 'loading';

  try {
    const res = await relativeFetch(`/api/discord/guild/complete?guildId=${guildId}`).then((res) =>
      res.json()
    );
    guildState.state = res as CompleteGuildDataResponse;
    return res as CompleteGuildDataResponse;
  } catch (err) {
    console.error(err);
    console.error('Auth token likely expired, logging out');
    guildState.state = null;

    if (browser) {
      throw goto('/auth/logout');
    } else {
      throw err;
    }
  }
};

export default guildDataStore;
