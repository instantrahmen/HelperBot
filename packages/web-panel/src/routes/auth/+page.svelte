<script lang="ts">
  import { getDiscordProvider, createDiscordOath2Url } from '$lib/utils/auth';
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/stores';
</script>

<main>
  <form method="POST">
    <button
      type="submit"
      class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      Sign in with Discord
    </button>
  </form>
</main>
