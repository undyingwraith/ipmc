import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const isProd = mode === 'production';
	return {
		base: './',
		build: {
			outDir: 'dist',
			emptyOutDir: true,
			minify: isProd,
			sourcemap: command === 'serve',
			rollupOptions: {
				treeshake: true,
				output: {
					manualChunks: (id) => {
						if (id.includes('node_modules')) {
							if (['@mui', '@emotion'].some(i => id.includes(i))) {
								return 'mui';
							} else if (id.includes('shaka-player')) {
								return 'shaka';
							}

							return 'vendor';
						}

						return 'index';
					},
				},
			},
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
