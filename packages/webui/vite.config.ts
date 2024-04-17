import {defineConfig} from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProd = mode === 'production';
  return {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      minify: isProd,
      sourcemap: command === 'serve',
      rollupOptions: { treeshake: true }
    },
    plugins: [
        nodePolyfills({
          include: ['crypto', 'buffer', 'stream', 'util'],
          globals: {
            Buffer: true,
            global: true,
            process: true,
          },
          protocolImports: true,
        })
    ],
  };
});
