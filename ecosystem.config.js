const { deploy } = require('./config/.config.json');

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

    // Helper Web Panel
    {
      name: 'Helper Panel',
      script: './packages/web-panel/dist/index.js',
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
  deploy: {
    production: deploy.production,
    production_old: deploy.production_old,
  },
};

module.exports = ecosystem;