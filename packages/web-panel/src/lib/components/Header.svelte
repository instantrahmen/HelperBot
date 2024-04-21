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

<header
  class="sticky top-0 z-20 flex h-[57px] items-center gap-1 border-b bg-background px-4 sm:py-1 sm:pl-14"
>
  <a href="/" class="flex-1 justify-center text-center text-xl font-semibold">
    <h1>Helper Bot</h1>
  </a>
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
