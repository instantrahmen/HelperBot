<script lang="ts">
  import '../app.pcss';
  import { ModeWatcher } from 'mode-watcher';
  import Cat from 'lucide-svelte/icons/cat';
  import Bird from 'lucide-svelte/icons/bird';
  import Fish from 'lucide-svelte/icons/fish';
  import Rabbit from 'lucide-svelte/icons/rabbit';
  import Squirrel from 'lucide-svelte/icons/squirrel';
  import Gauge from 'lucide-svelte/icons/gauge';
  import SquareUser from 'lucide-svelte/icons/square-user';

  import { Button } from '$lib/components/ui/button/';
  import * as Select from '$lib/components/ui/select/';

  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  import activeGuildStore, { fetchGuildData } from '$lib/stores/active-guild.svelte';
  import userStore from '$lib/stores/user.svelte';

  let { data } = $props();

  let activeGuild = activeGuildStore();

  let userState = userStore();

  userState.state.user = data.user;

  userState.state.auth = {
    accessToken: data.accessToken,
    meta: data.meta,
  };

  let guildId = $derived(activeGuild.state.selected.value);

  $effect(() => {
    fetchGuildData(data.accessToken, guildId);
  });
</script>

<ModeWatcher />

<div class="grid h-screen w-full pl-[53px]">
  <Sidebar
    links={[
      {
        name: 'Dashboard',
        icon: Gauge,
        href: '/dashboard',
      },
      {
        name: 'Cat',
        icon: Cat,
        href: '/cat',
      },
      {
        name: 'Bird',
        icon: Bird,
        href: '/bird',
      },
      {
        name: 'Fish',
        icon: Fish,
        href: '/fish',
      },
      {
        name: 'Rabbit',
        icon: Rabbit,
        href: '/rabbit',
      },
      {
        name: 'Squirrel',
        icon: Squirrel,
        href: '/squirrel',
      },
    ]}
  />
  <div class="flex flex-col">
    <header class="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <h1 class="text-xl font-semibold">Helper Bot</h1>
      <span>{guildId}</span>
      <div class="ml-auto flex gap-2">
        <ModeToggle />
        {#if data.user}
          <Select.Root portal={null} bind:selected={activeGuild.state.selected}>
            <Select.Trigger class="w-[180px]">
              <Select.Value placeholder="Select a server" />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Servers</Select.Label>
                {#each (data.user.meta as any).guilds as server}
                  <Select.Item value={server.id} label={server.name}>{server.name}</Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
            <Select.Input name="favoriteFruit" />
          </Select.Root>
        {:else}
          <!-- form action default for /auth  -->
          <form action="/auth?/login" method="POST">
            <!-- sign in with discord button -->
            <Button variant="outline" size="sm" class="gap-1.5 text-sm">
              <SquareUser class="size-3.5" />
              Sign In
            </Button>
          </form>
        {/if}
      </div>
    </header>
    <div class="m-4 flex-1 overflow-auto">
      <!-- <pre>
        {JSON.stringify({ userState }, null, 2)}
      </pre> -->
      <slot />
    </div>
  </div>
</div>
