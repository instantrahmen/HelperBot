// import { createStore } from './store.svelte';
import type { Selected } from 'bits-ui';
import { createStore, type Store } from './store.svelte';
import type { APIGuild } from 'discord-api-types/v10';
import type { GuildMemberResponse } from '$lib/types/discord';
import { browser } from '$app/environment';
import { type MetaGuilds, userStore, type UserState } from './user.svelte';

export type ActiveGuildState = {
  selected?: Selected<string> & MetaGuilds;
  // guildData: APIGuild | null;
  // guildMembers: GuildMemberResponse[];
  // info: GuildInfo | null;
};

export const activeGuildContext = 'ACTIVE_GUILD_CTX';

export const activeGuildStore = createStore<ActiveGuildState>({}, activeGuildContext);

export const setActiveGuild = (
  guildId: string,
  guildState: Store<ActiveGuildState>,
  userState: Store<UserState>
) => {
  const guilds = userState.state.auth?.meta.guilds || [];
  const guild = guilds.find((g) => g.id === guildId);

  if (guild) {
    guildState.state.selected = { value: guild.id, label: guild.name, ...guild };
  }
};

export default activeGuildStore;
