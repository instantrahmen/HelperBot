<script lang="ts" context="module">
  import type { Selected } from 'bits-ui';
  import type { DropdownMenuBuilders } from '@melt-ui/svelte';

  export type Item = {
    label: string;
    value: string;
    group?: string;
  };

  export type Items<T extends Item = Item> = T[];

  type GroupedItems<T extends Item = Item> = {
    default: Items<T>;
    [group: string]: Items<T>;
  };
</script>

<script lang="ts" generics="T extends Item">
  import { cn } from '$lib/utils';

  import type { Snippet } from 'svelte';

  import Button, { type Builder } from '$lib/components/ui/button/button.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';

  let {
    items,
    renderTrigger,
    renderItem,
    name,
    ariaLabel,
    onItemClick,
    class: className = '',
    side = 'bottom',
    ...restProps
  }: {
    renderTrigger?: Snippet<[{ items: T[]; name: string; builder: Builder }]>;
    renderItem?: Snippet<[{ item: T; onItemClick?: (item: T) => void }]>;
    items: Items<T>;
    name: string;
    ariaLabel?: string;
    onItemClick?: (item: T) => void;
    class?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    [key: string]: any;
  } = $props();

  // let groupedItems: GroupedItems = $derived()
  const getGroupedItems = (itemsToGroup: T[]): GroupedItems<T> => {
    const groupedItems: GroupedItems<T> = { default: [] };

    itemsToGroup.forEach((item) => {
      const { group = 'default' } = item;
      if (!groupedItems[group]) {
        groupedItems[group] = [];
      }
      groupedItems[group].push(item);
    });

    return groupedItems;
  };

  let groupedItems = $derived(getGroupedItems(items));

  let multipleGroups = $derived(Object.keys(groupedItems).length > 1);

  let dropdownContent: HTMLDivElement | undefined = $state();

  let offset = $derived((dropdownContent?.clientWidth ?? 0) / 2);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    {#if renderTrigger}
      {@render renderTrigger({
        items,
        name,
        builder,
      })}
    {:else}
      <Button aria-label={ariaLabel ?? name} builders={[builder]} variant="outline">{name}</Button>
    {/if}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class={cn('w-56', className)} {side} align="end">
    {#if multipleGroups}
      <!--  -->
      {#each Object.keys(groupedItems) as group}
        <DropdownMenu.Group>
          {#if group !== 'default'}
            <DropdownMenu.Label>{group}</DropdownMenu.Label>
          {/if}
          <DropdownMenu.Separator />
          {#each groupedItems[group] as item}
            {@render renderAnyItem(item)}
          {/each}
        </DropdownMenu.Group>
      {/each}
    {:else}
      {#each items as item}
        {@render renderAnyItem(item)}
      {/each}
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>

{#snippet renderAnyItem(item: T)}
  {#if !!renderItem}
    {@render renderItem({ item, onItemClick })}
  {:else}
    <DropdownMenu.Item on:click={() => onItemClick?.(item)}>{item.label}</DropdownMenu.Item>
  {/if}
{/snippet}
