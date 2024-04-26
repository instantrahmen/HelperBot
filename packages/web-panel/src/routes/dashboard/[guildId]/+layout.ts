// import type { APIGuild, APIGuildMember } from 'discord-api-types/v10';

import type { APIGuild } from 'discord-api-types/v10';

export const load = async ({ data, params, fetch }) => {
  console.log('load', params);
  const { guildId }: { guildId: string } = params;

  return {
    user: data.user,
    guildId,
    meta: data.meta,
    clientId: data.clientId,
    guildData: data.guildData,
  };
};
