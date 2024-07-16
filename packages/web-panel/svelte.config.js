import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess({

  })],

  compilerOptions: {
    // runes: true,
  },
  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib',
      '@': './src/lib',
    },
    env: {
      dir: '../..'
    },
  },
};

export default config;
