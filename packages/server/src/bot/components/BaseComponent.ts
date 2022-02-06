import config from '../config';

type ComponentsByGuild = { [guildId: string]: BaseComponent };

interface ComponentConstructor<T extends BaseComponent> {
  new (...args: any[]): T;
}

export class ComponentState {
  componentClass: ComponentConstructor<any>;

  componentsByGuild: ComponentsByGuild = {};

  constructor(componentClass: ComponentConstructor<any>) {
    this.componentClass = componentClass;
    console.log(`Created state for class: ${componentClass.name}`);
  }

  public createComponent(guildId: string) {
    if (!this.componentsByGuild[guildId]) {
      const newComponent = new this.componentClass(guildId, this);
      this.componentsByGuild[guildId] = newComponent;

      return newComponent;
    } else {
      console.log(
        `Guild already has a component of type ${this.componentClass.constructor.name}. Did not create one.`
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
