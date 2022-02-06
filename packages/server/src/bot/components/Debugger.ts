import BaseComponent, { ComponentState } from './BaseComponent';

export class Debugger extends BaseComponent {
  debugMode = false;
  disableCommands = false;

  constructor(guildId: string, state: ComponentState) {
    super(guildId, state);
  }
}

export const state = new ComponentState(Debugger);

export const initializeDebuggers = () => {
  console.log('initializing debuggers');
  state.createComponentsForEachGuild();

  console.log({ debuggerState: state });
  return state;
};

export const getDebugger = (guildId: string) =>
  state.getComponent(guildId) as Debugger;
export const getAllDebuggers = state.componentsByGuild;
