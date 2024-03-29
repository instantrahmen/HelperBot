<script lang="ts">
  export let data;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if !data.user}
  <a href="/auth" class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >Login</a
  >
{:else}
  <a href="/auth/logout" class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-red-700"
    >Logout</a
  >
{/if}
