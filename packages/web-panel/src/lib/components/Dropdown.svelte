<script lang="ts" generics="T extends Selected<string>">
  import * as Select from '$lib/components/ui/select/';
  import { cn } from '$lib/utils';
  import type { Selected } from 'bits-ui';

  import type { Snippet } from 'svelte';

  type ItemSnippet = Snippet<[item: T]>;

  let {
    items,
    renderItem,
    selected = $bindable(),
    class: className,
    onChange,
    label = 'Select an item',
    name,
    placeholder = 'Select an item',
    ...restProps
  }: {
    items: T[];
    renderItem?: ItemSnippet;
    selected?: T;
    class?: string;
    onChange?: (item: T) => void;
    label?: string;
    name?: string;
    placeholder?: string;
  } = $props();

  const handleChange = (item?: Selected<string>) => {
    const selectedItem = items.find((i) => i.value === item?.value);

    console.log('value changed: ', selectedItem);
    onChange?.(selectedItem as T);
  };
</script>

<Select.Root portal={null} bind:selected onSelectedChange={handleChange} {name} {...restProps}>
  <Select.Trigger class={cn('w-[180px]', className)}>
    <Select.Value {placeholder} />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>{label}</Select.Label>
      {#each items as item}
        <Select.Item value={item.value} label={item.label}>
          {#if !!renderItem}
            {@render renderItem(item)}
          {:else}
            {item.label}
          {/if}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name="active-server" />
</Select.Root>
