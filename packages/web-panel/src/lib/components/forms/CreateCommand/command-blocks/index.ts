import { createEvents, createActions } from '$lib/utils/commands';
import z from 'zod';

let a = z.string();
export let events = createEvents([
  {
    id: 'event__message-includes',
    label: 'Message inlcudes',
    value: 'messageIncludes',
    description: 'When a message is sent that includes a specified string',
    params: [
      {
        label: 'Value',
        type: 'input',
        required: true,
        id: 'value',
      },
    ],
  },
  {
    id: 'event__message-starts-with',
    label: 'Message starts with',
    value: 'messageStartsWith',
    description: 'When a message is sent that starts with a specified string',
    params: [
      {
        label: 'Value',
        type: 'input',
        required: true,
        id: 'value',
      },
    ],
  },
  {
    id: 'event__slash-command',
    label: 'Slash Command Invoked',
    value: 'slashCommand',
    description: 'Register a slash command',
    params: [
      {
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
      },
    ],
  },
  {
    id: 'event__app-command-user',
    label: 'Application User Command Invoked',
    value: 'appCommandUser',
    description: 'Register a user command',
    params: [
      {
        label: 'Name',
        type: 'input',
        required: true,
        id: 'name',
      },
      {
        label: 'Description',
        type: 'textarea',
        required: true,
        id: 'description',
      },
    ],
  },
  {
    id: 'event__app-command-message',
    label: 'Application Message Command Invoked',
    value: 'appCommandMessage',
    description: 'Register a message command',
    params: [
      {
        label: 'Name',
        type: 'input',
        required: true,
        id: 'name',
      },
      {
        label: 'Description',
        type: 'textarea',
        required: true,
        id: 'description',
      },
    ],
  },
]);

export let actions = createActions([
  {
    id: 'action__send-message',
    description: 'Sends a message to a specified channel.',
    label: 'Send Message',
    value: 'sendMessage',
    params: [
      {
        id: 'content',
        label: 'Response Text',
        type: 'textarea',
        required: true,
      },
      {
        id: 'reply',
        label: 'Reply?',
        type: 'toggle',
        initialValue: true,
        required: true,
      },
      {
        id: 'channel',
        label: 'Channel',
        type: 'select',
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
      },
      {
        id: 'reply',
        label: 'Reply?',
        type: 'toggle',
        required: true,
        initialValue: true,
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
      },
    ],
  },
]);
