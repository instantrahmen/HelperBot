<script lang="ts">
  import { CircleAlert, SquareUser } from 'lucide-svelte';
  import ModeToggle from '$lib/components/ModeToggle.svelte';
  import { Button } from '$lib/components/ui/button/';
  import userStore from '$lib/stores/user.svelte';
  import GuildSelect from './GuildSelect.svelte';

  let userState = userStore();

  let user = $derived(userState.state.user);
  let meta = $derived(userState.state.auth?.meta);

  let loggedIn = $derived(!!user && !!meta);
</script>

<header class="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
  <h1 class="text-xl font-semibold">Helper Bot</h1>
  <div class="ml-auto flex gap-2">
    <ModeToggle />
    {#if loggedIn}
      <GuildSelect />
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

<style lang="postcss">
</style>
