import { defineConfig } from 'vite';
//import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const isProd = mode === 'production';
	return {
		base: './',
		server: {
			port: 5175,
			strictPort: true,
		},
		build: {
			outDir: 'dist',
			emptyOutDir: true,
			minify: isProd,
			sourcemap: command === 'serve',
			rollupOptions: {
				treeshake: true,
			},
		},
		plugins: [
			/*checker({
				typescript: { buildMode: true }
			})*/,
			tsconfigPaths(),
		],
	};
});
