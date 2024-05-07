<script lang="ts">
  import { Button } from '$lib/components/ui/button/';
  import { setBreadcrumbs } from '$lib/stores/breadcrumbs.svelte';
  import * as Card from '$lib/components/ui/card/';
  import { CommandsTypeOptions } from '$lib/types/gen/pocketbase-types';
  import { FileEditIcon } from 'lucide-svelte';
  import * as Avatar from '$lib/components/ui/avatar';
  import Json from '$lib/components/Json.svelte';
  let { data } = $props();

  setBreadcrumbs([
    {
      label: 'Home',
      href: `/`,
    },
    {
      label: 'Dashboard',
      href: `/dashboard/${data.guildId}`,
    },
    {
      label: 'Commands',
      href: `/dashboard/${data.guildId}/commands`,
      active: true,
    },
  ]);
</script>

<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6">
  <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-3xl font-bold">Discord Slash Commands</h1>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each data.commands as command}
        {@const createdBy = command.expand?.created_by ?? null}
        <Card.Root class="flex flex-col">
          <div class="flex-1 p-4">
            <h2 class="text-muted-foreground mb-2 text-lg font-semibold">
              {#if command.type.includes(CommandsTypeOptions.slash)}
                <span class="text-primary">/</span>
                <span class="text-accent-foreground m-0"> {command.name}</span>{command.type
                  .length > 1
                  ? ', '
                  : ''}
              {/if}
              {#if command.type.includes(CommandsTypeOptions.response)}
                <span class="">
                  "{command.name}"
                </span>
              {/if}
            </h2>
            <p class="text-gray-500 dark:text-gray-400">{command.reply}</p>
          </div>
          <div class="flex items-center justify-between px-4 pb-4">
            <div class="flex items-center space-x-2">
              <Avatar.Root>
                <Avatar.Image src={createdBy?.avatar} />
              </Avatar.Root>
              <span class="text-sm text-gray-500 dark:text-gray-400">{createdBy?.username}</span>
            </div>
            <Button class="ml-auto" size="icon" variant="ghost">
              <FileEditIcon class="h-5 w-5" />
              <span class="sr-only">Edit command</span>
            </Button>
          </div>
        </Card.Root>
      {:else}
        <Card.Root class="col-span-4">
          <div class="flex-1 p-4 text-center">
            <h3 class="text-2xl font-bold tracking-tight m-4">You have no commands yet</h3>
            <p class="text-sm text-muted-foreground m-4">Get started by creating a new command</p>
          </div>
        </Card.Root>
      {/each}
    </div>
    <div class="mt-8 flex justify-end gap-2">
      <Button href="/dashboard/{data.guildId}/commands/create">Create new command</Button>
      <Button href="/dashboard/{data.guildId}/commands/create-v2">Create new command [V2]</Button>
    </div>
  </div>

  <!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

  <Json value={data} />
</main>

<style lang="postcss">
</style>
