<script lang="ts">
  import '../app.pcss';
  import { ModeWatcher } from 'mode-watcher';
  import Header from '$lib/components/Header.svelte';
  import userStore, { type AuthMeta } from '$lib/stores/user.svelte';
  import { page } from '$app/stores';
  import { cn } from '$lib/utils';
  import type { Meta } from '$lib/types';
  import Footer from '$lib/components/Footer.svelte';
  import { initializeTheme } from '$lib/stores/theme.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    initializeTheme();
  });

  let { data } = $props();

  let userState = userStore();

  console.log('data', data);
  userState.state.user = data.user;

  userState.state.auth = data.user
    ? {
        accessToken: data.accessToken,
        meta: data.user.meta as Meta,
      }
    : undefined;
</script>

<ModeWatcher />

<svelte:body class="bg-red-500  " />

<div
  class={cn(
    'h-screen'
    // $page.route.id?.startsWith('/dashboard') ? 'pl-[53px]' : 'pl-0'
  )}
>
  <div class="flex h-screen flex-col">
    <Header />
    <div class="flex-1">
      <slot />
    </div>
    <Footer></Footer>
  </div>
</div>
