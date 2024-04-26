<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/';

  let {
    class: className,
    level = 1,
    ...restProps
  }: HTMLAttributes<HTMLDivElement> & {
    level?: number;
  } = $props();
</script>

<div class={cn('card', `level-${level}`, className)} {...restProps}>
  <slot />
</div>
