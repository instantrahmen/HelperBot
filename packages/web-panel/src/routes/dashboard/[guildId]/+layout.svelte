<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Gauge from 'lucide-svelte/icons/gauge';
  import type { LayoutData } from './$types';
  import SquareTerminal from 'lucide-svelte/icons/square-terminal';
  import { onMount } from 'svelte';
  import activeGuildStore, { setActiveGuild } from '$lib/stores/active-guild.svelte';
  import { fetchGuildData, guildDataStore } from '$lib/stores/guild-data.svelte';
  import userStore from '$lib/stores/user.svelte';
  let { data } = $props();

  let activeGuildState = activeGuildStore();
  let userState = userStore();
  let guildDataState = guildDataStore();

  $effect(() => {
    console.log({ guildChange: data.guildId });
    setActiveGuild(data.guildId, activeGuildState, userState);

    fetchGuildData(data.guildId, guildDataState);
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

<div class="m-4 flex-1 overflow-auto">
  <!-- <h2>Dashboard for {data.guildId}</h2>
  <sub>{data.guildId} should === {activeGuildState.state.selected?.id}</sub> -->

  <slot />
</div>

<style lang="postcss">
</style>
