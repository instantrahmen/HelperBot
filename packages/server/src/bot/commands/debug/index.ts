import { createCommand } from '../../state/command-state';

import { deployCommands } from '../helpers/deploy-commands';
import { inspectCommand } from './inspect';
import { permissionLevels } from '../../permissions';
import { initializeDebuggers, getDebugger } from '../../components/Debugger';

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
        const newValue = !guildDebugger.debugMode;

        await interaction.reply(`Setting debug mode to \`${newValue}\``);

        guildDebugger.debugMode = newValue;
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

      do: async (interaction) => {
        const guildId = interaction.guild!.id;
        const guildDebugger = getDebugger(guildId);
        const newValue = !guildDebugger.disableCommands;

        await interaction.reply(`Setting commands hidden to \`${newValue}\``);

        guildDebugger.disableCommands = !guildDebugger.disableCommands;
        await deployCommands(guildId);

        await interaction.editReply(
          `Done. Commands hidden: \`${guildDebugger.disableCommands}\``
        );
      },
    }),
  ];
};
