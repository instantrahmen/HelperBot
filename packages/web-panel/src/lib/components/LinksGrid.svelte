<script lang="ts">
  type Link = {
    name: string;
    url: string;
    icon?: any;
    description?: string;
  };
  let { links = [] }: { links: Link[] } = $props();
</script>

<main class="container mx-auto p-4">
  <header class="mb-8">
    <h1 class="text-3xl font-bold tracking-tight">Quick Links</h1>
  </header>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each links as link}
      <a
        class="text-muted-foreground bg-card-level-3 hover:bg-card-level-1 hover:text-card-foreground group block overflow-hidden rounded-lg border shadow-lg transition-all"
        href={link.url}
        data-sveltekit-preload-data
        data-sveltekit-preload-code
      >
        <div class="bg-card-level-1 level-1 flex h-32 items-center justify-center">
          <svelte:component this={link.icon} class="h-10 w-10" />
        </div>
        <div class="border-t p-4 text-center">
          <h3 class="text-lg font-semibold tracking-tight">{link.name}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
        </div>
      </a>
    {/each}
  </div>
</main>
