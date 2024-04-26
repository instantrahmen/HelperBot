const config = {
  development: {
    DISCORD_CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
    DISCORD_CLIENT_SECRET: 'YOUR_DISCORD_CLIENT_SECRET',
    DISCORD_BOT_TOKEN: 'YOUR_DISCORD_BOT_TOKEN',
    GUILDS: ['YOUR_GUILD_ID_1', 'YOUR_GUILD_ID_2', 'YOUR_GUILD_ID_3'],
    PB_URL: 'YOUR_PB_URL',
  },
  production: {
    DISCORD_CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
    DISCORD_CLIENT_SECRET: 'YOUR_DISCORD_CLIENT_SECRET',
    DISCORD_BOT_TOKEN: 'YOUR_DISCORD_BOT_TOKEN',
    GUILDS: ['YOUR_GUILD_ID_1', 'YOUR_GUILD_ID_2', 'YOUR_GUILD_ID_3'],
    PB_URL: 'YOUR_PB_URL',
  },
  ssh: { 'local-private-key': 'YOUR_LOCAL_PRIVATE_KEY_PATH' },
  deploy: {
    // deployment environments
    production: {
      user: 'YOUR_USER',
      host: 'YOUR_HOST',
      ref: 'origin/main', // change to your prod branch if you don't want to use main
      repo: 'YOUR_REPO', // your fork of the repo
      path: 'YOUR_PATH', // where your app should be deployed on the server
      'post-deploy': 'YOUR_POST_DEPLOY_COMMAND', // any commands you want to run after deploy
    },
  },
};

export default config;
