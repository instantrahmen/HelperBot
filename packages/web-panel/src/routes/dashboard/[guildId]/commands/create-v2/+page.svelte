<script lang="ts">
  import CreateCommand from '$lib/components/forms/CreateCommand/CreateCommand-v2.svelte';
  import { setBreadcrumbs } from '$lib/stores/breadcrumbs.svelte';

  let { data } = $props();

  setBreadcrumbs([
    {
      label: 'Home',
      href: `/`,
    },
    {
      label: 'Dashboard',
      href: `/dashboard/${data.guildId}`,
    },
    {
      label: 'Commands',
      href: `/dashboard/${data.guildId}/commands`,
    },
    {
      label: 'Create Command',
      href: `/dashboard/${data.guildId}/commands/create-v2`,
      active: true,
    },
  ]);
</script>

{#if !data.guildData}
  <div>Loading...</div>
{:else}
  <main class="flex flex-1 flex-col px-4">
    <CreateCommand guildData={data.guildData} />
  </main>
{/if}
