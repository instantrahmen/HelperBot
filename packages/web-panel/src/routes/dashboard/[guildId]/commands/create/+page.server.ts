import { CommandsTypeOptions } from '$lib/types/gen/pocketbase-types';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

// form actions

export const actions = {
  default: async ({ request, locals, fetch, params }) => {
    // create command
    const body = await request.formData();
    const guildId = params.guildId;

    const name = body.get('commandName');
    const reply = body.get('response') || '';
    const commandType: CommandsTypeOptions = body.get('commandType') as CommandsTypeOptions;
    const description = reply || ''; // TODO: Add description to form
    const options: never[] = []; // TODO: Add options to form

    if (!name || !reply || !commandType || !guildId) {
      console.log('missing data', { name, reply, commandType, guildId });
      return fail(400, { missing: true });
    }

    try {
      fetch('/api/discord/guild/commands/create', {
        method: 'POST',
        body: JSON.stringify({
          guildId,
          name,
          description,
          options,
          reply,
          commandTypes: [commandType],
        }),
      });

      throw redirect(302, `/dashboard/${guildId}/commands`);
    } catch (err: any) {
      console.error(err);
      return fail(500, { message: err.message });
    }
  },
};
