import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const isProd = mode === 'production';
	return {
		base: './',
		build: {
			outDir: 'dist',
			emptyOutDir: true,
			minify: isProd,
			sourcemap: command === 'serve',
			rollupOptions: {
				treeshake: true,
				output: {
					manualChunks: (id) => {
						if (id.includes('node_modules')) {
							if (['@mui', '@emotion'].some(i => id.includes(i))) {
								return 'mui';
							} else if (id.includes('shaka-player')) {
								return 'shaka';
							} else if (['cborg', 'multiformats', 'dag-jose'].some(i => id.includes(i))) {
								return 'ipfs';
							} else if (['asn1js', 'webcrypto-core', 'acme-client'].some(i => id.includes(i))) {
								return 'crypto';
							}

							return 'vendor';
						}

						return 'index';
					},
				},
			},
		},
		plugins: [
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
	};
});
