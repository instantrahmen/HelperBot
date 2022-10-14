import config from '../config';

export * from './helpers';

const {
  global: { DISCORD_CLIENT_ID: clientId },
} = config;

export const oauth2URL = (redirect_uri: 'http://localhost/api/authenticate') =>
  `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&response_type=code&scope=email%20identify%20connections%20guilds%20guilds.join%20guilds.members.read%20gdm.join%20applications.entitlements%20applications.store.update%20applications.commands%20messages.read%20webhook.incoming%20bot`;
