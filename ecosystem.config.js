const { deploy } = require('./hooks/deploy.config');

const ecosystem = {
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
   * Copy `example.deploy.config.js` and rename it to `deploy.config.js` and fill out info for your own server. This file also needs to be manually copied over to your server in order for deployment to work.
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy,
};

module.exports = ecosystem;
