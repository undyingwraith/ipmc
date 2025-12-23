import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

const define = {
	__VERSION__: JSON.stringify(pkg.version),
};

export default defineConfig({
	main: {
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'src/main/index.ts')
				}
			},
		},
		plugins: [
			externalizeDepsPlugin(),
		],
		define,
	},
	preload: {
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'src/preload/index.ts')
				},
				output: {
					format: 'es',
				},
			},
		},
		plugins: [
			externalizeDepsPlugin(),
		],
		define,
	},
	renderer: {
		server: {
			port: 5174,
		},
		build: {
			rollupOptions: {
				treeshake: true
			}
		},
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer/src'),
			},
		},
		plugins: [
			//TODO: fix externalized dependencies
			//externalizeDepsPlugin(),
			react({
				babel: {
					plugins: [["module:@preact/signals-react-transform"]]
				},
			}),
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
		define,
	}
});
