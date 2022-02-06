import { botState } from './components/Bot';
import { generateSlashCommands } from './commands';
import FynniEmotionsController from './state/emotions-state';

process.on('uncaughtException', (err) => {
  console.log(err);
});

export const initialize = () => {
  botState._initialize();

  generateSlashCommands(botState.client);

  new FynniEmotionsController();

  return botState;
};
