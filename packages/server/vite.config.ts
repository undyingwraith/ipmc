/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { coverageConfigDefaults } from 'vitest/config';
import pkg from './package.json';

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
	define: {
		__VERSION__: JSON.stringify(pkg.version),
	},
}));
