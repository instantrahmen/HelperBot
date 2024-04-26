// sidebar store

import { createStore } from './store.svelte';

export type SidebarState = {
  open: boolean;
};

export const sidebarStore = createStore<SidebarState>({ open: false }, 'SIDEBAR_CTX');

export const setSidebarOpen = (open: boolean) => {
  let sidebarState = sidebarStore();
  sidebarState.state.open = open;
};
