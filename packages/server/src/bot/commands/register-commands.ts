import { initializeMusicCommands } from './music';
import { initializeDebugCommands } from './debug';
import commandState from '../components/Commands';

export const registerAllCommands = (): void => {
  console.log('registerAllCommands');
  const musicCommands = initializeMusicCommands();
  const debugCommands = initializeDebugCommands();

  commandState.registerCommands([...musicCommands, ...debugCommands]);
};
