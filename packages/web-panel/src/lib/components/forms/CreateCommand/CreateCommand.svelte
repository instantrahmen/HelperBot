<script lang="ts">
  import { cn, dedupItems } from '$lib/utils';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import Button from '$lib/components/ui/button/button.svelte';
  import { PlusIcon } from 'lucide-svelte';
  import DnDZone, { addItemAsCopy, type DragHandleAction } from '$lib/components/DnDZone.svelte';
  import type { BotEvent, BotAction, BotEventAction, Values } from '$lib/types/commands';
  import CommandParamInput from './CommandParamInput.svelte';

  import { createEvents, createActions } from '$lib/utils/commands';
  import CommandEventCard from './CommandEventCard.svelte';
  import Dropdown from '$lib/components/Dropdown.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
  import { events as allEvents, actions as allActions } from './command-nodes';
  import guildDataStore from '$lib/stores/guild-data.svelte';

  const guildData = guildDataStore();

  let events = $state(allEvents(guildData.state));
  let actions = $state(allActions);

  let awaitingCopy = $state(false);

  // Silly kinda pointless functions to avoid svelte/eslint from complaining
  const getExistingItem = <T extends BotEvent | BotAction>(items: T[], index: number = 0): T =>
    items[index];
  const getFirstEvent = (): BotEvent => getExistingItem(events);
  const getFirstAction = (): BotAction => getExistingItem(actions, 1);

  let currentEvents: BotEvent[] = $state([
    {
      ...getFirstEvent(),
      id: 'temp-first-event',
    },
  ]);
  let currentActions: BotAction[] = $state([
    {
      ...getFirstAction(),
      id: 'temp-first-action',
    },
  ]);

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
    // actions = [...actions, removedAction];
  };

  const addEvent = (event: BotEvent) => {
    currentEvents = [...currentEvents, event];
    events = events.filter((e) => e.id !== event.id);
  };

  const addAction = (action: BotAction) => {
    currentActions = [...currentActions, action];
    actions = actions.filter((a) => a.id !== action.id);
    awaitingCopy = true;
  };

  type DropdownParams<T extends BotEvent | BotAction> = {
    items: T[];
    name: string;
    onItemClick: (item: T) => void;
  };
</script>

<div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
  <Card.Root class="bg-card-level-1 flex flex-col">
    <Card.Header class="text-center">
      <Card.Title>Create Command</Card.Title>
      <Card.Description
        >Build a new command by choosing when it should trigger and what it should do.</Card.Description
      >
    </Card.Header>
    <Card.Content class="flex-1 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <!-- <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" placeholder="Command name" autocomplete="off" />
        </div> -->
        <div class="space-y-2">
          <!-- <Label for="name">Name</Label> -->
          <CommandParamInput
            param={{
              type: 'input',
              id: 'name',
              label: 'Name',
              description: 'Command name',
              required: true,
            }}
            lockable
            visibleLabel
          ></CommandParamInput>
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
            <div class="flex flex-col space-y-1">
              <h3 class="text-lg font-medium">Events</h3>
              <span class="text-muted-foreground text-sm">When this happens:</span>
            </div>
            {@render dropdownBotEvent({
              items: events,
              name: 'events',
              onItemClick: addEvent,
            })}
          </div>

          <DnDZone
            zoneName="current-events"
            bind:items={currentEvents}
            options={{
              type: 'event',
              dropTargetClasses: ['border-primary'],
              dropTargetStyle: {},
            }}
            renderItem={eventCard}
            class="bg-card-level-2 mt-2 min-h-24 space-y-2 rounded-lg border-2 border-dashed p-2 "
          />
        </div>
        <div>
          <div class="flex items-center justify-between">
            <div class="flex flex-col space-y-1">
              <h3 class="text-lg font-medium">Actions</h3>
              <span class="text-muted-foreground text-sm">Do this:</span>
            </div>
            {@render dropdownBotAction({
              items: actions,
              name: 'action',
              onItemClick: addAction,
            })}
          </div>

          <DnDZone
            zoneName="current-actions"
            bind:items={currentActions}
            options={{
              type: 'action',
              dropTargetClasses: ['border-primary'],
              dropTargetStyle: {},
            }}
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
        zoneName="events"
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
        zoneName="actions"
        duplicateOnDrop
        bind:awaitingCopy
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

{#snippet eventCard(item: BotEvent, dragHandle: DragHandleAction)}
  <CommandEventCard
    {item}
    onValuesChange={(values) => (eventParamValues[item.id] = values)}
    onRequestRemove={removeEvent}
    {dragHandle}
  />
{/snippet}

{#snippet actionCard(item: BotAction, dragHandle: (e: HTMLElement) => any)}
  <CommandEventCard
    {item}
    onValuesChange={(values) => (actionParamValues[item.id] = values)}
    onRequestRemove={removeAction}
    {dragHandle}
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
