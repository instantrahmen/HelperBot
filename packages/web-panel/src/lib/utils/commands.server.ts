import type { CacheType, Client, Interaction, Message } from 'discord.js';
import { createClient } from './discord.server';
import { CommandsTypeOptions, type CommandsResponse } from '$lib/types/gen/pocketbase-types';
import { pb } from '$lib/pocketbase.server';

export const commandListeners: { [key: string]: (...args: any) => void } = {};
export const listenForAllCommands = async (client: Client) => {
  console.log('Listening for all commands');

  // get commands from pocketbase
  const records = await pb.collection('commands').getFullList<CommandsResponse>({
    sort: '-created',
  });

  records.forEach((record) => {
    const slashCommand: boolean = record.type?.includes(CommandsTypeOptions.slash);
    const messageCommand: boolean = record.type?.includes(CommandsTypeOptions.response);
    const id = record.id;

    if (messageCommand) {
      const key = `${id}:message`;

      commandListeners[key] = async (message: Message<boolean>) => {
        if (message.guildId !== record.guild) return;
        if (message.author.bot) return;
        if (message.content !== record.name) return;

        message.reply({
          content: record.reply,
        });
      };

      // add listener
      client.on('messageCreate', commandListeners[key]);
    }

    if (slashCommand) {
      const key = `${id}:slash`;

      commandListeners[key] = async (interaction: Interaction<CacheType>) => {
        if (!interaction.isChatInputCommand()) return;
        // if (!slashCommand && !interaction.) return;
        const { commandName } = interaction;
        if (interaction.guildId !== record.guild) return;
        if (commandName !== record.name) return;

        // run command
        const { guild, created_by, name, reply } = record;
        interaction.reply({
          content: reply,
        });
      };

      client.on('interactionCreate', commandListeners[key]);
    }
  });
};
