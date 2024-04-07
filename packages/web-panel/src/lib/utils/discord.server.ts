// Server only discord utils go here
import { getConfig } from '$lib/utils/config.server';
import type { APIGuild } from 'discord.js';

const config = getConfig();
const {
  global: { DISCORD_BOT_TOKEN: botToken, DISCORD_CLIENT_ID: clientId },
} = config;

type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;

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

export const createBotInviteLink = () =>
  `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot`;

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

  return { ok: true };
};
