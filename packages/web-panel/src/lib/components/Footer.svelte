<script lang="ts">
  import { themeStore, themes, type Theme } from '$lib/stores/theme.svelte';
  import type { Selected } from 'bits-ui';
  import Dropdown from './Dropdown.svelte';

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
</script>

<footer class="flex flex-row justify-between border-t-border bg-card p-2 align-middle sm:pl-16">
  <span class="my-auto inline-block h-fit align-middle text-sm">&copy; {year} Erika Cudd</span>

  {themeState.state}
  <Dropdown label="Theme" items={themeDropdownOptions} bind:selected />
</footer>

<style lang="postcss">
</style>
