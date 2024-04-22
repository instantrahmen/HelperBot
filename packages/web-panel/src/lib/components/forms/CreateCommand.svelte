<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import Button from '$lib/components/ui/button/button.svelte';
  import { MouseIcon, PlusIcon } from 'lucide-svelte';
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';

  type BotParamType = 'input' | 'textarea' | 'select' | 'toggle' | 'date' | 'daterange';
  type BotEvent = {
    label: string;
    value: string;

    params: Record<string, { label: string; type: BotParamType; required: boolean }>;
    // params: {
    //   [key: string]: {
    //     label: string;
    //     type: 'input' | 'textarea' | 'select' | 'toggle' | 'date' | 'daterange';
    //     required: boolean;
    //   };
    // }[];
  };

  let events: BotEvent[] = [
    {
      label: 'Message inlcudes',
      value: 'messageIncludes',
      params: {
        value: {
          label: 'Value',
          type: 'input',
          required: true,
        },
      },
    },
    {
      label: 'Slash Command Invoked',
      value: 'slashCommand',
      params: {
        name: {
          label: 'Name',
          type: 'input',
          required: false, // If not provided, it will be the name of the command
        },
        description: {
          label: 'Description',
          type: 'textarea',
          required: false, // If not provided, it will be the description of the command
        },
      },
    },
  ];

  let actions = [
    {
      label: 'Send Message',
      value: 'sendMessage',
      params: {
        content: {
          label: 'Response Text',
          type: 'textarea',
          required: true,
        },
        reply: {
          label: 'Reply?',
          type: 'toggle',
          required: true,
        },
      },
    },

    {
      label: 'Send Image',
      value: 'sendImage',
      params: {
        content: {
          label: 'Response Text',
          type: 'textarea',
          required: true,
        },
        image: {
          label: 'Image URL',
          type: 'input',
          required: true,
        },
        reply: {
          label: 'Reply?',
          type: 'toggle',
          required: true,
        },
      },
    },
  ];

  let currentEvents = $state([]);

  // function handleDndConsider(e) {
  //       items = e.detail.items;
  //   }
  //   function handleDndFinalize(e) {
  //       items = e.detail.items;
  //   }
</script>

<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
  <Card.Root class="flex flex-col">
    <Card.Header>
      <Card.Title>Create Command</Card.Title>
      <Card.Description>Build a new command by configuring its events and actions.</Card.Description
      >
    </Card.Header>
    <Card.Content class="flex-1 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" placeholder="Command name" />
        </div>
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea id="description" placeholder="Command description" />
        </div>
      </div>
      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Events</h3>
            <Button size="icon" variant="ghost">
              <PlusIcon class="h-5 w-5" />
              <span class="sr-only">Add event</span>
            </Button>
          </div>
          <div
            class="mt-2 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
          />
        </div>
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Actions</h3>
            <Button size="icon" variant="ghost">
              <PlusIcon class="h-5 w-5" />
              <span class="sr-only">Add action</span>
            </Button>
          </div>
          <div
            class="mt-2 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>
    </Card.Content>
    <Card.Footer class="flex justify-end">
      <Button variant="outline">Cancel</Button>
      <Button class="ml-2">Create</Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root>
    <Card.Header>
      <Card.Title>Events</Card.Title>
    </Card.Header>
    <Card.Content class="space-y-4">
      <div class="rounded-md border border-gray-200 p-4 shadow-sm dark:border-gray-800">
        <h4 class="text-sm font-medium">On Startup</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">Runs when the command is executed.</p>
      </div>
      <div class="rounded-md border border-gray-200 p-4 shadow-sm dark:border-gray-800">
        <h4 class="text-sm font-medium">On Shutdown</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">Runs when the command is stopped.</p>
      </div>
    </Card.Content>
    <Card.Footer>
      <h3 class="text-lg font-medium">Actions</h3>
    </Card.Footer>
    <Card.Content class="space-y-4">
      <div class="rounded-md border border-gray-200 p-4 shadow-sm dark:border-gray-800">
        <h4 class="text-sm font-medium">Send Message</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Sends a message to a specified channel.
        </p>
      </div>
      <div class="rounded-md border border-gray-200 p-4 shadow-sm dark:border-gray-800">
        <h4 class="text-sm font-medium">Ping Server</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">Checks the status of a server.</p>
      </div>
    </Card.Content>
  </Card.Root>
  <!-- <Card.Root class="flex flex-col">
    <Card.Header>
      <Card.Title>Elements</Card.Title>
      <Card.Description>Drag and drop events and actions to the form.</Card.Description>
    </Card.Header>
    <Card.Content class="flex-1 space-y-6">
      <div>
        <h3 class="text-lg font-medium">Events</h3>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <div class="rounded-lg border border-gray-300 p-2 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Slash Command Invokedz</span>
              <MouseIcon class="h-4 w-4 cursor-move text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div class="rounded-lg border border-gray-300 p-2 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Timer Expired</span>
              <MouseIcon class="h-4 w-4 cursor-move text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-medium">Actions</h3>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <div class="rounded-lg border border-gray-300 p-2 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Send Email</span>
              <MouseIcon class="h-4 w-4 cursor-move text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div class="rounded-lg border border-gray-300 p-2 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Log to Console</span>
              <MouseIcon class="h-4 w-4 cursor-move text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root> -->
</div>

<style lang="postcss">
</style>
