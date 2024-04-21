<script lang="ts">
  import { cn } from '$lib/utils';
  let width = $state(0);
  let windowWidth = $state(0);

  let genFiller = (length: number) => [...Array(length)].map((_, i) => i);

  const filler = genFiller(100);
</script>

<svelte:window bind:innerWidth={windowWidth} />
<div class="max-w-full bg-primary text-3xl" bind:clientWidth={width}>
  <!-- {`{width: ${width}, windowWidth: ${windowWidth}}`} -->
  <span class={cn(width > windowWidth ? 'bg-destructive' : 'bg-secondary')}>width: {width}</span> |
  <span>windowWidth: {windowWidth}</span>

  <div>{`{filler: ${filler}}`}</div>
</div>

<style lang="postcss">
</style>
