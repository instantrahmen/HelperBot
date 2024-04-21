<script lang="ts">
  import { cn } from '$lib/utils';

  let { class: className, show = true }: { class?: string; show?: boolean } = $props();
</script>

{#if show}
  <svg
    aria-label="Server boosting since Mar 3, 2024"
    class={cn('premiumIcon__58b74 icon__07c5b', className)}
    aria-hidden="false"
    role="img"
    width="24"
    height="24"
    viewBox="0 0 8 12"
    ><path
      d="M4 0L0 4V8L4 12L8 8V4L4 0ZM7 7.59L4 10.59L1 7.59V4.41L4 1.41L7 4.41V7.59Z"
      fill="currentColor"
    ></path><path d="M2 4.83V7.17L4 9.17L6 7.17V4.83L4 2.83L2 4.83Z" fill="currentColor"
    ></path></svg
  >
{/if}
