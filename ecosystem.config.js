module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // Fynni Server
    {
      name: 'Fynni',
      // script: './packages/dist/index.js',
      script: './packages/server/dist/index.js',
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL: 'file:./dev.db',

        // Very sensitive data, only commit if on private repo
        DISCORD_CLIENT_ID: '874922387848699924',
        DISCORD_CLIENT_SECRET: '2bt7ua5kVlb_BW-oPQWOlMANl2cFA4xc',
        DISCORD_BOT_TOKEN:
          'ODc0OTIyMzg3ODQ4Njk5OTI0.YROA-A.I8Du9nZqzOnu5V4WQ0ShG__Cw0Y',
        DISCORD_GUILD_ID: '872562843688517693',
      },
      env_development: {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:./dev.db',

        // Very sensitive data, only commit if on private repo
        DISCORD_CLIENT_ID: '938274206574075994',
        DISCORD_CLIENT_SECRET: 'YquYfkhIOjeXyHkPQIC25Py0MQCDQ0Z3',
        DISCORD_BOT_TOKEN:
          'OTM4Mjc0MjA2NTc0MDc1OTk0.Yfn58w.aY005A70ct-UxwoGm7UVGKNxHQw',
        DISCORD_GUILD_ID: '872562843688517693',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'erika',
      host: 'pointsmap.com',
      ref: 'origin/prod',
      repo: 'git@github.com:instantrahmen/fynni-bot.git',
      path: '/var/www/rahmen/fynni-bot',
      'post-deploy':
        'yarn install && yarn run build && /home/erika/.npm-packages/bin/pm2 reload ecosystem.config.js --env production',
    },
  },
};
