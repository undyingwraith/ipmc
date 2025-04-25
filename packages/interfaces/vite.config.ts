/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
			name: 'ipmcInterfaces',
			entry: resolve(__dirname, 'src/index.ts'),
			fileName: 'index',
			formats: ['es', 'umd']
		},
	},
}));
