<script lang="ts">
  import { themeStore, themes, type Theme } from '$lib/stores/theme.svelte';
  import type { Selected } from 'bits-ui';
  import Dropdown from './SelectDropdown.svelte';
  import { sidebarStore } from '$lib/stores/sidebar.svelte';
  import { cn } from '$lib/utils';

  let themeState = themeStore();

  type ThemeKey = keyof typeof themes;

  const formatTheme = (theme: Theme) => {
    // format a string like this: 'theme-deep-blue' to 'Deep Blue'
    if (!theme) return 'Default';
    const themeName = theme
      .replace('theme-', '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return themeName;
  };

  const themeDropdownOptions: Selected<string>[] = (Object.keys(themes) as ThemeKey[]).map(
    (key) => ({
      label: formatTheme(themes[key]),
      value: key,
    })
  );

  const year = new Date().getFullYear();

  let currentThemeKey = $derived(
    Object.keys(themes).find((key) => themes[key as ThemeKey] === themeState.state)
  );
  let selected: Selected<string> = $state(
    themeDropdownOptions.find((opt) => opt.value === currentThemeKey) || themeDropdownOptions[0]
  );

  $effect(() => {
    themeState.state = themes[selected.value as ThemeKey];
  });

  let sidebarState = sidebarStore();
</script>

<footer
  class={cn(
    'text-foreground flex flex-row justify-between border-t p-2 align-middle',
    sidebarState.state.open && 'sm:pl-[4.5rem]'
  )}
>
  <span class="my-auto inline-block h-fit align-middle text-sm">&copy; {year} Erika Cudd</span>

  {sidebarState.state.open}
  <Dropdown label="Theme" items={themeDropdownOptions} bind:selected class="bg-none" />
</footer>

<style lang="postcss">
</style>
