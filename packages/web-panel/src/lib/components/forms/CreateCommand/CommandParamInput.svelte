<script lang="ts">
  import '@cartamd/plugin-emoji/default.css';
  import { cn } from '$lib/utils';
  import type { BotEventParamsInput, BotEventParamsTextarea } from '$lib/types/commands';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Label } from '$lib/components/ui/label';

  import { Carta, MarkdownEditor } from 'carta-md';
  import { emoji } from '@cartamd/plugin-emoji';

  const carta = new Carta({
    extensions: [emoji()],
    sanitizer: (s) => s,
  });

  import { Lock, Unlock, X, Save, Edit } from 'lucide-svelte';

  let {
    param,
    lockable = false,
    value = $bindable(''),
    class: className,
    visibleLabel = false,
  }: {
    param: BotEventParamsInput | BotEventParamsTextarea;
    lockable?: boolean;
    value?: string;
    class?: string;
    visibleLabel?: boolean;
  } = $props();

  let leadingLabel = $derived('leadingLabel' in param ? param.leadingLabel ?? null : null);
  let imagePreview = $derived('imagePreview' in param ? param.imagePreview ?? null : null);

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

    if (imagePreview) {
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

{#if imagePreview && imageUrl}
  <img src={imageUrl} alt={param.label} class="w-full rounded-lg border" />
{/if}

<Label for={param.id} class={cn(!visibleLabel && 'sr-only')}>{param.label}</Label>
{#if param.type === 'input'}
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
{:else if param.type === 'textarea'}
  {@const { required, id, label } = param}
  <div class={cn('relative', 'rounded-b-lg', 'rounded-t-lg', 'border-t', 'bg-card-level-1')}>
    <Textarea
      {id}
      {required}
      name={id}
      placeholder={label}
      bind:value
      class={cn('block w-full px-4 py-3 pb-20 text-sm disabled:cursor-default', className)}
      disabled={locked}
    />
    {#if lockable}
      {#if locked}
        <Button
          class="absolute inset-y-0 end-0 flex items-center pe-px text-gray-500"
          variant="ghost"
          on:click={(e) => (locked = false)}
        >
          <Edit />
        </Button>
      {:else}
        <Button
          variant="ghost"
          class="absolute inset-y-0 end-0 flex items-center pe-px text-gray-500"
          on:click={lockInput}
        >
          <Save />
        </Button>
      {/if}
    {/if}
  </div>
{/if}

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
