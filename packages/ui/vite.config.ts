/// <reference types='vitest' />
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
	plugins: [
		preact({
			babel: {
				presets: [
					[
						'@babel/preset-typescript',
						{ 'onlyRemoveTypeImports': true }
					]
				],
				plugins: [
					['@babel/plugin-proposal-decorators', { legacy: true }],
					['@babel/plugin-proposal-class-properties', { loose: true }],
					'babel-plugin-parameter-decorator',
				]
			}
		}),
		dts({
			tsconfigPath: './tsconfig.json',
			rollupTypes: true,
			include: ['src'],
		}),
		tsconfigPaths(),
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
				'@emotion/react',
				'@emotion/styled',
				'@helia/unixfs',
				'@libp2p/pnet',
				'@mui/icons-material',
				'@mui/material',
				'@preact/signals',
				'file-type',
				'helia',
				'ipmc-core',
				'ipmc-interfaces',
				'minidenticons',
				'multiformats',
				'preact',
				'shaka-player',
				'wouter-preact',
			],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					'@emotion/react': 'react',
					'@emotion/styled': 'emStyled',
					'@mui/icons-material': 'iconsMaterial',
					'@mui/material': 'material',
					'@preact/signals': 'signals',
					'file-type': 'fileType',
					helia: 'helia',
					'ipmc-core': 'ipmcCore',
					'ipmc-interfaces': 'ipmcInterfaces',
					minidenticons: 'minidenticons',
					'preact': 'preact',
					'shaka-player': 'shaka',
					'wouter-preact': 'wouterPreact',
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
		environment: 'jsdom',
	},
}));
