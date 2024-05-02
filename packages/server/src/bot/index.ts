import { botState } from './components/Bot';
import { generateSlashCommands } from './commands';
import HelperEmotionsController from './state/emotions-state';
import { state as debuggerState } from './components/Debugger';
import { mpState } from './components/MusicPlayer';

process.on('uncaughtException', (err) => {
  console.log(err);
});

export const initialize = () => {
  botState._initialize(true);

  generateSlashCommands(botState.client);

  const helperController = new HelperEmotionsController();

  return { botState, helperController, debuggerState, mpState };
};
