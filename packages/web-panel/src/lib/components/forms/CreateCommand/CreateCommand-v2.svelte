<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Resizable from '$lib/components/ui/resizable/';
  import CommandParamInput from './CommandParamInput.svelte';
  import DnDZone from '$lib/components/DnDZone.svelte';
  import { events, actions, controlFlowNodes } from './command-nodes';
  import type { BotEvent, BotAction, BotEventParams } from '$lib/types/commands';
  import Json from '$lib/components/Json.svelte';
  import CommandEventCard from './CommandEventCard.svelte';
  import Dropdown from '$lib/components/SelectDropdown.svelte';

  import type { CompleteGuildDataResponse } from '$lib/types/discord';

  let { guildData }: { guildData: CompleteGuildDataResponse } = $props();

  let commandEvents = $state(events(guildData));
  let currentEvents: BotEvent[] = $state([]);

  let commandActions = $state(actions);

  let commandControlFlowNodes = $state(controlFlowNodes);

  let globalParams: BotEventParams[] = [
    {
      id: 'command-name',
      name: 'command-name',
      type: 'input',
      description: 'The name of the event',
      label: 'Name',
      required: true,
      value: '',
    },
    {
      id: 'command-description',
      type: 'textarea',
      description: 'The description of the event',
      label: 'Description',
      required: true,
      value: '',
    },
  ] as BotEventParams[];
</script>

<div class="mx-auto grid min-h-full w-full flex-1 grid-cols-1 gap-6 md:grid-cols-[300px_1fr_300px]">
  <Card.Root class="bg-card-level-1 flex flex-col">
    <Card.Header class="text-center">
      <Card.Title>Event Nodes</Card.Title>
    </Card.Header>

    <Card.Content class="flex flex-col gap-4">
      <DnDZone class="grid gap-4" bind:items={commandEvents} options={{ type: 'event' }}>
        {#snippet renderItem(item)}
          <div class="bg-card-level-3 rounded-lg border p-4 font-bold">
            {item.label}
          </div>
        {/snippet}
      </DnDZone>

      <!-- control flow -->

      <DnDZone
        class="bg-card-level-2 grid gap-4"
        bind:items={commandControlFlowNodes}
        options={{
          type: 'action',
        }}
      >
        {#snippet renderItem(item)}
          <div class="bg-card-level-3 rounded-lg border p-4">
            {item.label}
          </div>
        {/snippet}
      </DnDZone>
    </Card.Content>
  </Card.Root>

  <Card.Root class="bg-card-level-1 flex flex-col">
    <Card.Header class="text-center">
      <Card.Title>Create Command</Card.Title>
      <Card.Description
        >Build a new command by choosing when it should trigger and what it should do.</Card.Description
      >
    </Card.Header>

    <Card.Content class="flex flex-row gap-4">
      <DnDZone
        class="bg-card-level-2 mt-2 min-h-24 flex-1 space-y-2 rounded-lg border-2 border-dashed p-2"
        bind:items={currentEvents}
        options={{ type: 'event' }}
        renderItem={activeCommandEvent}
      ></DnDZone>
    </Card.Content>
  </Card.Root>

  <!-- Properties -->
  <Card.Root class="bg-card-level-1 flex flex-col">
    <Card.Header class="text-center">
      <Card.Title>Properties</Card.Title>
    </Card.Header>

    <Card.Content class="flex flex-col gap-4">
      {#each globalParams as globalParam}
        {#if globalParam.type === 'input' || globalParam.type === 'textarea'}
          <CommandParamInput lockable param={globalParam} />
        {/if}
      {/each}
      <!-- command properties -->
      <!-- <CommandParamInput
        lockable
        param={{
          type: 'input',
          id: 'name',
          label: 'Name',
          required: true,
          value: '',
        }}
      />

      <CommandParamInput
        lockable
        param={{
          type: 'textarea',
          id: 'description',
          label: 'Description',
          required: true,
          value: '',
        }}
      /> -->
    </Card.Content>
  </Card.Root>

  <!-- <Card.Root class="bg-card-level-1 flex flex-col">
    <Card.Header class="text-center">
      <Card.Title>Create Command</Card.Title>
      <Card.Description
        >Build a new command by choosing when it should trigger and what it should do.</Card.Description
      >
    </Card.Header>
  </Card.Root> -->
  <Json value={{ guildData, commandEvents }}></Json>
</div>

{#snippet activeCommandEvent(item: BotEvent)}
  <CommandEventCard
    {item}
    on:delete={() => {
      currentEvents = currentEvents.filter((event) => event.id !== item.id);
    }}
  />
{/snippet}
