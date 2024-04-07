// import { createStore } from './store.svelte';
import type { Selected } from 'bits-ui';
import { createStore } from './store.svelte';
import type { APIGuild, APIGuildMember } from 'discord-api-types/v10';

interface ActiveGuildState {
  selected: Selected<string>;
  guildData: APIGuild | null | 'loading';
  guildMembers: APIGuildMember[];
}

export const activeGuildStore = createStore<ActiveGuildState>(
  {
    selected: { value: '', label: '' },
    guildData: null,
    guildMembers: [],
  },
  'ACTIVE_GUILD_CTX'
);

export const fetchGuildData = async (accessToken: string, guildId?: string) => {
  guildId = guildId || activeGuildStore().state.selected.value;
  const guildStore = activeGuildStore();

  guildStore.state.guildData = 'loading';

  if (!guildId) {
    guildStore.state.guildData = null;
    return null;
  }

  try {
    const res = await fetch(`/api/discord/guild?guildId=${guildId}`).then((res) => res.json());
    guildStore.state.guildData = res;
    return res;
  } catch (err) {
    console.error(err);
    guildStore.state.guildData = null;
    return null;
  }
};

export const fetchGuildMembers = async (accessToken: string, guildId?: string) => {
  guildId = guildId || activeGuildStore().state.selected.value;
  const guildStore = activeGuildStore();

  if (!guildId) {
    guildStore.state.guildMembers = [];
    return null;
  }

  try {
    const res = await fetch(`/api/discord/guild/members?guildId=${guildId}`).then((res) =>
      res.json()
    );
    guildStore.state.guildMembers = res;
    return res;
  } catch (err) {
    console.error(err);
    guildStore.state.guildMembers = [];
    return null;
  }
};
export default activeGuildStore;
