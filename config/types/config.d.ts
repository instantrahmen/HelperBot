export default config;
declare namespace config {
    namespace development {
        let DISCORD_CLIENT_ID: string;
        let DISCORD_CLIENT_SECRET: string;
        let DISCORD_BOT_TOKEN: string;
        let GUILDS: string[];
        let PB_URL: string;
    }
    namespace production {
        let DISCORD_CLIENT_ID_1: string;
        export { DISCORD_CLIENT_ID_1 as DISCORD_CLIENT_ID };
        let DISCORD_CLIENT_SECRET_1: string;
        export { DISCORD_CLIENT_SECRET_1 as DISCORD_CLIENT_SECRET };
        let DISCORD_BOT_TOKEN_1: string;
        export { DISCORD_BOT_TOKEN_1 as DISCORD_BOT_TOKEN };
        let GUILDS_1: string[];
        export { GUILDS_1 as GUILDS };
        let PB_URL_1: string;
        export { PB_URL_1 as PB_URL };
    }
    let ssh: {
        'local-private-key': string;
    };
    namespace deploy {
        export let production_old: {
            user: string;
            host: string;
            ref: string;
            repo: string;
            path: string;
            'post-deploy': string;
        };
        let production_1: {
            user: string;
            host: string;
            ref: string;
            repo: string;
            path: string;
            'post-deploy': string;
        };
        export { production_1 as production };
    }
}
//# sourceMappingURL=config.d.ts.map