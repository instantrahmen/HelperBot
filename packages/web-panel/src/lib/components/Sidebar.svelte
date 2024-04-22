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

<aside class="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
  <nav class="mt-[57px] flex flex-col items-center gap-8 px-2 sm:py-8">
    {#each links as link}
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <a
            href={link.href}
            class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            use:builder.action
            {...builder}
          >
            <svelte:component this={link.icon} class="h-7 w-7" />
            <span class="sr-only">{link.name}</span>
          </a>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">{link.name}</Tooltip.Content>
      </Tooltip.Root>
    {/each}
  </nav>

  <!-- Tail Links -->
  <nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
    {#each tailLinks as link}
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <a
            href={link.href}
            class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            use:builder.action
            {...builder}
          >
            <svelte:component this={link.icon} class="h-5 w-5" />
            <span class="sr-only">{link.name}</span>
          </a>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">{link.name}</Tooltip.Content>
      </Tooltip.Root>
    {/each}
    <!-- <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <a
          href="##"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          use:builder.action
          {...builder}
        >
          <Settings class="h-5 w-5" />
          <span class="sr-only">Settings</span>
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">Settings</Tooltip.Content>
    </Tooltip.Root> -->
  </nav>
</aside>
