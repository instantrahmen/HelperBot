// breadcrumbs store

import { page } from '$app/stores';
import { createStore } from './store.svelte';

export type Breadcrumb = {
  label: string;
  href?: string;
};

export const breadcrumbsContext = 'BREADCRUMBS_CTX';

export const breadcrumbsStore = createStore<Breadcrumb[]>([], breadcrumbsContext);

export default breadcrumbsStore;

export const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) => {
  const breadcrumbsState = breadcrumbsStore();

  breadcrumbsState.state = breadcrumbs;

  return breadcrumbsState;
};
