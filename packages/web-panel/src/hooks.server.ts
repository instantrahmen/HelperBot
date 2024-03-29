import PocketBase from 'pocketbase';

import type { TypedPocketBase } from '$lib/types/gen/pocketbase-types';

import { PUBLIC_PB_URL as PB_URL } from '$env/static/public';
import { serializeNonPOJOs } from '$lib/utils/';
import { pb } from '$lib/pocketbase';

export const handle = async ({ event, resolve }) => {
  // event.locals.pb = new PocketBase(PB_URL) as TypedPocketBase;

  event.locals.pb = pb;

  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
  try {
    event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
  } catch (_) {
    event.locals.pb.authStore.clear();
  }

  if (event.locals.pb.authStore.isValid) {
    event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
  } else {
    event.locals.user = undefined;
  }

  const response = await resolve(event);

  response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

  return response;
};
