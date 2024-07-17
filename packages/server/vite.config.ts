import { defineConfig, UserConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    ssr: true,
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
  },
  resolve: {
    alias: { src: resolve('src/'), '#root': resolve(__dirname) + '../../' },
  },
  server: {
    port: 3000,
  },
  plugins: [
    dts(),
    ...VitePluginNode({
      appPath: './src/index.ts',
      adapter: 'fastify',
      tsCompiler: 'swc',
      initAppOnBoot: true,
      exportName: 'viteNodeApp',
    }),
  ],
}) satisfies UserConfig;
