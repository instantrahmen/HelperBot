import config from '../config';

type ComponentsByGuild = { [guildId: string]: BaseComponent };

interface ComponentConstructor<T extends BaseComponent> {
  new (...args: any[]): T;
}

interface GlobalState {
  [key: string]: any;
}

interface StateInstances {
  [key: string]: ComponentState;
}

type GlobalStateInitializer = (self: ComponentState) => GlobalState;
export class ComponentState {
  private static _instances: StateInstances = {};

  componentClass: ComponentConstructor<any>;

  componentsByGuild: ComponentsByGuild = {};
  globalState: GlobalState = {};

  constructor(
    componentClass: ComponentConstructor<any>,
    globalStateInitializer?: GlobalStateInitializer
  ) {
    this.componentClass = componentClass;

    if (ComponentState._instances[componentClass.name]) {
      throw new Error(
        'This component already has a state set up, please refer to that instead.'
      );
    }

    ComponentState._instances[componentClass.name] = this;

    if (globalStateInitializer) {
      this.initializeGlobalState(globalStateInitializer.bind(this));
    }
    // this.globalState = globalState;
    console.log(`Created state for class: ${componentClass.name}`);
  }

  private initializeGlobalState(initializer: GlobalStateInitializer) {
    this.globalState = initializer(this);
  }

  public setState(key: string, value: any) {
    this.globalState[key] = value;
  }

  public getState(key: string) {
    return this.globalState[key];
  }

  public createComponent(guildId: string) {
    if (!this.componentsByGuild[guildId]) {
      const newComponent = new this.componentClass(guildId, this);
      this.componentsByGuild[guildId] = newComponent;

      return newComponent;
    } else {
      console.log(
        `Guild already has a component of type ${this.componentClass.name}. Did not create one.`
      );
    }
  }

  public getComponent(guildId: string) {
    // const {componentClass} =
    return this.componentsByGuild[guildId];
  }

  public createComponentsForEachGuild() {
    return config.guilds.map((guildId) => {
      return this.createComponent(guildId);
    });
  }
}

export default abstract class BaseComponent {
  // instance fields
  guildId = '';
  state: ComponentState;

  constructor(guildId: string, state: ComponentState) {
    this.guildId = guildId;
    this.state = state;
  }
}
