<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/';
  import breadcrumbsStore, {
    setBreadcrumbs,
    type Breadcrumb as BreadcrumbType,
  } from '$lib/stores/breadcrumbs.svelte';

  let breadcrumbsState = breadcrumbsStore();

  let {
    maxBreadcrumbs = 5,
    showLastSeparator = false,
  }: { maxBreadcrumbs?: number; showLastSeparator?: boolean } = $props();

  const ellipsisBreadcrumb: BreadcrumbType = {
    label: 'ELLIPSIS',
    href: '',
    active: false,
  };

  const filterBreadcrumbs = (bcs: BreadcrumbType[]) => {
    if (bcs.length <= maxBreadcrumbs) {
      return bcs;
    }
    return [bcs[0], ellipsisBreadcrumb, ...bcs.slice(-maxBreadcrumbs + 1)];
  };

  let breadcrumbs = $derived(filterBreadcrumbs(breadcrumbsState.state));
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    {#each breadcrumbs as bc, i}
      <Breadcrumb.Item>
        {#if bc.label === 'ELLIPSIS'}
          <Breadcrumb.Ellipsis />
        {:else if !bc.active}
          {#if bc.href}
            <Breadcrumb.Link href={bc.href}>{bc.label}</Breadcrumb.Link>
          {:else}
            <Breadcrumb.Item>{bc.label}</Breadcrumb.Item>
          {/if}
        {:else}
          <Breadcrumb.Page>{bc.label}</Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>

      {#if i < breadcrumbs.length - 1 || showLastSeparator}
        <Breadcrumb.Separator />
      {/if}
    {/each}
  </Breadcrumb.List>
  <!-- <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List> -->
</Breadcrumb.Root>

<style lang="postcss">
</style>
