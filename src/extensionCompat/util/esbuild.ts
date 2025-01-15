import type { Plugin } from 'esbuild-wasm';

export function transformImports(map: Record<string, string>): Plugin {
	return {
		name: 'Transform Imports',
		setup(build) {
			const keys = Object.keys(map).map(key =>
				// Not necessary
				key.replace('/', '\\/')
			);

			const regex = `^(${keys.reduce((acc, cur) => `${acc}|${cur}`)})$`;

			// Intercept our import paths so esbuild doesn't attempt to map them to a file system location
			build.onResolve({ filter: new RegExp(regex) }, args => ({
				path: args.path,
				namespace: 'import-map'
			}));

			build.onLoad({
				filter: /.*/,
				namespace: 'import-map'
			}, args => {
				return {
					contents: map[args.path],
					loader: 'ts'
				};
			});
		}
	};
}

export const webpackImports: Plugin = {
	name: 'webpackImports',
	setup(build) {
		build.onResolve({ filter: /^@moonlight-mod\/wp\// }, args => {
			const wpModule = args.path.replace(/^@moonlight-mod\/wp\//, '');
			return {
				path: wpModule,
				external: true
			};
		});
	}
};
