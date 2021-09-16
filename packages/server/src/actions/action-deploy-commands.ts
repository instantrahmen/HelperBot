import { deployCommandsAllGuilds } from '../bot/commands/helpers/_deployCommands';

deployCommandsAllGuilds()
  .then((guilds) => {
    console.log(`Deployed commands for the following guilds`, guilds);
  })
  .catch(() => {
    console.warn('Failed to deploy commands');
  });
