<!-- A super simple conditional component to use with svelte-headless-table's createRender function -->

<script lang="ts">
  let {
    show = true,
    text = '',
    component,
  }: {
    show?: boolean;
    text?: string;
    component?: { component: any; props: { [key: string]: any } };
  } = $props();
</script>

{#if show}
  {text}
  {#if component}
    <svelte:component this={component.component} {...component.props || {}} />
  {/if}
{/if}
