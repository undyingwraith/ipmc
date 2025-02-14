import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	return {
		build: {
			outDir: 'dist',
			emptyOutDir: true,
			minify: mode == 'dev' ? 'esbuild' : 'terser',
			sourcemap: command === 'serve',
			rollupOptions: { treeshake: true }
		},
		plugins: [
			preact(),
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
