import { defineConfig, UserConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
  },
  resolve: {
    alias: { src: resolve('src/'), '#root': resolve(__dirname) + '../../' },
  },
  plugins: [
    dts(),
    ...VitePluginNode({
      appPath: 'src/index.ts',
      adapter: 'fastify',
      tsCompiler: 'esbuild',
    }),
  ],
}) satisfies UserConfig;
