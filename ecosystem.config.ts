module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // Helper Server
    {
      name: 'Helper',
      script: './packages/server/dist/index.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
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
      host: 'helper.cudd.io',
      ref: 'origin/main',
      repo: 'git@github.com:instantrahmen/HelperBot.git',
      path: '~/apps/helper-bot',
      'post-deploy':
        '/home/erika/.nvm/versions/node/v18.3.0/bin/pnpm install && /home/erika/.nvm/versions/node/v18.3.0/bin/pnpm run build && /home/erika/.nvm/versions/node/v18.3.0/bin/pm2 reload ecosystem.config.js --env production',
    },
  },
};
