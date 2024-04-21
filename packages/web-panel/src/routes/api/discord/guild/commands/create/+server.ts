import { verifyAccessToken } from '$lib/utils/discord.server';
import { ChatInputCommandInteraction, Routes, SlashCommandBuilder } from 'discord.js';
import type { RequestHandler } from './$types';
import { getConfig } from '$lib/utils/config.server';
import { CommandsTypeOptions, type CommandsRecord } from '$lib/types/gen/pocketbase-types';
import { listenForAllCommands } from '$lib/utils/commands.server';

// create a new slash command in the guild
export const POST: RequestHandler = async ({ locals, request, cookies }) => {
  const client = locals.discord.client;
  const pb = locals.pb;
  const body = await request.json();
  const rest = locals.discord.rest;

  const accessToken = cookies.get('accessToken');

  const { ok, message } = await verifyAccessToken(accessToken);

  if (!ok) {
    return new Response(JSON.stringify({ message }), { status: 401 });
  }

  if (!locals.user) {
    return new Response(JSON.stringify({ message: 'Not logged in' }), {
      status: 401,
    });
  }

  const {
    global: { DISCORD_CLIENT_ID: clientId },
  } = getConfig();

  if (!client || !rest) {
    return new Response(JSON.stringify({ message: 'Discord client not initialized' }), {
      status: 500,
    });
  }

  const guildId = body.guildId;
  const name = body.name;
  const description = body.description;
  const options = body.options || [];
  const commandTypes: CommandsTypeOptions[] = body.commandTypes || [CommandsTypeOptions.slash];
  const reply = body.reply;

  let data: any = {};

  try {
    if (commandTypes.includes(CommandsTypeOptions.slash)) {
      data = await createSlashCommand({
        clientId,
        guildId,
        name,
        description,
        options,
        dmPermission: false,
        rest,
      });
    }

    // Create a command in the database
    const command = await locals.pb.collection('commands').create<CommandsRecord>({
      name: name,
      guild: guildId,
      data: JSON.stringify(data),
      reply,
      createdBy: locals.pb.authStore.model?.id,
      type: commandTypes,
    });

    await listenForAllCommands(client);

    console.log('successfully created command', command);

    return new Response(JSON.stringify({ command }), { status: 200 });
  } catch (err: any) {
    console.log('failed to create slash command', err);
    console.error(err);

    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
};

const createSlashCommand = async ({
  clientId,
  guildId,
  name,
  description,
  options = [],
  dmPermission = false,
  rest,
}: {
  clientId: string;
  guildId: string;
  name: string;
  description: string;
  options?: any[];
  dmPermission?: boolean;
  rest: import('discord.js').REST;
}) => {
  return rest.post(Routes.applicationGuildCommands(clientId, guildId), {
    body: {
      name,
      description,
      options,
    },
  });
};
