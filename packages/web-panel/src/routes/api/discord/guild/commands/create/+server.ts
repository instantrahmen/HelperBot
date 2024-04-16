import { verifyAccessToken } from '$lib/utils/discord.server';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return new Response();
};

// create a new slash command in the guild
export const POST: RequestHandler = async ({ locals, request, fetch, cookies }) => {
  const body = await request.json();
  const client = locals.discord.client;

  const guildId = body.guildId;
  const name = body.name;
  const description = body.description;
  const options = body.options;

  const execute = async (interaction: ChatInputCommandInteraction) => {
    console.log('shiro is a cutie');
  };

  const command = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .setDMPermission(false)
    .setOptions(options);

  const accessToken = cookies.get('accessToken');

  const { ok, message } = await verifyAccessToken(accessToken);

  if (!ok) {
    return new Response(JSON.stringify({ message }), { status: 401 });
  }

  return new Response();
};
