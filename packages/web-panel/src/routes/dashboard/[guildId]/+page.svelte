<script lang="ts">
  import { browser } from '$app/environment';
  import Activity from 'lucide-svelte/icons/activity';
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import Users from 'lucide-svelte/icons/users';
  import { Shadow as Loading } from 'svelte-loading-spinners';
  import DiscordBoost from '$lib/components/icons/discord-boost.svelte';
  import { Button } from '$lib/components/ui/button/';
  import * as Card from '$lib/components/ui/card/';

  import { activeGuildStore } from '$lib/stores/active-guild.svelte';
  import { fetchGuildData, guildDataStore } from '$lib/stores/guild-data.svelte';
  import { cn, createBotInviteLink } from '$lib/utils';
  import type { GuildMemberResponse } from '$lib/types/discord';
  import MembersTable from '$lib/components/MembersTable.svelte';
  import { setBreadcrumbs } from '$lib/stores/breadcrumbs.svelte';
  import Json from '$lib/components/Json.svelte';
  import { onMount } from 'svelte';

  let activeGuildState = activeGuildStore();
  let guildDataState = guildDataStore();
  let botAccess = $derived(activeGuildState.state.selected?.botAccess);
  let guildData = $derived(guildDataState.state !== 'loading' ? guildDataState.state : null);
  let loading = $derived(guildDataState.state === 'loading');
  let members = $derived(guildData?.members || []);

  let { data } = $props();

  setBreadcrumbs([
    {
      label: 'Dashboard',
      href: `/dashboard/${data.guildId}`,
    },
    {
      label: 'Home',
      href: `/dashboard/${data.guildId}`,
    },
  ]);

  let refetchData = () => fetchGuildData(data.guildId, guildDataState);

  let loadingDots = $state(0);
  const loadingDotsSpeed = 500;

  onMount(() => {
    let loadingDotsInterval = setInterval(() => {
      if (loadingDots >= 3) return (loadingDots = 0);
      loadingDots += 1;
    }, loadingDotsSpeed);

    return () => clearInterval(loadingDotsInterval);
  });
  let dots = $derived('.'.repeat(loadingDots));

  const filterOnline = (m: GuildMemberResponse) => m.status === 'online';
  const filterIdle = (m: GuildMemberResponse) => m.status === 'idle';

  const getScreenSize = () =>
    browser
      ? {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      : { width: 0, height: 0 };
</script>

<main class="relative flex min-h-64 flex-1 flex-col gap-4 p-4 md:gap-8">
  <!-- {$page.url.pathname} -->
  <span class={cn('flex flex-row justify-between', botAccess ? 'items-center' : 'items-start')}>
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <Button on:click={refetchData}>Refresh</Button>
  </span>
  {#if loading}
    <div class="mx-auto flex h-full flex-1 flex-col justify-center text-center">
      <!-- <Card.Content> -->
      <span class="inline-block p-6">
        <Loading size="60" color="#FF3E00" unit="px" duration="1s" />
      </span>
      <h3 class="text-2xl font-bold">Loading{dots}</h3>
      <!-- </Card.Content> -->
    </div>
  {:else if !guildData}
    <Card.Root>
      <Card.Content>
        <div class="text-2xl font-bold">Guild not found</div>
      </Card.Content>
    </Card.Root>
  {:else if !botAccess}
    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Server not available</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">Please invite the bot to your server</div>
        <Button
          variant="outline"
          on:click={() =>
            window.open(
              createBotInviteLink(data.clientId),
              '_blank',
              `height=600,width=800,resizable=1,left=${getScreenSize().width / 2 - 200},top=${getScreenSize().height / 2 - 150}`
            )}
        >
          Invite Helper
        </Button>
      </Card.Content>
    </Card.Root>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <!-- Server Name -->
      <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">Server Name</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">{guildData.name}</div>
          <!-- <p class="text-xs text-muted-foreground">+20.1% from last month</p> -->
        </Card.Content>
      </Card.Root>

      <!-- Subscriptions/Boosts -->
      <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">Server Boosts</Card.Title>
          <DiscordBoost class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">{guildData.premium_subscription_count}</div>
          <p class="text-xs text-muted-foreground">Server level {guildData.premium_tier}</p>
        </Card.Content>
      </Card.Root>

      <!-- Server Members -->
      <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">Server Members</Card.Title>
          <Users class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">{guildData.members.length}</div>
        </Card.Content>
      </Card.Root>

      <!-- Active and Idle Members -->
      <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <Card.Title class="text-sm font-medium">Active Now</Card.Title>
          <Activity class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">{guildData.members.filter(filterOnline).length}</div>
          <p class="text-xs text-muted-foreground">
            {guildData.members.filter(filterIdle).length} currently idle
          </p>
        </Card.Content>
      </Card.Root>
    </div>

    <!-- Server Info -->
    <div class="relative grid w-full max-w-full gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-5">
      <Card.Root class="xl:col-span-2">
        <Card.Header class="flex flex-row items-center">
          <div class="grid gap-2">
            <Card.Title>Server Info</Card.Title>
            <Card.Description>Discord server info</Card.Description>
          </div>
          <Button href="##" size="sm" class="ml-auto gap-1">
            View All
            <ArrowUpRight class="h-4 w-4" />
          </Button>
        </Card.Header>
        <Card.Content class="w-full">
          <Json value={guildData} />
        </Card.Content>
      </Card.Root>

      <!-- Members List -->
      <Card.Root class="xl:col-span-3">
        <Card.Header>
          <Card.Title>Members</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-8">
          <MembersTable {members}></MembersTable>
        </Card.Content>
      </Card.Root>
    </div>
  {/if}
</main>

<style lang="postcss">
</style>
