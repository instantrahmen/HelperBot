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

  export const copyItem = <T extends DnDZoneItem>(item: T): T => {
    const { id, ...restItem } = item;
    const newId = `${id}_copy_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    const newItem: T = {
      ...restItem,
      id: newId,
    } as T;
    return newItem;
  };
  export const copyItems = <T extends DnDZoneItem>(items: T[]): T[] => {
    return items.map(copyItem);
  };

  export const addItemAsCopy = <T extends DnDZoneItem>(items: T[], item: T): T[] => {
    const itemsWithoutNewItem = items.filter((i) => i.id !== item.id);
    const newItem = copyItem(item);
    return [...itemsWithoutNewItem, newItem];
  };

  export const addItemsAsCopies = <T extends DnDZoneItem>(
    initialItems: T[],
    itemsToAdd: T[]
  ): T[] => {
    const itemsWithoutNewItems = initialItems.filter((i) => !itemsToAdd.some((a) => a.id === i.id));
    const newItems = itemsToAdd.map(copyItem);
    return [...itemsWithoutNewItems, ...newItems];
  };
</script>

<script lang="ts" generics="T extends DnDZoneItem">
  import { type Snippet, untrack } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import {
    dndzone,
    type Options,
    type DndEvent,
    SOURCES,
    TRIGGERS,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
  } from 'svelte-dnd-action';
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
    duplicateOnDrop = false,
    awaitingCopy = $bindable(false),
  }: DivProps & {
    items: T[];
    options?: Omit<Options<T>, 'items'>;
    renderItem: ItemSnippet;
    dragDisabled?: boolean;
    useDragHandle?: boolean;
    zoneName?: string;
    duplicateOnDrop?: boolean;
    awaitingCopy?: boolean;
  } = $props();

  let dragHandles: HTMLElement[] = $state([]);
  let useDragHandle = $derived(dragHandles.length > 0);

  const initialItems = items;

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

    handleDrop(e);

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  };

  const handleSort = (e: CustomEvent<DndEvent<T>>) => {
    items = e.detail.items;
  };

  const handleDrop = (e: CustomEvent<DndEvent<T>>) => {
    handleSort(e);

    if (duplicateOnDrop) {
      awaitingCopy = true;
    }
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

  $effect(() => {
    if (duplicateOnDrop && awaitingCopy) {
      awaitingCopy = false;
      const missingItems = initialItems.filter((item) => !items.includes(item));

      items = addItemsAsCopies(initialItems, missingItems);
    }
  });
</script>

<div
  class={cn('bg-card-level-4 rounded-lg border-2 border-dashed p-2', className)}
  use:dndzone={{
    items,
    flipDurationMs: 200,
    dragDisabled,
    centreDraggedOnCursor: true,
    dropFromOthersDisabled: duplicateOnDrop,
    dropTargetClasses: ['border-primary'],
    dropTargetStyle: {},
    ...options,
  }}
  on:consider={useDragHandle ? handleConsiderWithDragHandle : handleSort}
  on:finalize={useDragHandle ? handleFinalizeWithDragHandle : handleDrop}
>
  {#each items as item (item.id)}
    {@render renderItem(item, dragHandle)}
  {/each}
</div>

<style lang="postcss">
</style>
