/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { coverageConfigDefaults } from 'vitest/config';

export default defineConfig(({ mode }) => ({
	plugins: [
		dts({
			insertTypesEntry: true,
			tsconfigPath: resolve(__dirname, './tsconfig.build.json'),
		}),
	],
	build: {
		emptyOutDir: mode !== 'dev',
		sourcemap: mode == 'dev',
		manifest: false,
		minify: mode == 'dev' ? 'esbuild' : 'terser',
		lib: {
			name: 'ipmcCore',
			entry: resolve(__dirname, 'src/index.ts'),
			fileName: 'index',
			formats: ['es', 'umd']
		},
		rollupOptions: {
			external: [
				'@helia/ipns',
				'@helia/unixfs',
				'@libp2p/peer-id',
				'@preact/signals-core',
				'helia',
				'i18next',
				'inversify',
				'ipmc-interfaces',
				'kubo-rpc-client',
				'libp2p',
				'multiformats',
				'reflect-metadata',
				'uint8arrays',
			],
			output: {
				globals: {
					'@helia/ipns': 'ipns',
					'@helia/unixfs': 'unixfs',
					'@libp2p/peer-id': 'peerId',
					'@preact/signals-core': 'signalsCore',
					i18next: 'i18next',
					inversify: 'inversify',
					'ipmc-interfaces': 'ipmcInterfaces',
					'kubo-rpc-client': 'kuboRpcClient',
					multiformats: 'multiformats',
					uint8arrays: 'uint8arrays'
				},
			},
		},
	},
	test: {
		environment: 'jsdom',
		coverage: {
			reporter: ['text', 'json-summary', 'json', 'html'],
			reportOnFailure: true,
			thresholds: {
				lines: 60,
				branches: 60,
				functions: 60,
				statements: 60,
			},
			exclude: [
				'testing/**',
				...coverageConfigDefaults.exclude
			],
		},
	},
}));
