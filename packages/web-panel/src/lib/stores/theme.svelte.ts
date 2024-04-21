import { browser } from '$app/environment';
import { createStore } from './store.svelte';

export const themes = {
  default: undefined,
  deepBlue: 'theme-deep-blue',
} as const;
export type Theme = (typeof themes)[keyof typeof themes];

export const themeStore = createStore<Theme>(undefined, 'THEME_CTX', (theme) => {
  console.log('saved-theme', theme);
  updateTheme(theme);
});

export const initializeTheme = () => {
  if (browser) {
    const theme: Theme = (localStorage.getItem('saved-theme') || themes.default) as Theme;
    const themeState = themeStore();

    themeState.state = theme;
  }
};

const saveTheme = (theme: Theme) => {
  if (browser) {
    localStorage.setItem('saved-theme', JSON.stringify(theme));
  }
};

const updateTheme = (theme: Theme) => {
  if (!browser) return;
  const themesArray: NonNullable<Theme>[] = Object.values(themes).filter(
    (theme) => !!theme
  ) as NonNullable<Theme>[];

  document.documentElement.classList.remove(...themesArray);
  if (theme) {
    console.log({ theme }, 'TEST');
    document.documentElement.classList.add(theme, 'TEST');
  }
  saveTheme(theme);
};
