<script lang="ts">
  import Json from '$lib/components/Json.svelte';
  import { cn } from '$lib/utils';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import Button from '$lib/components/ui/button/button.svelte';
  import { PlusIcon } from 'lucide-svelte';
  import DnDZone from '$lib/components/DnDZone.svelte';
  import type { BotEvent, BotAction, BotEventAction } from '$lib/types/commands';
  import { dndzone } from 'svelte-dnd-action';
  import { createEvents, createActions } from '$lib/utils/commands';
  import CommandEventCard, { type Values } from './CommandEventCard.svelte';
  import Dropdown from '$lib/components/Dropdown.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
  import { Item } from '$lib/components/ui/accordion';

  let windowElement: HTMLBodyElement | undefined = $state();

  let events = $state(
    createEvents([
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
    ])
  );

  let actions = $state(
    createActions([
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
            required: true,
          },
          {
            id: 'channel',
            label: 'Channel',
            type: 'input',
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
          },
          {
            id: 'reply',
            label: 'Reply?',
            type: 'toggle',
            required: true,
          },
          {
            id: 'channel',
            label: 'Channel',
            type: 'input',
            description:
              'The channel to send the message in. Defaults to the channel of the event if not provided.',
            required: false,
          },
        ],
        // params: {
        //   content: {
        //     label: 'Response Text',
        //     type: 'textarea',
        //     required: true,
        //   },
        //   image: {
        //     label: 'Image URL',
        //     type: 'input',
        //     required: true,
        //   },
        //   reply: {
        //     label: 'Reply?',
        //     type: 'toggle',
        //     required: true,
        //   },
        //   channel: {
        //     label: 'Channel',
        //     type: 'input',
        //     description:
        //       'The channel to send the message in. Defaults to the channel of the event if not provided.',
        //     required: false,
        //   },
        // },
      },
    ])
  );

  let currentEvents: BotEvent[] = $state(
    createEvents([
      {
        ...events[0],
        id: 'event__message-includes-2',
      },
    ])
  );
  let currentActions: BotAction[] = $state(createActions([]));

  type EventActionParams = {
    [id: string]: Values;
  };

  let eventParamValues: EventActionParams = $state({});
  let actionParamValues: EventActionParams = $state({});

  const removeEvent = (removedEvent: BotEvent) => {
    currentEvents = currentEvents.filter((event) => event.id !== removedEvent.id);
    events = [...events, removedEvent];
  };

  const removeAction = (removedAction: BotAction) => {
    currentActions = currentActions.filter((action) => action.id !== removedAction.id);
    actions = [...actions, removedAction];
  };

  const addEvent = (event: BotEvent) => {
    currentEvents = [...currentEvents, event];
    events = events.filter((e) => e.id !== event.id);
  };

  const addAction = (action: BotAction) => {
    currentActions = [...currentActions, action];
    actions = actions.filter((a) => a.id !== action.id);
  };

  type DropdownParams<T extends BotEvent | BotAction> = {
    items: T[];
    name: string;
    onItemClick: (item: T) => void;
  };

  const maxDnDWidth = 768;
  let bodyWidth: number = $derived(windowElement?.clientWidth ?? 0);

  // let dndEnabled = $derived(bodyWidth > maxDnDWidth);
  const getWindowTooSmall = (width: number = bodyWidth) => bodyWidth <= maxDnDWidth;
  let dragDisabled = $state(getWindowTooSmall());
  let windowTooSmall = $derived(getWindowTooSmall(bodyWidth));

  $effect(() => {
    dragDisabled = windowTooSmall;
  });
</script>

<svelte:body bind:this={windowElement} />

<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
  <Card.Root class="bg-card-level-1 flex flex-col">
    <Card.Header class="text-center">
      <Card.Title>Create Command</Card.Title>
      <Card.Description
        >Build a new command by choosing when it should trigger and what it should do.</Card.Description
      >
    </Card.Header>
    <Card.Content class="flex-1 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" placeholder="Command name" autocomplete="off" />
        </div>
        <div></div>
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea id="description" placeholder="Command description" autocomplete="off" />
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Events</h3>
            {@render dropdownBotEvent({
              items: events,
              name: 'events',
              onItemClick: addEvent,
            })}
          </div>

          <DnDZone
            bind:items={currentEvents}
            options={{
              type: 'event',
              dropTargetClasses: ['border-primary'],
              dropTargetStyle: {},
            }}
            bind:dragDisabled
            renderItem={eventCard}
            class="bg-card-level-2 mt-2 min-h-24 space-y-2 rounded-lg border-2 border-dashed p-2 "
          />
        </div>
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Actions</h3>
            {@render dropdownBotAction({
              items: actions,
              name: 'action',
              onItemClick: addAction,
            })}
          </div>

          <DnDZone
            bind:items={currentActions}
            options={{
              type: 'action',
              dropTargetClasses: ['border-primary'],
              dropTargetStyle: {},
            }}
            bind:dragDisabled
            renderItem={actionCard}
            class="bg-card-level-2 mt-2 min-h-24 space-y-2 rounded-lg border-2 border-dashed p-2"
          />
        </div>
      </div>
    </Card.Content>

    <Card.Footer class="flex justify-end">
      <Button variant="outline">Cancel</Button>
      <Button class="ml-2">Create</Button>
    </Card.Footer>
  </Card.Root>

  <Card.Root class={cn('bg-card-level-1 hidden md:block')}>
    <Card.Header>
      <Card.Title>Events</Card.Title>
      <Card.Description>Which events should trigger this command?</Card.Description>
    </Card.Header>
    <Card.Content class="space-y-4">
      <!-- {$inspect(console.log(events))} -->

      <DnDZone
        bind:items={events}
        options={{
          type: 'event',
          dropTargetClasses: ['border-primary'],
          dropTargetStyle: {},
        }}
        renderItem={card}
        class="bg-card-level-2 min-h-32 space-y-2 rounded-lg border-2 border-dashed p-2"
      />
    </Card.Content>
    <Card.Header>
      <Card.Title>Actions</Card.Title>
      <Card.Description>Which actions should be triggered by this command?</Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4">
      <DnDZone
        bind:items={actions}
        options={{
          type: 'action',
          dropTargetClasses: ['border-primary'],
          dropTargetStyle: {},
        }}
        renderItem={card}
        class="bg-card-level-2 min-h-32 space-y-2 rounded-lg border-2 border-dashed p-2"
      />
    </Card.Content>
  </Card.Root>
</div>

{#snippet eventCard(item: BotEvent)}
  <CommandEventCard
    {item}
    onValuesChange={(values) => (eventParamValues[item.id] = values)}
    onRequestRemove={removeEvent}
  />
{/snippet}

{#snippet actionCard(item: BotAction)}
  <CommandEventCard
    {item}
    onValuesChange={(values) => (actionParamValues[item.id] = values)}
    onRequestRemove={removeAction}
  />
{/snippet}

{#snippet card(item: BotEvent | BotAction)}
  <div
    class="text-accent-foreground border-accent-foreground/25 bg-card-level-4 block w-full cursor-grab select-none overflow-hidden rounded-md border-2 p-4 shadow-md transition-all hover:shadow-lg active:cursor-grabbing"
  >
    <h4 class={cn('text-sm font-medium')}>
      {item.label}
    </h4>
    <span class="text-muted-foreground mt-2 text-sm">{item.description}</span>
  </div>
{/snippet}

{#snippet dropdownBotEvent({
    items,
    name,
    onItemClick,
}: DropdownParams<BotEvent>)}
  <Dropdown {items} {name} {onItemClick} class="bg-card-level-1" side="bottom">
    {#snippet renderTrigger({ builder })}
      <Button size="icon" variant="ghost" builders={[builder]}>
        <PlusIcon class="h-5 w-5" />
        <span class="sr-only">Add {name}</span>
      </Button>
    {/snippet}

    {#snippet renderItem({ item, onItemClick })}
      <DropdownMenu.Item
        class="bg-card-level-4 border-muted my-2 cursor-pointer flex-col items-start gap-3 rounded-sm border-[3px] p-2"
        on:click={() => onItemClick?.(item)}
      >
        <span class=" text-left text-sm font-bold">
          {item.label}
        </span>

        <span class="text-muted-foreground text-xs">{item.description}</span>
      </DropdownMenu.Item>
    {/snippet}
  </Dropdown>
{/snippet}

{#snippet dropdownBotAction({
  items,
  name,
  onItemClick,
}: DropdownParams<BotAction>)}
  <Dropdown {items} {name} {onItemClick} class="bg-card-level-1" side="bottom">
    {#snippet renderTrigger({ builder })}
      <Button size="icon" variant="ghost" builders={[builder]}>
        <PlusIcon class="h-5 w-5" />
        <span class="sr-only">Add {name}</span>
      </Button>
    {/snippet}

    {#snippet renderItem({ item, onItemClick })}
      <DropdownMenu.Item
        class="bg-card-level-4 border-muted my-2 cursor-pointer flex-col items-start gap-3 rounded-sm border-[3px] p-2"
        on:click={() => onItemClick?.(item)}
      >
        <span class=" text-left text-sm font-bold">
          {item.label}
        </span>

        <span class="text-muted-foreground text-xs">{item.description}</span>
      </DropdownMenu.Item>
    {/snippet}
  </Dropdown>
{/snippet}
