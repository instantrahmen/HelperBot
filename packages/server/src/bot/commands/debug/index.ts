import { inspectCommand } from './inspect';
import { permissionLevels } from '../../permissions';
import { initializeDebuggers, getDebugger } from '../../components/Debugger';
import commandState from '../../components/Commands';

export const initializeDebugCommands = () => {
  // console.log('initializeDebugCommands');
  initializeDebuggers();

  const { createCommand } = commandState;

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
        await commandState.deployForGuild(guildId);

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
        await commandState.deployForGuild(guildId);

        await interaction.editReply(
          `Done. Commands hidden: \`${guildDebugger.disableCommands}\``
        );
      },
    }),
  ];
};
