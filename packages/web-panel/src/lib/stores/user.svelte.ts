import type { UsersResponse } from '$lib/types/gen/pocketbase-types';
import { createStore } from './store.svelte';

const USER_CTX = 'USER_CTX';

interface UserState {
  user?: UsersResponse;
  auth?: {
    accessToken: string;
    meta: any;
  };
}

export const userStore = createStore<UserState>({}, USER_CTX);
export default userStore;
