import { serializeNonPOJOs } from '$lib/utils/';
import { pb } from '$lib/pocketbase.server';
import { getClient, createDiscordRESTClient } from '$lib/utils/discord.server';

import {
  CommandsTypeOptions,
  type CommandsRecord,
  type CommandsResponse,
} from '$lib/types/gen/pocketbase-types';
import type { CacheType, Client, Interaction, Message } from 'discord.js';
import { listenForAllCommands } from '$lib/utils/commands.server';

let initialized = false;
const init = async ({ client }: { client: Client }) => {
  if (initialized) return;
  initialized = true;

  listenForAllCommands(client);
};

export const handle = async ({ event, resolve }) => {
  event.locals.pb = pb;
  if (!event.locals.discord) event.locals.discord = { client: undefined, rest: undefined };
  if (!event.locals.discord.client) event.locals.discord.client = await getClient();
  if (!event.locals.discord.rest) event.locals.discord.rest = createDiscordRESTClient();

  await init({ client: event.locals.discord.client });

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
