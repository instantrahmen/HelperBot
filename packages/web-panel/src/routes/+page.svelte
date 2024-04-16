<script lang="ts">
  import userStore from '$lib/stores/user.svelte';

  export let data;

  const userState = userStore();
</script>

<h1 class="my-4 text-3xl font-bold">Control Panel</h1>

{#if !data.user}
  <a href="/auth" class="my-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >Login</a
  >
{:else}
  <pre>{JSON.stringify(data.user, null, 2)}</pre>
  <a
    href="/auth/logout"
    class="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-red-700"
    >Logout</a
  >
{/if}
