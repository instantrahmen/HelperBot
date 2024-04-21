import type { UserType } from '$lib/types';
import type { APIGuild } from 'discord-api-types/v10';
import { createStore } from './store.svelte';

const USER_CTX = 'USER_CTX';

export interface MetaGuilds {
  botAccess: boolean;
  guild: APIGuild;
  id: string;
  name: string;
}

export interface AuthMeta {
  guilds?: MetaGuilds[];
}

export interface UserState {
  user?: UserType;
  auth?: {
    accessToken: string;
    meta: UserType['meta'] & AuthMeta;
  };
}

export const userStore = createStore<UserState>({}, USER_CTX);
export default userStore;
