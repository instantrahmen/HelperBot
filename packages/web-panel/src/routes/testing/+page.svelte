<script lang="ts">
  import CreateCommand from '$lib/components/forms/CreateCommand/CreateCommand.svelte';
  import { cn } from '$lib/utils';
  import { guildDataStore } from '$lib/stores/guild-data.svelte';
</script>

<main class={cn('flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6')}>
  <CreateCommand></CreateCommand>
</main>
