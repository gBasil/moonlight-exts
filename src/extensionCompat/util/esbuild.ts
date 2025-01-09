import type { Plugin } from 'esbuild-wasm';

import fs from 'node:fs';

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

export const rawImports: Plugin = {
	name: 'Raw Imports',
	setup(build) {
		build.onResolve({ filter: /\?raw$/ }, async args => {
			const { path, errors } = await build.resolve(args.path.slice(0, -4), {
				resolveDir: args.resolveDir,
				kind: args.kind,
				importer: args.importer
			});
			if (errors.length > 0) return { errors };

			return {
				path,
				watchFiles: [path],
				namespace: 'raw'
			};
		});

		build.onLoad({ filter: /.*/, namespace: 'raw' }, args => ({
			contents: fs.readFileSync(args.path, 'utf8'),
			loader: 'text'
		}));
	}
};