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

  export type DragHandleAction = (element: HTMLElement) => {
    update(): void;
    destroy(): void;
  };
</script>

<script lang="ts" generics="T extends DnDZoneItem">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { dndzone, type Options, type DndEvent, SOURCES, TRIGGERS } from 'svelte-dnd-action';
  import { cn, dedupItems } from '$lib/utils';

  type DivProps = HTMLAttributes<HTMLDivElement>;
  type ItemSnippet = Snippet<[item: T, dragHandle: DragHandleAction]>;

  let {
    items = $bindable<T[]>([]),
    options = {},
    renderItem,
    dragDisabled = $bindable(false),
    class: className,
    zoneName,
  }: DivProps & {
    items: T[];
    options?: Omit<Options<T>, 'items'>;
    renderItem: ItemSnippet;
    dragDisabled?: boolean;
    useDragHandle?: boolean;
    zoneName?: string;
  } = $props();

  let dragHandles: HTMLElement[] = $state([]);
  let useDragHandle = $derived(dragHandles.length > 0);

  const handleConsiderWithDragHandle = (e: CustomEvent<DndEvent<T>>) => {
    const {
      info: { source, trigger },
    } = e.detail;

    handleSort(e);

    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  };

  const handleFinalizeWithDragHandle = (e: CustomEvent<DndEvent<T>>) => {
    const {
      info: { source },
    } = e.detail;

    handleSort(e);

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  };

  const handleSort = (e: CustomEvent<DndEvent<T>>) => {
    items = e.detail.items;
  };

  // use:dragHandle action
  const dragHandle = (element: HTMLElement) => {
    element.setAttribute('data-drag-handle', '');

    const startDrag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      dragDisabled = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && dragDisabled) dragDisabled = false;
    };

    dragHandles = [...dragHandles, element];

    // Add event listeners to handle enabling and disabling drag
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag);
    element.addEventListener('keydown', handleKeyDown);

    // Set aria role to button to mark as interactive
    element.role = 'button';
    element.ariaLabel = 'Drag Handle';
    return {
      update() {},
      destroy() {
        element.removeAttribute('data-drag-handle');
        element.removeEventListener('mousedown', startDrag);
        element.removeEventListener('touchstart', startDrag);
        element.removeEventListener('keydown', handleKeyDown);

        const dragHandleIndex = dragHandles.indexOf(element);
        dragHandles.splice(dragHandleIndex, 1);
      },
    };
  };

  $effect(() => {
    // console.log('items', items);
  });

  const hasDuplicateId = (items: T[]) => {
    const ids = items.map((item) => item.id);
    return ids.length !== new Set(ids).size;
  };

  $effect(() => {
    // HACK: De-duplicate if needed to counteract duplication bug with svelte-dnd-action and state runes when an item is dragged back to its original zone
    if (hasDuplicateId(items)) {
      console.log(zoneName, hasDuplicateId(items), items);
      items = dedupItems(items);
    }
  });
</script>

<div
  class={cn(className)}
  use:dndzone={{
    items,
    flipDurationMs: 200,
    dragDisabled,
    centreDraggedOnCursor: true,
    ...options,
  }}
  on:consider={useDragHandle ? handleConsiderWithDragHandle : handleSort}
  on:finalize={useDragHandle ? handleFinalizeWithDragHandle : handleSort}
>
  {#each items as item (item.id)}
    {@render renderItem(item, dragHandle)}
  {/each}
</div>

<style lang="postcss">
</style>
