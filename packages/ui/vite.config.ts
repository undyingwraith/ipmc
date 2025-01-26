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
				'@emotion/react',
				'@emotion/styled',
				'@helia/unixfs',
				'@libp2p/pnet',
				'@mui/icons-material',
				'@mui/material',
				'@preact/signals-react',
				'file-type',
				'helia',
				'ipmc-core',
				'ipmc-interfaces',
				'minidenticons',
				'multiformats',
				'react',
				'react-dom',
				'shaka-player',
				'wouter',
			],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					'@emotion/react': 'react',
					'@emotion/styled': 'emStyled',
					'@mui/icons-material': 'iconsMaterial',
					'@mui/material': 'material',
					'@preact/signals-react': 'signalsReact',
					'file-type': 'fileType',
					helia: 'helia',
					react: 'React',
					'ipmc-core': 'ipmcCore',
					'ipmc-interfaces': 'ipmcInterfaces',
					minidenticons: 'minidenticons',
					'shaka-player': 'shaka',
					wouter: 'wouter',
				},
			},
		},
		emptyOutDir: mode !== 'dev',
		sourcemap: mode == 'dev',
		manifest: false,
		minify: mode == 'dev' ? 'esbuild' : 'terser',
	},
	resolve: {
		alias: {
			"@src": resolve(__dirname, "./src"),
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
	},
}));
