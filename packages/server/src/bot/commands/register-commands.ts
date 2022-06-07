import { initializeMusicCommands } from './music';
import { initializeDebugCommands } from './debug';
import commandState from '../components/Commands';
import { initializeToolCommands } from './tools';

export const registerAllCommands = (): void => {
  console.log('registerAllCommands');
  const musicCommands = initializeMusicCommands();
  const debugCommands = initializeDebugCommands();
  const toolCommands = initializeToolCommands();
  commandState.registerCommands([
    ...musicCommands,
    ...debugCommands,
    ...toolCommands,
  ]);
};
