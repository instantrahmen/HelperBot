// load function

import { getConfig } from '$lib/utils/config.server';
import { redirect } from '@sveltejs/kit';
import type { APIGuild, APIGuildMember } from 'discord-api-types/v10';
import { GuildSystemChannelFlags } from 'discord.js';

export const load = async ({ locals, params, fetch }) => {
  const { guildId }: { guildId: string } = params;

  const {
    global: { DISCORD_CLIENT_ID: clientId },
  } = getConfig();

  if (!locals.user) {
    throw redirect(302, '/auth');
  }

  return {
    user: locals.user,
    meta: (locals.user.meta || {}) as any, // TODO: create type for meta
    guildId,
    clientId,
  };
};
