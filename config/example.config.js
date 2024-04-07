// @ts-check
// Rename this file to `.config.yml` and fill in the info below.
// This file should not be committed to source control, as it contains sensitive info
export default {
    development: {
        DISCORD_CLIENT_ID: '',
        DISCORD_CLIENT_SECRET: '',
        DISCORD_BOT_TOKEN: ''
    },
    production: {
        DISCORD_CLIENT_ID: '',
        DISCORD_CLIENT_SECRET: '',
        DISCORD_BOT_TOKEN: ''
    },
    // Info for the production server. Requires ssh access to said server.
    // If you're using a staging server, also add that here
    // Only needed if you're deploying using pm2, which this project uses by default.
    deploy: {
        production: {
            user: 'user1234',
            host: 'example.com',
            ref: 'origin/main',
            repo: 'git@github.com:exampleuser/HelperBot.git',
            path: '/home/user1234/apps/helper-bot',
            'post-deploy': 'pnpm run post-deploy'
        }
    },
    ssh: { 'local-private-key': '/home/localuser1234/.ssh/id_rsa' }
};
//# sourceMappingURL=example.config.js.map