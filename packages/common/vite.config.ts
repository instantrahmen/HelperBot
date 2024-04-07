import { defineConfig, UserConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { VitePluginNode } from 'vite-plugin-node';
import ViteYaml from '@modyfi/vite-plugin-yaml';
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
  },
  resolve: { alias: { src: resolve('src/') } },
  plugins: [
    ViteYaml(),
    dts(),
    ...VitePluginNode({
      appPath: 'src/index.ts',
      adapter: 'express',
      tsCompiler: 'esbuild',
    }),
  ],
}) satisfies UserConfig;
