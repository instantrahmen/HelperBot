<script context="module" lang="ts">
  import { cn } from '$lib/utils/';
  export type SidebarLink = {
    name: string;
    icon: any;
    href: string;
    disabled?: boolean;
  };
</script>

<script lang="ts">
  import IceCreamBowl from 'lucide-svelte/icons/ice-cream-bowl';
  import LifeBuoy from 'lucide-svelte/icons/life-buoy';
  import SquareUser from 'lucide-svelte/icons/square-user';
  import LogOut from 'lucide-svelte/icons/log-out';

  import { Button } from '$lib/components/ui/button/index';
  import * as Tooltip from '$lib/components/ui/tooltip/';
  import { page } from '$app/stores';

  export let links: SidebarLink[] = [];
  export let tailLinks: SidebarLink[] = [
    {
      name: 'Settings',
      icon: LifeBuoy,
      href: '/settings',
    },
    {
      name: 'Profile',
      icon: SquareUser,
      href: '/profile',
    },
    {
      name: 'Sign out',
      icon: LogOut,
      href: '/auth/logout',
    },
  ];

  $: pathname = $page.url.pathname;
</script>

<aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
  <div class="border-b p-2">
    <Button variant="outline" size="icon" aria-label="Home" href="/">
      <IceCreamBowl class="size-5" />
    </Button>
  </div>
  <nav class="grid gap-1 p-2">
    {#each links as link}
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <Button
            variant="ghost"
            size="icon"
            class={cn('rounded-lg', pathname === link.href ? 'bg-muted' : 'bg-transparent')}
            aria-label={link.name}
            builders={[builder]}
            href={link.href}
            disabled={link.disabled}
          >
            <svelte:component this={link.icon} class="size-5" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={5}>{link.name}</Tooltip.Content>
      </Tooltip.Root>
    {/each}
  </nav>
  <nav class="mt-auto grid gap-1 p-2">
    {#each tailLinks as link}
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <Button
            variant="ghost"
            size="icon"
            class="rounded-lg"
            aria-label={link.name}
            builders={[builder]}
          >
            <svelte:component this={link.icon} class="size-5" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={5}>{link.name}</Tooltip.Content>
      </Tooltip.Root>
    {/each}
  </nav>
</aside>
