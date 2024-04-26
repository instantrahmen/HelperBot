<script context="module" lang="ts">
  export type DnDZoneItem = {
    id: string;
  };

  export type DnDZoneAttrs = {
    dragDisabled: boolean;
    enableDrag: () => void;
    disableDrag: () => void;
    keyDown: (e: KeyboardEvent) => void;
  };
</script>

<script lang="ts" generics="T extends DnDZoneItem">
  import { cn } from '$lib/utils';

  import { dndzone, type Options, type DndEvent, SOURCES, TRIGGERS } from 'svelte-dnd-action';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type DivProps = HTMLAttributes<HTMLDivElement>;
  type ItemSnippet = Snippet<[item: T, attrs: DnDZoneAttrs]>;

  let {
    items = $bindable<T[]>([]),
    options = {},
    renderItem,
    dragDisabled = $bindable(false),
    useDragHandle = false,
    class: className,
  }: DivProps & {
    items: T[];
    options?: Omit<Options<T>, 'items'>;
    renderItem: ItemSnippet;
    dragDisabled?: boolean;
    useDragHandle?: boolean;
  } = $props();

  const handleConsider = (e: CustomEvent<DndEvent<T>>) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;

    items = e.detail.items;

    if (useDragHandle) {
      if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
        dragDisabled = true;
      }
    }
  };

  const handleFinalize = (e: CustomEvent<DndEvent<T>>) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;

    items = e.detail.items;

    if (dragDisabled) {
      if (source === SOURCES.POINTER) {
        dragDisabled = true;
      }
    }
  };

  const enableDrag = () => {
    dragDisabled = false;
  };

  const disableDrag = () => {
    dragDisabled = true;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && dragDisabled) dragDisabled = false;
  };
</script>

<div
  class={cn(className)}
  use:dndzone={{
    items,
    flipDurationMs: 200,
    dragDisabled,
    ...options,
  }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}
>
  {useDragHandle}
  {#each items as item (item.id)}
    {@render renderItem(item, { dragDisabled, enableDrag, disableDrag, keyDown: handleKeyDown })}
  {/each}
</div>

<style lang="postcss">
</style>
