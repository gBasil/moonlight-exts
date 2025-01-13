import type { Plugin } from 'esbuild-wasm';
import { fs } from './fs';

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

export function handleFileUrls(folder: string): Plugin {
	return {
		name: 'file-uri-plugin',
		setup: build => {
			const filter = /^file:\/\/.+$/;
			build.onResolve({ filter }, args => {
				return {
					namespace: 'file-uri',
					path: args.path,
					pluginData: {
						uri: args.path,
						path: fs().join(folder, args.path.slice('file://'.length).split('?')[0])
					}
				};
			});
			build.onLoad({ filter, namespace: 'file-uri' }, async ({ pluginData: { path, uri } }) => {
				const contents = await fs().readFileString(path);

				return {
					contents: `export default ${JSON.stringify(contents)}`
				};
			});
		}
	};
}
