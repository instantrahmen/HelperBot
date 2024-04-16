<script lang="ts">
  import Activity from 'lucide-svelte/icons/activity';
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import CreditCard from 'lucide-svelte/icons/credit-card';
  import DollarSign from 'lucide-svelte/icons/dollar-sign';
  import Users from 'lucide-svelte/icons/users';

  import * as Avatar from '$lib/components/ui/avatar/';
  import { Button } from '$lib/components/ui/button/';
  import * as Card from '$lib/components/ui/card/';

  import { userStore } from '$lib/stores/user.svelte';
  import { activeGuildStore } from '$lib/stores/active-guild.svelte';

  let userState = userStore();
  let guild = activeGuildStore();
</script>

<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl">Commands</h1>
  </div>
  <div
    class="flex min-h-96 flex-1 items-center justify-center rounded-lg border border-dashed p-4 shadow-sm"
  >
    <div class="flex flex-col items-center gap-1 text-center">
      <h3 class="text-2xl font-bold tracking-tight">You have no commands yet</h3>
      <p class="text-sm text-muted-foreground">Get started by creating a new command</p>
      <Button class="mt-4" href="/dashboard/commands/new">Create Command</Button>
    </div>
  </div>
</main>

<style lang="postcss">
</style>
