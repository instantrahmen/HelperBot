// Server only discord utils go here
import { getConfig } from '$lib/utils/config.server';
import type { APIGuild } from 'discord.js';
import { Client, Events, GatewayIntentBits } from 'discord.js';

import type { Fetch } from '$lib/types';
import type { CompleteGuildDataResponse, GuildMemberResponse } from '$lib/types/discord';

const config = getConfig();
const {
  global: { DISCORD_BOT_TOKEN: botToken, DISCORD_CLIENT_ID: clientId },
} = config;

// Set up Discord client
const {
  Guilds,
  GuildMembers,
  GuildMessages,
  MessageContent,
  DirectMessages,
  GuildPresences,
  GuildIntegrations,
} = GatewayIntentBits;

export const createClient = async () => {
  const client = new Client({
    intents: [
      Guilds,
      GuildMembers,
      GuildMessages,
      MessageContent,
      DirectMessages,
      GuildPresences,
      GuildIntegrations,
    ],
  });

  await client.login(botToken);

  return client;
};

// API Helpers
export const fetchGuilds = async (fetch: Fetch, authToken?: string): Promise<APIGuild[]> => {
  const Authorization = authToken ? `Bearer ${authToken}` : `Bot ${botToken}`;

  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization,
      },
    }).then((res) => res.json());
    return res;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

type VerifiedAccessToken =
  | {
      ok: true;
      message: undefined;
    }
  | {
      ok: false;
      message: string;
    };

export const verifyAccessToken = async (
  accessToken: string | undefined
): Promise<VerifiedAccessToken> => {
  if (!accessToken) {
    return { ok: false, message: 'No access token provided' };
  }

  // Check if access token is valid
  const { ok, status } = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!ok) {
    return { ok: false, message: 'Invalid access token' };
  }

  return { ok: true, message: undefined };
};

export const fetchGuildMembers = async (
  client: Client,
  guildId: string
): Promise<GuildMemberResponse[]> => {
  const guild = await client.guilds.fetch(guildId);

  const members = await guild.members.fetch();
  return (
    members
      .map((member) => {
        return {
          id: member.id,
          username: member.user.username,
          displayName: member.displayName,
          avatar: member.displayAvatarURL(),
          data: member,
          joinedTimestamp: member.joinedTimestamp || Date.now(),
          user: member.user,
          status: member.presence?.status || 'offline',
        };
      })
      // Remove Activities member
      .filter((member) => member.username !== 'Activities')
  );
};

export const fetchGuildData = (guildId: string, fetch: Fetch): Promise<APIGuild> => {
  try {
    return fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    }).then((res) => res.json()) as Promise<APIGuild>;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const fetchCompleteGuildData = async ({
  guildId,
  client,
  fetch,
}: {
  guildId: string;
  client: Client;
  fetch: Fetch;
}): Promise<CompleteGuildDataResponse> => {
  const guildPromise = fetchGuildData(guildId, fetch);
  const membersPromise = fetchGuildMembers(client, guildId);

  const [guild, members] = await Promise.all([guildPromise, membersPromise]);
  return { ...guild, members };
};
