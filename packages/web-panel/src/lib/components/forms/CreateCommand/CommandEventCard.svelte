<script lang="ts" generics="T extends BotEvent | BotAction">
  import CommandParamInput from './CommandParamInput.svelte';

  import Dropdown from '$lib/components/SelectDropdown.svelte';

  import type { DragHandleAction } from '$lib/components/DnDZone.svelte';

  import { convertParamsToValues } from '$lib/utils/commands';
  import { Switch } from '$lib/components/ui/switch';
  import { X } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import Label from '$lib/components/ui/label/label.svelte';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { BotEvent, BotAction, BotParamValueTypes, Values } from '$lib/types/commands';
  import { cn } from '$lib/utils';

  let {
    item,
    onValuesChange = () => {},
    onRequestRemove = () => {},
    dragHandle,
  }: {
    item: T;
    onValuesChange?: (values: Values) => void;
    onRequestRemove?: (item: T) => void;
    dragHandle?: DragHandleAction;
  } = $props();

  let params = $derived(item.params);

  const getInitialParamValues = () => {
    return convertParamsToValues(item.params);
  };

  let paramValues: Values = $state(getInitialParamValues());

  $effect(() => {
    onValuesChange(paramValues);
  });

  const handleXClick = () => {
    console.log('removing', item);
    onRequestRemove(item);
  };

  const emptyDragHandleAction: DragHandleAction = () => ({
    update() {},
    destroy() {},
  });

  const dragHandleAction = $derived(dragHandle || emptyDragHandleAction);
</script>

<div
  class:cursor-grab={!dragHandle}
  class:active:cursor-grabbing={!dragHandle}
  class="text-accent-foreground border-accent-foreground/25 bg-card-level-4 block w-full select-none overflow-hidden rounded-md border-2 p-4 shadow-md transition-all hover:shadow-lg"
>
  <div class="flex flex-row">
    <div
      class="flex-1"
      use:dragHandleAction
      class:cursor-grab={!!dragHandle}
      class:active:cursor-grabbing={!!dragHandle}
    >
      <h4 class={cn('text-sm font-medium')}>
        {item.label}
      </h4>

      <p class="text-muted-foreground mt-2 text-sm">{item.description}</p>
    </div>

    <Button
      aria-label="Remove from list"
      variant="ghost"
      class="z-50 ml-auto mr-[-1rem] mt-[-1rem]"
      on:click={handleXClick}
    >
      <X />
    </Button>
  </div>

  {#if params}
    <div class="mt-4">
      <div class="mt-4 flex flex-col gap-2">
        {#each params as param}
          {@render cardInput(param)}

          <span>{paramValues[param.type][param.label]}</span>
        {/each}
      </div>
    </div>
  {/if}
</div>

{#snippet cardInput(param)}
  {#if !param.hidden?.(paramValues)}
    {#if param.type === 'input'}
      <CommandParamInput {param} bind:value={paramValues['input'][param.id]} lockable />
    {:else if param.type === 'toggle'}
      <div class="flex items-center gap-2">
        <Label for={param.id} class="justify-center align-middle">{param.label}</Label>
        <Switch id="airplane-mode" bind:checked={paramValues['toggle'][param.id]} />
      </div>
    {:else if param.type === 'textarea'}
      <Label for={param.id} class="sr-only">{param.label}</Label>
      <Textarea
        id={param.id}
        bind:value={paramValues['textarea'][param.id]}
        name={param.label}
        placeholder={param.label}
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    {:else if param.type === 'select'}
      <div class="flex items-center gap-2">
        <Label for={param.id} class=" justify-center align-middle">{param.label}</Label>
        <Dropdown
          items={param.options}
          name={param.id}
          label={param.label}
          placeholder={param.label}
          bind:selected={paramValues['select'][param.id]}
        ></Dropdown>
      </div>
    {/if}
  {/if}
{/snippet}
