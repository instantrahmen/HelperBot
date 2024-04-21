<script lang="ts">
  import type { PresenceStatus } from '$lib/types/discord';
  let { src, status = 'default' }: { src: string; status: PresenceStatus | 'default' } = $props();

  import * as Avatar from '$lib/components/ui/avatar/';
  import { cn } from '$lib/utils';

  const borderColors = {
    online: 'border-green-500',
    idle: 'border-yellow-500',
    offline: 'border-gray-500',
    dnd: 'border-red-500',
    default: '',
  } as { [key in PresenceStatus | 'default']?: string };
</script>

<Avatar.Root class={cn('h-10 w-10 border-2', borderColors[status] ?? '')}>
  <Avatar.Image class="h-full w-full rounded-full object-cover" {src} />
  <Avatar.Fallback class="h-full w-full rounded-full bg-muted" />
</Avatar.Root>

<style lang="postcss">
</style>
