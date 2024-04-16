import { createStore, type Store } from './store.svelte';
import { type CompleteGuildDataResponse } from '$lib/types/discord';

export const guildDataContext = 'GUILD_DATA_CTX';

type GuildDataState = CompleteGuildDataResponse | 'loading' | null;
export const guildDataStore = createStore<GuildDataState>('loading', guildDataContext);
// export const guildMembersStore = createStore<GuildDataState>('loading', guildDataContext);

export const fetchGuildData = async (guildId: string, guildState: Store<GuildDataState>) => {
  // if (guildState.state !== 'loading') guildState.state = 'loading';
  guildState.state = 'loading';

  try {
    const res = await fetch(`/api/discord/guild/complete?guildId=${guildId}`).then((res) =>
      res.json()
    );
    guildState.state = res as CompleteGuildDataResponse;
    return res;
  } catch (err) {
    console.error(err);
    guildState.state = null;
    return null;
  }
};

export default guildDataStore;
