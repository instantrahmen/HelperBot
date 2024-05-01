<script lang="ts" generics="T extends BotEvent | BotAction">
  import type { DragHandleAction } from '$lib/components/DnDZone.svelte';

  import { convertParamsToValues } from '$lib/utils/commands';
  import { Switch } from '$lib/components/ui/switch';
  import { X } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import Label from '$lib/components/ui/label/label.svelte';
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
  // const getInitialParamValues = () =>
  //   Object.fromEntries(params?.map((param) => [param.label, null]));

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
  {#if param.type === 'input'}
    <Label for={param.id} class="sr-only">{param.label}</Label>
    <Input
      type="text"
      bind:value={paramValues['input'][param.id]}
      name={param.label}
      placeholder={param.label}
    />
  {:else if param.type === 'toggle'}
    <div class="flex items-center gap-2">

      <Label for={param.id} class="align-middle justify-center">{param.label}</Label>
      <Switch id="airplane-mode" bind:checked={paramValues['toggle'][param.id]} />
    </div>
  {/if}
{/snippet}
