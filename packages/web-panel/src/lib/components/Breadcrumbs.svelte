<script lang="ts">
  import { page } from '$app/stores';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/';
  import breadcrumbsStore, {
    setBreadcrumbs,
    type Breadcrumb as BreadcrumbType,
  } from '$lib/stores/breadcrumbs.svelte';

  let breadcrumbsState = breadcrumbsStore();

  let { maxBreadcrumbs = 5 }: { maxBreadcrumbs: number } = $props();

  const ellipsisBreadcrumb = {
    label: 'ELLIPSIS',
    href: '',
  };

  const filterBreadcrumbs = (bcs: BreadcrumbType[]) => {
    if (bcs.length <= maxBreadcrumbs) {
      return bcs;
    }
    return [bcs[0], ellipsisBreadcrumb, ...bcs.slice(-maxBreadcrumbs + 1)];
  };

  let breadcrumbs = $derived(filterBreadcrumbs(breadcrumbsState.state));

  setBreadcrumbs([
    {
      label: 'Dashboard',
      href: `/dashboard/${$page.params.guildId}`,
    },
  ]);
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    {#each breadcrumbs as bc, i}
      <Breadcrumb.Item>
        {#if bc.label === 'ELLIPSIS'}
          <Breadcrumb.Ellipsis />
        {:else}
          <Breadcrumb.Link href={bc.href}>{bc.label}</Breadcrumb.Link>
        {/if}
      </Breadcrumb.Item>

      {#if i < breadcrumbs.length - 1}
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
