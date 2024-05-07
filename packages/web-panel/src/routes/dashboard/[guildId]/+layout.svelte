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
  import { sidebarStore } from '$lib/stores/sidebar.svelte';
  import { beforeNavigate } from '$app/navigation';

  let { data } = $props();

  let activeGuildState = activeGuildStore();
  let userState = userStore();
  let guildDataState = guildDataStore();

  $effect(() => {
    console.log({ guildChange: data.guildId });
    setActiveGuild(data.guildId, activeGuildState, userState);

    fetchGuildData(data.guildId, guildDataState, {
      guildData: data.guildData || undefined,
    });
  });

  let breadCrumbsState = breadcrumbsStore();

  let sidebarState = sidebarStore();

  beforeNavigate((navigation: import('@sveltejs/kit').BeforeNavigate) => {
    console.log({ beforeNavigate: navigation });
    if (!navigation.to?.route.id?.startsWith('/dashboard')) {
      console.log('close sidebar', navigation.to?.route.id);
      sidebarState.state.open = false;
    }
  });
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

<div class="flex flex-1 flex-col sm:py-4 sm:pl-16">
  <div class="p-4">
    <Breadcrumbs maxBreadcrumbs={3} />
  </div>

  <slot />
</div>

<style lang="postcss">
</style>
