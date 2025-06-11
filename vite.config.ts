import { exec } from 'node:child_process';
import path from 'path';
import { defineConfig } from 'vite';

export function pushBuild() {
	return {
		name: 'pushBuild',
		closeBundle: async () => {
			exec('dts-bundle-generator --config dts.config.ts', (response, error) => {
				if (error) console.error(error);
				// console.log(response);
				exec('npx yalc push', (response, error) => (error ? console.error(error) : null));
			});
		},
	};
}

export default defineConfig({
	base: './',
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'Serializes',
			formats: ['es', 'cjs'],
			fileName: format => `index.${format}.js`,
		},
	},
	plugins: [pushBuild()],
	resolve: {
		alias: {
			src: path.resolve(__dirname, '/src'),
			normalizers: path.resolve(__dirname, '/src/normalizers'),
			serializers: path.resolve(__dirname, '/src/serializers'),
			utils: path.resolve(__dirname, '/src/utils'),
		},
	},
});
