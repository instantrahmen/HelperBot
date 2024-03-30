<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import '../app.pcss';
  import Triangle from 'lucide-svelte/icons/triangle';
  import IceCreamBowl from 'lucide-svelte/icons/ice-cream-bowl';
  // import { Cat, Dog, Heart, Bone, PawPrint, Bird, Fish, Rabbit, Squirrel } from 'lucide-svelte';
  import Dog from 'lucide-svelte/icons/dog';
  import Cat from 'lucide-svelte/icons/cat';
  import Bird from 'lucide-svelte/icons/bird';
  import Fish from 'lucide-svelte/icons/fish';
  import Rabbit from 'lucide-svelte/icons/rabbit';
  import Squirrel from 'lucide-svelte/icons/squirrel';
  import Gauge from 'lucide-svelte/icons/gauge';
  import Heart from 'lucide-svelte/icons/heart';
  import Bone from 'lucide-svelte/icons/bone';
  import PawPrint from 'lucide-svelte/icons/paw-print';
  import Share from 'lucide-svelte/icons/share';
  import SquareUser from 'lucide-svelte/icons/square-user';

  import { Button } from '$lib/components/ui/button/';
  import * as Tooltip from '$lib/components/ui/tooltip/';
  import * as Select from '$lib/components/ui/select/';

  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  export let data;
</script>

<ModeWatcher />

<div class="grid h-screen w-full pl-[53px]">
  <aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
    <div class="border-b p-2">
      <Button variant="outline" size="icon" aria-label="Home" href="/">
        <IceCreamBowl class="size-5" />
      </Button>
    </div>
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
  </aside>
  <div class="flex flex-col">
    <header class="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <h1 class="text-xl font-semibold">Helper Bot</h1>
      <div class="ml-auto flex gap-2">
        <ModeToggle />
        {#if data.user}
          <Select.Root portal={null}>
            <Select.Trigger class="w-[180px]">
              <Select.Value placeholder="Select a server" />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Servers</Select.Label>

                {#each (data.user.meta as any).guilds as server}
                  <Select.Item value={server.id} label={server.name}>{server.name}</Select.Item>
                {/each}
                <!-- <Select.Item value="Server 1" label="Midnight Oasis">Midnight Oasis</Select.Item>
                <Select.Item value="Server 2" label="Server 2">Server 2</Select.Item>
                <Select.Item value="Server 3" label="Server 3">Server 3</Select.Item> -->
              </Select.Group>
            </Select.Content>
            <Select.Input name="favoriteFruit" />
          </Select.Root>
        {:else}
          <!-- form action default for /auth  -->
          <form action="/auth">
            <!-- sign in with discord button -->
            <Button variant="outline" size="sm" class="gap-1.5 text-sm">
              <SquareUser class="size-3.5" />
              Sign In
            </Button>
          </form>
        {/if}
      </div>
      <!-- <Button variant="outline" size="sm" class="ml-auto gap-1.5 text-sm">
        <Share class="size-3.5" />
        Share
      </Button> -->
    </header>
    <div class="m-4 flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</div>
