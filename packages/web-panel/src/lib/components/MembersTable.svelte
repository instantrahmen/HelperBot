<!-- Members Table -->
<script lang="ts">
  import type { GuildMemberResponse } from '$lib/types/discord';
  import { readable } from 'svelte/store';
  import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
  import { addPagination, addSortBy } from 'svelte-headless-table/plugins';
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
  import Avatar from './Avatar.svelte';

  let { members }: { members: GuildMemberResponse[] } = $props();

  const table = createTable<GuildMemberResponse>(readable(members), {
    page: addPagination(),
    sort: addSortBy(),
  });

  const columns = table.createColumns([
    table.column({
      header: 'Avatar',
      accessor: 'avatar',
      cell: (props) => {
        // const attrs = props.attrs();
        return createRender(Avatar, {
          src: props.value,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
    table.column({
      header: 'Name',
      accessor: 'displayName',
    }),
    table.column({
      header: 'Username',
      accessor: 'username',
    }),
    table.column({
      header: 'Status',
      accessor: 'status',
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                  {#if cell.id === 'avatar'}
                    <Table.Head {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Head>
                  {:else}
                    <Table.Head {...attrs}>
                      <!-- <Render of={cell.render()} /> -->
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <ArrowUpDown class={'ml-2 h-4 w-4'} />
                      </Button>
                    </Table.Head>
                  {/if}
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  {#if cell.id === 'avatar'}
                    <Table.Cell {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Cell>
                  {:else}
                    <Table.Cell {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Cell>
                  {/if}
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  <div class="flex items-center justify-end space-x-4 py-4">
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
    >
  </div>
</div>

<style lang="postcss">
</style>
