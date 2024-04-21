// commands load function

import {
  type CommandsResponse,
  type CommandsRecord,
  type UsersResponse,
} from '$lib/types/gen/pocketbase-types';

export const load = async ({ locals, params, fetch }) => {
  const { guildId }: { guildId: string } = params;

  const pb = locals.pb;

  const commands = await pb.collection('commands').getFullList<
    CommandsResponse<
      {},
      {
        created_by: UsersResponse;
      }
    >
  >(200, {
    filter: `guild = "${guildId}"`,
    sort: '-created',
    expand: 'created_by',
  });

  return {
    user: locals.user,
    guildId,
    commands,
  };
};
