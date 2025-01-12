import fs from 'node:fs';
import path from 'node:path';
import { watchExt, buildExt } from '@moonlight-mod/esbuild-config';

// Extensions that should have their browser entrypoints (index.ts) be built as ES modules
const esm = ['extensionCompat'];

const plugins = {
	extensionCompat: [
		{
			name: 'Config Override',
			setup(build) {
				const options = build.initialOptions;

				// Bad solution for now to get it to work
				// TODO: Load WASM better and remove this config
				options.loader ??= {};
				options.loader['.wasm'] ??= 'binary';
				options.loader['.webp'] ??= 'dataurl';

				// Load files with ?raw at the end as text

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
		}
	]
};

const watch = process.argv.includes('--watch');
const clean = process.argv.includes('--clean');

if (clean) {
	fs.rmSync('./dist', { recursive: true, force: true });
} else {
	const exts = fs.readdirSync('./src');

	for (const ext of exts) {
		const cfg = {
			src: path.resolve(path.join('src', ext)),
			dst: path.resolve(path.join('dist', ext)),
			esm: esm.includes(ext),
			extraPlugins: plugins[ext],
			ext
		};

		if (watch) {
			await watchExt(cfg);
		} else {
			await buildExt(cfg);
		}
	}
}
