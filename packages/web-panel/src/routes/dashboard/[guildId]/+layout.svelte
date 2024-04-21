<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Gauge from 'lucide-svelte/icons/gauge';
  import type { LayoutData } from './$types';
  import SquareTerminal from 'lucide-svelte/icons/square-terminal';
  import { onMount } from 'svelte';
  import activeGuildStore, { setActiveGuild } from '$lib/stores/active-guild.svelte';
  import { fetchGuildData, guildDataStore } from '$lib/stores/guild-data.svelte';
  import userStore from '$lib/stores/user.svelte';
  import breadcrumbsStore from '$lib/stores/breadcrumbs.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  let { data } = $props();

  let activeGuildState = activeGuildStore();
  let userState = userStore();
  let guildDataState = guildDataStore();

  $effect(() => {
    console.log({ guildChange: data.guildId });
    setActiveGuild(data.guildId, activeGuildState, userState);

    fetchGuildData(data.guildId, guildDataState);
  });

  let breadCrumbsState = breadcrumbsStore();

  let breadcrumbs = $derived(breadCrumbsState.state);
</script>

<Sidebar
  links={[
    {
      name: 'Dashboard',
      icon: Gauge,
      href: `/dashboard/${data.guildId}`,
    },
    {
      name: 'Commands',
      icon: SquareTerminal,
      href: `/dashboard/${data.guildId}/commands`,
      disabled: false,
    },
  ]}
/>

<div class="m-4 flex-1 overflow-auto">
  <div class="p-4">
    <Breadcrumbs maxBreadcrumbs={3} />
  </div>
  <!-- <pre>{JSON.stringify(breadcrumbs)}</pre> -->

  <slot />
</div>

<style lang="postcss">
</style>
