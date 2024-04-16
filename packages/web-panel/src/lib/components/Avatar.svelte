<script lang="ts">
  let { src }: { src: string } = $props();
  import * as Avatar from '$lib/components/ui/avatar/';
</script>

<Avatar.Root class="h-10 w-10">
  <Avatar.Image class="h-full w-full rounded-full object-cover" {src} />
  <Avatar.Fallback class="h-full w-full rounded-full bg-muted" />
</Avatar.Root>

<style lang="postcss">
</style>
