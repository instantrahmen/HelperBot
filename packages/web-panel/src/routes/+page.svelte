<script lang="ts">
  import Json from '$lib/components/Json.svelte';
  import userStore from '$lib/stores/user.svelte';
  import LinksGrid from '$lib/components/LinksGrid.svelte';
  import { Cog, FlaskConical, LayoutDashboard, SquareTerminal, User, Users } from 'lucide-svelte';
  import activeGuildStore from '$lib/stores/active-guild.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { setBreadcrumbs } from '$lib/stores/breadcrumbs.svelte';

  let { data } = $props();

  let activeGuildState = activeGuildStore();

  let activeGuild = $derived(activeGuildState.state.selected?.value || 'unknown');

  setBreadcrumbs([
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Quick Links',
      active: true,
    },
  ]);
</script>

{#if !data.user}
  <a href="/auth" class="my-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >Login</a
  >
{:else}
  <div class="flex flex-1 flex-col px-16 py-4 sm:gap-4">
    <div class="p-4">
      <Breadcrumbs maxBreadcrumbs={3} />
    </div>

    <LinksGrid
      links={[
        {
          name: 'Dashboard',
          url: `/dashboard/${activeGuild}`,
          icon: LayoutDashboard,
        },
        {
          name: 'Commands',
          url: `/dashboard/${activeGuild}/commands`,
          icon: SquareTerminal,
        },
        { name: 'Members', url: `/dashboard/${activeGuild}/members`, icon: Users },

        {
          name: 'Settings',
          url: `/me/settings`,
          icon: Cog,
        },
        {
          name: 'Profile',
          url: `/me/profile`,
          icon: User,
        },
        {
          name: 'Testing Page',
          url: `/testing`,
          icon: FlaskConical,
        },
      ]}
    ></LinksGrid>
    <Json value={data.user} />
    <a
      href="/auth/logout"
      class="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      >Logout</a
    >
  </div>
{/if}
