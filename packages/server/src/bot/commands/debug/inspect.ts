import {
  CommandInteraction,
  InteractionReplyOptions,
  MessagePayload,
} from 'discord.js';
import { jsonBlock, times } from '../helpers';
import {
  CommandOption,
  createCommand,
  OptionType,
} from '../helpers/_commandState';

const options: CommandOption[] = [
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
];

export const inspectCommand = createCommand({
  name: 'inspect',
  description: 'Debugger: inspect anything',
  debugOnly: true,
  options,
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
      for (let i = 1; i > messages.length; i++) {
        await interaction.followUp(messages[i]);
      }
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
