import {pb} from '$lib/pocketbase';

export const getDiscordProvider = async () => {
  const authMethods = await pb.collection('users').listAuthMethods();

  const discordAuthMethod = authMethods.authProviders.find(
    (provider) => provider.name === 'discord'
  );

  return discordAuthMethod;
}

export const createDiscordOath2Url = async (redirectUri: string, scopes: string[] = ['identify', 'email', 'guilds']): Promise<string> => {
  const provider = await getDiscordProvider();
  if (!provider) {
    throw new Error('Discord provider not found');
  }
  const url = new URL(provider.authUrl);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scopes.join('+'));
  
  console.log(url.href, url.toString());

  // replace %2B with + since discord doesn't like it when the + is encoded
  return url.href.replaceAll('%2B', '+');
}