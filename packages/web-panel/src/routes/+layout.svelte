<script lang="ts">
  import '../app.pcss';
  import { ModeWatcher } from 'mode-watcher';
  import Header from '$lib/components/Header.svelte';
  import userStore from '$lib/stores/user.svelte';
  import { page } from '$app/stores';
  import { cn } from '$lib/utils';

  let { data } = $props();

  let userState = userStore();

  userState.state.user = data.user;

  userState.state.auth = {
    accessToken: data.accessToken,
    meta: data.user?.meta,
  };
</script>

<ModeWatcher />

<!-- TODO: Break out header and guild selection into separate component -->
<!-- grid h-screen w-full pl-[53px] -->
<div
  class={cn(
    'grid h-screen w-full',
    $page.route.id?.startsWith('/dashboard') ? 'pl-[53px]' : 'pl-0'
  )}
>
  <div class="flex flex-col">
    <Header />
    <slot />
  </div>
</div>
