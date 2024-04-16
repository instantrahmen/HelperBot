import { serializeNonPOJOs } from '$lib/utils/';
import { pb } from '$lib/pocketbase.server';
import { createClient } from '$lib/utils/discord.server';

export const handle = async ({ event, resolve }) => {
  event.locals.pb = pb;
  if (!event.locals.discord) event.locals.discord = { client: undefined };
  if (!event.locals.discord.client) event.locals.discord.client = await createClient();

  // Load auth store from cookies and refresh if necessary
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
  const isProd = process.env.NODE_ENV === 'production';
  const response = await resolve(event);

  // Lax is unforunately required for the authstore to work properly after a redirect.
  // More info: https://github.com/pocketbase/pocketbase/discussions/903
  response.headers.append(
    'set-cookie',
    event.locals.pb.authStore.exportToCookie({ secure: isProd, sameSite: 'lax' })
  );

  return response;
};
