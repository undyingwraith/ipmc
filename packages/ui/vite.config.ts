/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => ({
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
		checker({
			typescript: { buildMode: true }
		}),
	],
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'Core',
			fileName: 'index',
		},
		rollupOptions: {
			preserveSymlinks: true,
			external: [
				'helia',
				'react',
				'react-dom',
				'react-i18next',
				'@mui/material',
				'@mui/icons-material',
				'@emotion/react',
				'@helia/unixfs',
				'@libp2p/pnet',
				'@preact/signals-react',
				'i18next',
				'minidenticons',
				'multiformats'
			],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					helia: 'helia',
					react: 'React',
				},
			},
		},
		emptyOutDir: mode !== 'dev',
		sourcemap: mode == 'dev',
		manifest: false,
		minify: mode == 'dev' ? 'esbuild' : 'terser',
	},
	test: {
		globals: true,
	},
}));