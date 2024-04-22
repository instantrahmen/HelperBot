<script lang="ts">
  import CreateCommand from '$lib/components/forms/CreateCommand.svelte';
  import { cn } from '$lib/utils';
</script>

<main class={cn('flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6')}>
  <CreateCommand></CreateCommand>
</main>
