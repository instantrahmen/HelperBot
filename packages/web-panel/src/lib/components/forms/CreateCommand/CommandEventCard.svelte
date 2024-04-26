<script lang="ts" context="module">
  export type Value = string | number | boolean | null;
  export type Values = {
    [key: string]: Value;
  };
</script>

<script lang="ts" generics="T extends BotEvent | BotAction">
  import type { ButtonEventHandler } from 'bits-ui';

  import { X } from 'lucide-svelte';

  import { Input } from '$lib/components/ui/input';
  import Label from '$lib/components/ui/label/label.svelte';
  import { Button } from '$lib/components/ui/button';
  import { type BotEvent, type BotAction } from '$lib/types/commands';
  import { cn } from '$lib/utils';

  let {
    item,
    onValuesChange = () => {},
    onRequestRemove = () => {},
  }: {
    item: T;
    onValuesChange?: (values: Values) => void;
    onRequestRemove?: (item: T) => void;
  } = $props();

  let params = $derived(item.params);

  const getInitialParamValues = () =>
    Object.fromEntries(params?.map((param) => [param.label, null]));

  let paramValues: Values = $state(getInitialParamValues());

  $effect(() => {
    onValuesChange(paramValues);
  });

  const handleXClick = () => {
    console.log('removing', item);
    onRequestRemove(item);
  };
</script>

<div
  class="text-accent-foreground border-accent-foreground/25 bg-card-level-4 block w-full cursor-grab select-none overflow-hidden rounded-md border-2 p-4 shadow-md transition-all hover:shadow-lg active:cursor-grabbing"
>
  <div class="flex flex-row">
    <div>
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
      <!-- <Label>Email</Label>
        <Input /> -->

      <div class="mt-4">
        {#each params as param}
          {@render cardInput(param)}

          <span>{paramValues[param.label]}</span>
        {/each}
      </div>
    </div>
  {/if}
</div>

{#snippet cardInput(param)}
  <Label for={param.id} class="hidden">{param.label}</Label>
  <Input
    type="text"
    bind:value={paramValues[param.id]}
    name={param.label}
    placeholder={param.label}
  />
{/snippet}
