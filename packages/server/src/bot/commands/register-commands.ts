import { registerCommands, getCommands } from '../state/command-state';

import { initializeMusicCommands } from './music';
import { initializeDebugCommands } from './debug';
import { Command } from '../types';

export const registerAllCommands = (): Command[] => {
  const musicCommands = initializeMusicCommands();
  const debugCommands = initializeDebugCommands();

  registerCommands([...musicCommands, ...debugCommands]);

  return getCommands();
};
