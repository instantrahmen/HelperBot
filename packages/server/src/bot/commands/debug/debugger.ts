import {
  CommandInteraction,
  InteractionReplyOptions,
  MessagePayload,
} from 'discord.js';
import config from '../../config';

// globalPersmissions
export default class Debugger {
  guildId = '';
  debugMode = false;
  disableCommands = false;

  constructor(guildId: string) {
    this.guildId = guildId;

    if (!allDebuggers[guildId])
      console.warn(
        'Two debuggers created for the same guild. This is likely in error. Replacing old one with new one'
      );

    allDebuggers[guildId] = this;
  }
}

type DebuggersByGuild = { [guildId: string]: Debugger };

export const allDebuggers: DebuggersByGuild = {};
export const getDebugger = (guid: string) => allDebuggers[guid] || null;

const createDebuggersForAllGuilds = () => {
  config.guilds.forEach((guildId) => {
    if (!allDebuggers[guildId]) {
      new Debugger(guildId);
    } else {
      console.log('guild already has debugger');
    }
  });

  console.log({ allDebuggers });
};

export const initializeDebuggers = () => {
  createDebuggersForAllGuilds();
};
