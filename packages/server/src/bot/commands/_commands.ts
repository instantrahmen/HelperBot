import { registerCommands, getCommands } from './helpers/_commandState';
import config from '../config';
import { jsonBlock } from './helpers';

import hug from './hug';
import { initializeMusicCommands } from './music';
import { initializeDebugCommands } from './debug';

const musicCommands = initializeMusicCommands();
const debugCommands = initializeDebugCommands();

registerCommands([...musicCommands, ...debugCommands]);

const commands = getCommands();
console.log({ commands });

export default commands;
