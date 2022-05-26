import { botState } from './components/Bot';
import { generateSlashCommands } from './commands';
import HelperEmotionsController from './state/emotions-state';
import { state as debuggerState } from './components/Debugger';
import { mpState } from './components/MusicPlayer';

process.on('uncaughtException', (err) => {
  console.log(err);
});

export const initialize = () => {
  botState._initialize();

  generateSlashCommands(botState.client);

  const fynniController = new HelperEmotionsController();

  return { botState, fynniController, debuggerState, mpState };
};
