import {defineConfig} from 'vite';

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
  };
});
