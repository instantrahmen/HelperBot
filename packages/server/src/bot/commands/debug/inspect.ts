import {
  CommandInteraction,
  InteractionReplyOptions,
  MessagePayload,
} from 'discord.js';
import { jsonBlock, times } from '../helpers';
import { createCommand, OptionType } from '../helpers/_commandState';

export const inspectCommand = createCommand({
  name: 'inspect',
  description: 'Debugger: inspect anything',
  debugOnly: true,
  options: [
    {
      type: OptionType.USER,
      name: 'user',
      required: false,
      description: 'Inspect a person',
    },
    {
      type: OptionType.ROLE,
      name: 'role',
      required: false,
      description: 'Inspect a role',
    },
    {
      type: OptionType.MENTIONABLE,
      name: 'mention',
      required: false,
      description: 'Inspect anything mentionable',
    },
    {
      type: OptionType.CHANNEL,
      name: 'channel',
      required: false,
      description: 'Inspect a channel',
    },
    {
      type: OptionType.STRING,
      name: 'text',
      required: false,
      description: 'Inspect a string of text',
    },
    {
      type: OptionType.BOOLEAN,
      name: 'guild',
      required: false,
      description: 'Inspect the server data',
    },
  ],
  do: async (interaction) => {
    const { options } = interaction;

    const opts = filterInspectOptions(interaction, [
      options.getString('text', false),
      options.getChannel('channel', false),
      options.getMentionable('mention', false),
      options.getRole('role', false),
      options.getUser('user', false),
      options.getBoolean('guild', false) && interaction.guild,
    ]);

    console.log('inspecting');

    // const replyText = jsonBlock(interaction.toJSON());
    const replyText = jsonBlock(opts);
    const replyTextPlain = jsonBlock(opts, true);

    const chunkSize = 1950;
    if (replyText.length > chunkSize) {
      const chunks = Math.ceil(replyText.length / chunkSize);
      const messages = times(chunks, (currentChunk: number) => {
        const offset = chunkSize * currentChunk;
        const start = 0 + offset;
        const max = chunkSize + offset;

        const end = max > replyText.length ? replyText.length : max;

        const replyTextChunk = jsonBlock(replyTextPlain.slice(start, end));
        return replyTextChunk;
      });

      await interaction.reply(messages[0]);
      await interaction.followUp(messages[1]);
      // // Can't use map or foreach here
      // for (let i = 1; i > messages.length; i++) {
      //   await reply(interaction, messages[i], i);
      // }

      // for (const [i, message] of messages.entries()) {
      //   console.log(i, message)
      // }

      // await interaction.reply(`Too many characters: ${replyText.length}`);
    } else {
      await interaction.reply(replyText);
    }
  },
});

const filterInspectOptions = (
  interaction: CommandInteraction,
  options: any[]
): any => {
  options = options.filter((val: any) => !!val);
  if (options.length === 1) return options[0];
  return options;
};

const reply = (
  interaction: CommandInteraction,
  message: string | InteractionReplyOptions | MessagePayload,
  index = 0
) => {
  if (index === 0) {
    return interaction.reply(message);
  }
  return interaction.followUp(message);
};
