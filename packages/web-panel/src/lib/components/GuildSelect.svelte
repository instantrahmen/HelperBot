<script lang="ts">
  import userStore from '$lib/stores/user.svelte';
  import activeGuildStore from '$lib/stores/active-guild.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { CircleAlert } from 'lucide-svelte';
  import Dropdown from './SelectDropdown.svelte';
  import { goto } from '$app/navigation';
  import { buildRoute } from '$lib/utils/routing';

  let userState = userStore();
  let activeGuildState = activeGuildStore();

  let meta = $derived(userState.state.auth?.meta);
  let guilds = $derived(meta?.guilds || []);
  let loggedIn = $derived(!!userState.state.user && !!meta);
  let items = $derived(guilds.map((g) => ({ value: g.id, label: g.name, ...g })));

  const changeGuild = (guildId: string) => {
    console.log({ changeGuild: guildId });
    if (!loggedIn) return;
    if ($page.params.guildId === guildId) return;

    if ($page.route.id?.includes('[guildId]')) {
      // goto(`/dashboard/${guildId}`);
      const newRoute = buildRoute($page.route.id, { guildId });
      goto(newRoute);
    } else {
      activeGuildState.state.selected = items.find((i) => i.value === guildId);
    }
  };

  onMount(async () => {
    // get active guild
    if (!loggedIn) return;
    console.log('getting active guild');
    const activeGuild = $page.params.guildId || userState.state.user?.active_guild || guilds[0].id;
    if (activeGuild && activeGuild !== $page.params.guildId) {
      console.log('changing guild');
      changeGuild(activeGuild);
    } else {
      console.log('no active guild');
    }
  });
</script>

<Dropdown
  {items}
  bind:selected={activeGuildState.state.selected}
  onChange={(selected) => changeGuild(selected?.value || guilds[0].id)}
  class="sm:border-input sm:bg-background border-0 sm:border"
>
  {#snippet renderItem(item)}
    {#if !item.botAccess}
      <CircleAlert class="text-destructive mr-1 inline size-3.5" />
    {/if}{item.label}
  {/snippet}
</Dropdown>
