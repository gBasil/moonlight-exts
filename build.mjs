import fs from 'node:fs';
import path from 'node:path';
import { watchExt, buildExt } from '@moonlight-mod/esbuild-config';

// Extensions that should have their browser entrypoints (index.ts) be built as ES modules
const esm = ['extensionCompat'];

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
			ext
		};

		if (watch) {
			await watchExt(cfg);
		} else {
			await buildExt(cfg);
		}
	}
}
