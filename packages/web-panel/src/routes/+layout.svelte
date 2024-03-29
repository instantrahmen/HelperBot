<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.pcss';

  export let data: any;

  const handleDiscordLogin = () => {
    console.log('Login with Discord');
  };
</script>

{#if data.user}
  <pre>{JSON.stringify(data.user, null, 2)}</pre>
{:else}
  <h1>not logged in</h1>
{/if}
<slot />
