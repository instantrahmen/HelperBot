<!-- Members Table -->
<script lang="ts">
  import type { GuildMemberResponse } from '$lib/types/discord';
  import { readable, type Readable } from 'svelte/store';
  import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
  import {
    addPagination,
    addSortBy,
    addHiddenColumns,
    type HiddenColumnsState,
    type PaginationState,
  } from 'svelte-headless-table/plugins';
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
  import Avatar from './Avatar.svelte';
  import type { PresenceStatus } from 'discord.js';
  import { formatDate } from 'date-fns';
  import Timestamp from './Timestamp.svelte';

  let tableWidth: number = $state(0);

  type AvatarProps = { src: string; status: PresenceStatus | null };

  type TransformedMember = GuildMemberResponse & {
    avatarProps: AvatarProps;
    joined: {
      timestamp: number;
      formatted: string;
    };
  };

  let { members }: { members: GuildMemberResponse[] } = $props();

  const transformMember = (member: GuildMemberResponse) => {
    return {
      ...member,
      avatarProps: { src: member.avatar, status: member.status },
      joined: {
        timestamp: member.joinedTimestamp,
        formatted: formatDate(member.joinedTimestamp, 'P'),
      },
    };
  };

  const transformedMembers: Readable<TransformedMember[]> = readable(members.map(transformMember));

  const table = createTable<TransformedMember>(transformedMembers, {
    page: addPagination(),
    sort: addSortBy({
      toggleOrder: ['asc', 'desc'],
    }),
    hide: addHiddenColumns(),
  });

  const sortStatus = (a: AvatarProps, b: AvatarProps) => {
    // sort in the order of: online, idle, dnd, offline
    const statuses = ['online', 'idle', 'dnd', 'offline'];
    const aStatus = statuses.indexOf(a.status || 'default');
    const bStatus = statuses.indexOf(b.status || 'default');
    if (aStatus > bStatus) return 1;
    if (aStatus < bStatus) return -1;
    return 0;
  };

  const sortDate = (a: TransformedMember['joined'], b: TransformedMember['joined']) => {
    let aDate = new Date(a.timestamp);
    let bDate = new Date(b.timestamp);

    return bDate.getTime() - aDate.getTime();
  };

  const columns = table.createColumns([
    table.column({
      header: 'Avatar',
      accessor: 'avatarProps',
      cell: (props) => {
        // const attrs = props.attrs();
        return createRender(Avatar, {
          src: props.value.src || '',
          status: props.value.status || 'default',
        });
      },
      plugins: {
        sort: {
          compareFn: sortStatus,
        },
      },
    }),
    // table.column({
    //   header: 'Name',
    //   accessor: 'displayName',
    // }),
    table.column({
      header: 'Username',
      accessor: 'username',
    }),
    table.column({
      header: 'Joined',
      accessor: 'joined',
      cell: (props) => {
        return createRender(Timestamp, { timestamp: props.value.timestamp });
      },
      plugins: {
        sort: {
          compareFn: sortDate,
        },
      },
    }),
  ]);

  type TableBeakpoints = {
    sm: number;
    md: number;
    lg: number;
  };

  const tableBreakpoints = {
    sm: 410,
    md: 512,
    lg: 938,

    current(tableWidth: number) {
      if (tableWidth < this.sm) return 'sm';
      if (tableWidth < this.md) return 'md';
      if (tableWidth < this.lg) return 'lg';
      return 'lg';
    },
  } as const;

  let currentBreakpoint: keyof TableBeakpoints = $derived(tableBreakpoints.current(tableWidth));

  const hiddenCols: Record<keyof TableBeakpoints, string[]> = {
    sm: ['username'],
    md: [],
    lg: [],
  };

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
    table.createViewModel(columns);
  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page as PaginationState;
  const { hiddenColumnIds } = pluginStates.hide as HiddenColumnsState;
  let hiddenIds = $derived(hiddenCols[currentBreakpoint]);

  $effect(() => {
    console.log('currentBreakpoint', currentBreakpoint);
    console.log('hiddenIds', hiddenIds);
    $hiddenColumnIds = hiddenIds;
  });
</script>

<div>
  <div class="rounded-md border" bind:clientWidth={tableWidth}>
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
