<script lang="ts">
  import DiscordButton from '$lib/components/DiscordButton.svelte';
</script>

<main class="flex h-full flex-col items-center justify-center">
  <form method="POST" action="?/login">
    <DiscordButton
      type="submit"
      class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      label="Login with Discord"
    />
  </form>
</main>
