<script lang="ts">
  import { cn } from '$lib/utils';
  import type { BotEventParamsInput } from '$lib/types/commands';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  import { Lock, Unlock, X, Save, Edit } from 'lucide-svelte';

  let {
    param,
    lockable,
    value = $bindable(''),
    class: className,
    visibleLabel = false,
  }: {
    param: BotEventParamsInput;
    lockable: boolean;
    value?: string;
    class?: string;
    visibleLabel?: boolean;
  } = $props();

  let leadingLabel = $derived(param.leadingLabel || null);

  let locked = $state(false);

  const isValidUrl = async (str: string) => {
    try {
      const url = new URL(str);

      const { headers } = await fetch(url);

      return headers.get('content-type')?.includes('image');
    } catch (e) {
      return false;
    }
  };

  const lockInput = async (): Promise<void> => {
    if (value.length < 3) {
      error = 'Please enter at least 3 characters';

      setTimeout(() => {
        error = null;
      }, 3000);
      return;
    }

    if (param.imagePreview) {
      if (await isValidUrl(value)) {
        imageUrl = value;
      } else {
        error = 'Please enter a valid image URL';
        return;
      }
    }

    locked = true;
  };

  let error: string | null = $state(null);

  let imageUrl: string | null = $state(null);

  $effect(() => {
    if (locked) {
      error = null;
    }
  });

  $effect(() => {
    if (value && param.transform) {
      value = param.transform(value);
    }
  });
</script>

{#if param.imagePreview && imageUrl}
  <img src={imageUrl} alt={param.label} class="w-full rounded-lg border" />
{/if}

<Label for={param.id} class={cn(!visibleLabel && 'sr-only')}>{param.label}</Label>
<div class={cn('relative', className)}>
  <Input
    id={param.id}
    name={param.id}
    placeholder={param.label}
    bind:value
    class={cn(
      'block w-full px-4 py-3 pe-20 text-sm disabled:cursor-default',
      leadingLabel && 'ps-9'
    )}
    required
    disabled={locked}
  />
  <div class="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
    <span class="text-primary">{leadingLabel}</span>
  </div>
  <div class="absolute inset-y-0 end-0 flex items-center pe-px text-gray-500">
    {#if lockable}
      {#if locked}
        <Button
          class="block w-full rounded-l-none border-transparent"
          variant="ghost"
          on:click={(e) => (locked = false)}
        >
          <Edit />
        </Button>
      {:else}
        <Button
          variant="ghost"
          class="block w-full rounded-l-none border-transparent"
          on:click={lockInput}
        >
          <Save />
        </Button>
      {/if}
    {/if}
  </div>
</div>
{#if error}
  <div
    class="bg-destructive text-destructive-foreground flex flex-row items-center justify-between rounded-lg px-4 py-1 align-middle"
  >
    {error}
    <Button
      variant="link"
      class="text-destructive-foreground hover:text-destructive-foreground/60 m-0 p-2 align-middle"
      on:click={(e) => (error = null)}><X class="h-4 w-4" /></Button
    >
  </div>
{/if}
