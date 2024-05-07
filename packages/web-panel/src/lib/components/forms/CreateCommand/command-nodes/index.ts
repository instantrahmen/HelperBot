import { createEvents, createActions, createVariable, createParam } from '$lib/utils/commands';
import z from 'zod';
import { type CompleteGuildDataResponse } from '$lib/types/discord';
import type { GuildDataState } from '$lib/stores/guild-data.svelte';
import type { ControlFlow } from '$lib/types/commands';

export let events = (guildInfo: GuildDataState) => {
  if (!guildInfo || guildInfo === 'loading')
    return createEvents([
      {
        id: 'event__error',
        label: 'Error',
        value: 'error',
        description: 'Error getting data',
        params: [],
        variables: [],
      },
    ]);

  return createEvents([
    {
      id: 'event__message-sent',
      label: 'Message Sent',
      value: 'message-sent',
      description: 'When a message is sent',
      variables: [
        createVariable({
          type: 'string',
          name: 'sender-id',
          label: 'Sender ID',
          commandType: 'message',
          value(message) {
            return message.author.id;
          },
        }),

        createVariable({
          type: 'string',
          name: 'sender-tag',
          label: 'Sender Username',
          commandType: 'message',
          value(message) {
            return message.author.tag;
          },
        }),

        createVariable({
          type: 'string',
          name: 'channel-id',
          label: 'Channel ID',
          commandType: 'message',
          value(message) {
            return message.channelId;
          },
        }),

        createVariable({
          type: 'string',
          name: 'message-id',
          label: 'Message ID',
          commandType: 'message',
          value(message) {
            return message.id;
          },
        }),
      ],
      params: [],
    },
    {
      id: 'event__slash-command',
      label: 'Slash Command Invoked',
      value: 'slashCommand',
      description: 'Register a slash command',
      variables: [],
      params: [
        {
          value: '',
          label: 'Command Name',
          type: 'input',
          required: true,
          id: 'command-name',
          leadingLabel: '/',
          transform(value) {
            // convert spaces to dashes
            return value.replace(/\s+/g, '-').replace(/-{2,}/g, '-').toLowerCase();
          },
          validator: z
            .string()
            .min(3, { message: 'Must be at least 3 characters' })
            .max(32, { message: 'Must be at most 32 characters' })
            .regex(/^[a-z0-9-]+$/, {
              message: 'Only lowercase letters, numbers, and dashes are allowed',
            }),
        },
        {
          label: 'Description',
          type: 'textarea',
          required: true,
          id: 'description',
          value: '',
        },
      ],
    },
    {
      id: 'event__app-command-user',
      label: 'Application User Command Invoked',
      value: 'appCommandUser',
      description: 'Register a user command',
      variables: [],
      params: [
        {
          label: 'Name',
          type: 'input',
          required: true,
          id: 'name',
          value: '',
        },
        {
          label: 'Description',
          type: 'textarea',
          required: true,
          id: 'description',
          value: '',
        },
      ],
    },
    {
      id: 'event__app-command-message',
      label: 'Application Message Command Invoked',
      value: 'appCommandMessage',
      description: 'Register a message command',
      variables: [],
      params: [
        {
          label: 'Name',
          type: 'input',
          required: true,
          id: 'name',
          value: '',
        },
        {
          label: 'Description',
          type: 'textarea',
          required: true,
          id: 'description',
          value: '',
        },
      ],
    },
  ]);
};

export let actions = createActions([
  {
    id: 'action__send-message',
    description: 'Sends a message to a specified channel.',
    label: 'Send Message',
    value: 'sendMessage',
    params: [
      createParam({
        id: 'content',
        label: 'Response Text',
        type: 'textarea',
        required: true,
      }),
      createParam({
        id: 'reply',
        label: 'Reply?',
        type: 'toggle',
        initialValue: true,
        required: true,
      }),
      {
        id: 'channel',
        label: 'Channel',
        type: 'select',
        value: {
          label: '',
          value: '',
        },
        options: [
          {
            label: 'Current Channel',
            value: 'current-channel',
          },
          {
            label: '#general',
            value: 'general',
          },
          {
            label: '#bot-commands',
            value: 'bot-commands',
          },
          {
            label: '#admin-chat',
            value: 'admin-chat',
          },
        ],
        hidden(values) {
          return values.toggle?.reply;
        },
        description:
          'The channel to send the message in. Defaults to the channel of the event if not provided.',
        required: false,
      },
    ],
  },
  {
    id: 'action__send-image',
    label: 'Send Image',
    value: 'sendImage',
    description: 'Sends an image to a specified channel.',
    params: [
      {
        id: 'url',
        label: 'Image URL',
        type: 'input',
        required: true,
        imagePreview: true,
        value: '',
      },
      {
        id: 'reply',
        label: 'Reply?',
        type: 'toggle',
        required: true,
        initialValue: true,
        value: true,
      },
      {
        id: 'channel',
        label: 'Channel',
        type: 'input',
        description:
          'The channel to send the message in. Defaults to the channel of the event if not provided.',
        required: false,
        hidden(values) {
          return values.toggle?.reply;
        },
        value: '',
      },
    ],
  },
  {
    id: 'action__add-reaction',
    label: 'Add Reaction',
    value: 'addReaction',
    description: 'Adds a reaction to a message.',
    params: [
      {
        id: 'messageId',
        label: 'Message ID',
        type: 'input',
        required: true,
        value: '',
      },
      {
        id: 'emoji',
        label: 'Emoji',
        type: 'input',
        required: true,
        value: '',
      },
    ],
  },
]);

export let controlFlowNodes: ControlFlow[] = [
  {
    id: 'control-flow__if',
    label: 'If (condition)',
    value: 'if',
    description: 'If statement',
    type: 'control-flow',
    childActions: [],
    params: [
      {
        id: 'value-1',
        label: 'Value 1',
        type: 'input',
        required: true,
        value: '',
      },
      {
        id: 'operator',
        label: 'Operator',
        type: 'select',
        required: true,
        options: [
          {
            label: 'is equal to',
            value: '===',
          },
          {
            label: 'is not equal to',
            value: '!==',
          },
          {
            label: 'is greater than',
            value: '>',
          },
          {
            label: 'is less than',
            value: '<',
          },
          {
            label: 'is greater than or equal to',
            value: '>=',
          },
          {
            label: 'is less than or equal to',
            value: '<=',
          },
        ],
        value: {
          label: '',
          value: '',
        },
      },
      {
        id: 'value-2',
        label: 'Value 2',
        type: 'input',
        required: true,
        value: '',
      },
    ],
  },
  {
    type: 'control-flow',
    id: 'control-flow__wait',
    label: 'Wait (seconds)',
    value: 'wait',
    description: 'Wait for a specified amount of time',
    childActions: [],
    params: [
      {
        id: 'time',
        label: 'Time in seconds',
        type: 'input',
        required: true,
        value: '',
      },
    ],
  },
];
