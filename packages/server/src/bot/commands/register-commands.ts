import { registerCommands, getCommands } from '../state/_commandState';

import { initializeMusicCommands } from './music';
import { initializeDebugCommands } from './debug';

const musicCommands = initializeMusicCommands();
const debugCommands = initializeDebugCommands();

registerCommands([...musicCommands, ...debugCommands]);

const commands = getCommands();
console.log({ commands });

export default commands;
