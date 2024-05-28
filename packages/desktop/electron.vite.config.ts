import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

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
			commonjsOptions: {
				requireReturnsDefault: true,
			},
		},
		plugins: [
			externalizeDepsPlugin(),
		],
	},
	renderer: {
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer/src'),
			},
		},
		plugins: [
			react({
				babel: {
					plugins: [["module:@preact/signals-react-transform"]]
				},
			}),
		],
	}
});
