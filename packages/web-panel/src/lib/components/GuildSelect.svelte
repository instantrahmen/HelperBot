<script lang="ts">
  import * as Select from '$lib/components/ui/select/';
  import userStore from '$lib/stores/user.svelte';
  import activeGuildStore from '$lib/stores/active-guild.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { CircleAlert } from 'lucide-svelte';
  import Dropdown from './Dropdown.svelte';
  import { goto } from '$app/navigation';

  let userState = userStore();
  let activeGuildState = activeGuildStore();

  let meta = $derived(userState.state.auth?.meta);
  let guilds = $derived(meta?.guilds || []);
  let loggedIn = $derived(!!userState.state.user && !!meta);
  let items = $derived(guilds.map((g) => ({ value: g.id, label: g.name, ...g })));

  // let defaultGuild = $derived(guilds.find((g: any) => g.id === user?.active_guild) || guilds[0]);
  // let selectedGuild = $state({
  //   value: defaultGuild?.id,
  //   label: defaultGuild?.name || '',
  // });

  const changeGuild = (guildId: string) => {
    console.log({ changeGuild: guildId });
    if (!loggedIn) return;
    if ($page.params.guildId === guildId) return;

    goto(`/dashboard/${guildId}`);
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
>
  {#snippet renderItem(item)}
    {#if !item.botAccess}
      <CircleAlert class="mr-1 inline size-3.5 text-destructive" />
    {/if}{item.label}
  {/snippet}
</Dropdown>

<!-- <Select.Root
  portal={null}
  bind:selected={activeGuildState.state.selected}
  onSelectedChange={(selected) => changeGuild(selected?.value || guilds[0].id)}
>
  <Select.Trigger class="w-[180px]">
    <Select.Value placeholder="Select a server" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Servers</Select.Label>
      {#each guilds as server}
        <Select.Item value={server.id} label={server.name}
          >{#if !server.botAccess}
            <CircleAlert class="mr-1 size-3.5 text-destructive" />
          {/if}{server.name}</Select.Item
        >
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name="active-server" />
</Select.Root> -->
