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
      path: '/home/erika/apps/helper-bot',
      'post-deploy':
        '/home/erika/.nvm/versions/node/v16.15.1/bin/pnpm run post-deploy',
    },
  },
};
