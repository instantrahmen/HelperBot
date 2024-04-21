<!-- Members Table -->
<script lang="ts">
  import type { GuildMemberResponse } from '$lib/types/discord';
  import { readable, type Readable } from 'svelte/store';
  import { createTable, Render, Subscribe, createRender, Column } from 'svelte-headless-table';
  import {
    addPagination,
    addSortBy,
    addHiddenColumns,
    addResizedColumns,
    type ResizedColumnsColumnOptions,
    type ResizedColumnsState,
    type HiddenColumnsState,
    type PaginationState,
  } from 'svelte-headless-table/plugins';
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
  import Bot from 'lucide-svelte/icons/bot';
  import Avatar from './Avatar.svelte';
  import type { PresenceStatus } from 'discord.js';
  import { formatDate } from 'date-fns';
  import Timestamp from './Timestamp.svelte';
  import DiscordBoost from '$lib/components/icons/discord-boost.svelte';
  import Conditional from './Conditional.svelte';

  let tableWidth: number = $state(0);

  type AvatarProps = { src: string; status: PresenceStatus | null };

  type TransformedMember = GuildMemberResponse & {
    avatarProps: AvatarProps;
    joined: {
      timestamp: number;
      formatted: string;
    };
    boostStatus: boolean;
    botUser: boolean;
  };

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

  const sortBool = (a: boolean, b: boolean) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
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
      boostStatus: member.data.premiumSinceTimestamp !== null,
      botUser: member.user.bot,
    };
  };

  const transformedMembers: Readable<TransformedMember[]> = readable(members.map(transformMember));

  const table = createTable<TransformedMember>(transformedMembers, {
    page: addPagination(),
    sort: addSortBy({
      toggleOrder: ['asc', 'desc'],
    }),
    hide: addHiddenColumns(),
    resize: addResizedColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: '',
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
        resize: {
          minWidth: 46,
          initialWidth: 46,
          maxWidth: 46,
        } as ResizedColumnsColumnOptions,
      },
    }),
    // table.column({
    //   header: 'Name',
    //   accessor: 'displayName',
    // }),
    table.column({
      header: 'Name',
      accessor: 'username',
      plugins: {
        resize: {
          minWidth: 50,
          initialWidth: 85,
          maxWidth: 100,
        } as ResizedColumnsColumnOptions,
      },
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
        resize: {
          minWidth: 45,
          initialWidth: 85,
          maxWidth: 85,
        } as ResizedColumnsColumnOptions,
      },
    }),
    table.column({
      header: (props) => {
        return createRender(DiscordBoost, {
          show: true,
        });
      },

      accessor: 'boostStatus',
      cell: (props) => {
        return createRender(DiscordBoost, { show: props.value });
      },
      plugins: {
        resize: {
          minWidth: 28,
          initialWidth: 50,
          maxWidth: 50,
        } as ResizedColumnsColumnOptions,
        sort: {
          compareFn: sortBool,
        },
      },
    }),
    table.column({
      header: 'Bot',
      accessor: 'botUser',
      cell: (props) => {
        return createRender(Conditional, {
          show: props.value,
          component: {
            component: Bot,
            props: {},
          },
        });
      },
      plugins: {
        resize: {
          minWidth: 28,
          initialWidth: 36,
          maxWidth: 36,
        } as ResizedColumnsColumnOptions,
        sort: {
          compareFn: sortBool,
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
    sm: 450,
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
    sm: ['joined'],
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

  let totalCols = $derived(flatColumns.length);

  const lastCol = (curCol: number) => curCol >= totalCols - 1;
</script>

<div>
  <div class="rounded-md border" bind:clientWidth={tableWidth}>
    <!-- {JSON.stringify($hiddenColumnIds)}
    {JSON.stringify(hiddenIds)} -->
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell, i (cell.id)}
                {@const firstColumn = i === 0}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                  {#if firstColumn}
                    <Table.Head {...attrs} class="m-0 p-0 text-center">
                      <Button variant="ghost" class="m-0 w-full p-1" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <ArrowUpDown class={'h-4 w-4'} />
                      </Button>
                    </Table.Head>
                  {:else}
                    <Table.Head {...attrs} class="m-0 p-0 text-center">
                      <Button
                        variant="ghost"
                        class="m-0 w-full justify-center gap-1 p-1 text-center"
                        on:click={props.sort.toggle}
                      >
                        <Render of={cell.render()} />
                        <ArrowUpDown class={'h-4 w-4'} />
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
              {#each row.cells as cell, i (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs} class="m-0 overflow-ellipsis p-1 text-center">
                    <span class="mx-auto inline-block w-fit text-center">
                      <Render of={cell.render()} />
                    </span>
                  </Table.Cell>
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
