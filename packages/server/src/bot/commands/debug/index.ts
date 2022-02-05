import {
  CommandInteraction,
  InteractionReplyOptions,
  MessagePayload,
} from 'discord.js';
import { createCommand } from '../../state/_commandState';
import { jsonBlock, times } from '../helpers';

import config from '../../config';
import Debugger, { initializeDebuggers, getDebugger } from './debugger';
import { deployCommands } from '../helpers/_deployCommands';
import { inspectCommand } from './inspect';
import { permissionLevels } from '../../permissions';
import { OptionType } from '../../types';

export const initializeDebugCommands = () => {
  initializeDebuggers();

  return [
    inspectCommand,

    createCommand({
      name: 'toggle-debug-mode',
      description: 'Enable debug mode',
      forceAvailable: true,
      permissions: [permissionLevels.admin],

      do: async (interaction) => {
        const guildId = interaction.guild!.id;
        const guildDebugger = getDebugger(guildId);
        guildDebugger.debugMode = !guildDebugger.debugMode;

        await interaction.reply(
          `Setting debug mode to \`${!guildDebugger.debugMode}\``
        );
        await deployCommands(guildId);

        await interaction.editReply(
          `Debug mode set to \`${guildDebugger.debugMode}\``
        );
      },
    }),

    createCommand({
      name: 'toggle-all-commands',
      description: 'Hide/show all commands',
      forceAvailable: true,
      // debugOnly: process.env.NODE_ENV === 'production',
      do: async (interaction) => {
        const guildId = interaction.guild!.id;
        const guildDebugger = getDebugger(guildId);
        guildDebugger.disableCommands = !guildDebugger.disableCommands;

        await interaction.reply(
          `Setting commands hidden: \`${!guildDebugger.debugMode}\``
        );

        await deployCommands(guildId);

        await interaction.editReply(
          `Commands hidden: \`${guildDebugger.debugMode}\``
        );
      },
    }),
  ];
};
