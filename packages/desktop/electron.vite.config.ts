import preact from '@preact/preset-vite';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';

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
			preact(),
		],
	}
});
