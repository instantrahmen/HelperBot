import { NodeEnv } from '@helper/common';
import config from '../config';
import { stringify } from '../utils';
import BaseComponent, { ComponentState } from './BaseComponent';
export class Debugger extends BaseComponent {
  debugMode = !!process.env.DEBUG_MODE;
  // disableCommands = false;
  disableCommands = !!process.env.DEBUG_MODE
    ? false
    : config.environment === NodeEnv.DEVELOPMENT;

  static inMemoryDebugLog: any[] = [];

  constructor(guildId: string, state: ComponentState) {
    super(guildId, state);
  }

  static log(data: any) {
    console.log(data);
    Debugger.inMemoryDebugLog.push(data);
  }
}

export const state = new ComponentState(Debugger);

export const initializeDebuggers = () => {
  state.createComponentsForEachGuild();

  return state;
};

export const getDebugger = (guildId: string) =>
  state.getComponent(guildId) as Debugger;
export const getAllDebuggers = state.componentsByGuild;
