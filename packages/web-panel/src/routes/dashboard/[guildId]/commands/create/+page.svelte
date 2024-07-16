<script lang="ts">
  import { Button } from '$lib/components/ui/button/';
  import * as Card from '$lib/components/ui/card/';
  import { Input } from '$lib/components/ui/input';
  import { CommandsTypeOptions } from '$lib/types/gen/pocketbase-types';
  import Dropdown from '$lib/components/SelectDropdown.svelte';
  import { userStore } from '$lib/stores/user.svelte';
  import { activeGuildStore } from '$lib/stores/active-guild.svelte';
  import type { Selected } from 'bits-ui';
  import { Root } from '$lib/components/ui/accordion';
  import { setBreadcrumbs } from '$lib/stores/breadcrumbs.svelte';

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
    },
    {
      label: 'Create Command',
      href: `/dashboard/${data.guildId}/commands/create`,
      active: true,
    },
  ]);

  let userState = userStore();
  let activeGuild = activeGuildStore();

  type CommandTypes = Selected<string> & {
    value: CommandsTypeOptions;
  };

  type CommandActionTypes = Selected<string> & {
    value: '';
  };

  let commandTypes: CommandTypes[] = [
    {
      label: 'Text Command',
      value: CommandsTypeOptions.response,
    },
    {
      label: 'Slash Command',
      value: CommandsTypeOptions.slash,
    },
  ];

  let commandType: CommandTypes | undefined = $state();
  let commandName: string = $state('');
  let commandResponse: string = $state('');

  const validateForm = () => {
    if (!commandType) {
      return false;
    }
    if (!commandName.trim() && !(commandName.trim().length > 3)) {
      return false;
    }
    if (!commandResponse.trim() && !(commandResponse.length > 8)) {
      return false;
    }
    return true;
  };

  let formValid = $derived(validateForm());
</script>

<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl">Commands</h1>
  </div>
  <div
    class="flex min-h-96 flex-1 items-center justify-center rounded-lg border border-dashed p-4 shadow-sm"
  >
    <Card.Root class="w-full p-3">
      <Card.Header>
        <Card.Title class="text-lg font-semibold">Create Command</Card.Title>
      </Card.Header>
      <Card.Content>
        <form method="POST">
          <div class="flex w-full flex-1 flex-row items-center justify-start gap-2 align-middle">
            Create a
            <Dropdown label="Command Type" items={commandTypes} bind:selected={commandType}>
              {#snippet renderItem(item: CommandTypes)}
                {item.label}
              {/snippet}
            </Dropdown>
            <input type="hidden" name="commandType" value={commandType?.value} />

            {#if commandType || true}
              named
              <Input
                type="text"
                name="commandName"
                bind:value={commandName}
                class="max-w-40"
                required
                autocomplete="off"
              />
            {/if}

            {#if commandName.length > 3 || true}
              <span class="flex flex-1 flex-row items-center justify-end gap-2 align-middle">
                Respond with
                <Input
                  type="text"
                  name="response"
                  bind:value={commandResponse}
                  class="max-w-80"
                  required
                  autocomplete="off"
                />
              </span>
            {/if}
          </div>
          <div class="mt-4 flex w-full flex-1 flex-row justify-end gap-2 align-middle">
            <Button class="" type="submit" disabled={!formValid}>Create Command</Button>
          </div>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
</main>
