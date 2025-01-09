import type { Patch, PatchReplace } from '@moonlight-mod/types';
import type { ExtensionData } from '../types';
import type definePlugin from './shims/@utils/types';
import type * as Vencord from './shims/@utils/types';

import esbuild from 'esbuild-wasm/lib/browser';
import { transformImports } from '../util/esbuild';

import constants from './shims/@utils/constants?raw';
import types from './shims/@utils/types?raw';

const { fs } = moonlightNodeSandboxed;

export async function convertPlugin(folder: string): Promise<ExtensionData> {
	// TODO: Dynamically determine whether ts or tsx
	const indexPath = fs.join(folder, 'index.ts');
	const file = await fs.readFileString(indexPath);

	const out = await esbuild.build({
		stdin: {
			contents: file,
			loader: 'ts'
		},

		bundle: true,

		format: 'iife',
		globalName: 'out',

		plugins: [
			transformImports({
				'@utils/constants': constants,
				'@utils/types': types
			})
		],

		outfile: 'awawa.js',
		write: false
	});
	// For some reason, returning the IIFE doesn't work, but this does
	const code: string = out.outputFiles[0].text + 'return out;';

	const data = (new Function(code))().default as ReturnType<typeof definePlugin>;

	const patches: Patch[] = (data.patches ?? []).map(convertPatch);

	return {
		patches,
		styles: [],
		webpackModules: {}
	};
}

function convertPatch(patch: Omit<Vencord.Patch, 'plugin'>): Patch {
	const replace = Array.isArray(patch.replacement)
		? patch.replacement.map(convertReplacement)
		: convertReplacement(patch.replacement);
	return {
		find: patch.find,
		replace
		// TODO: Prerequisite support
	};
}

function convertReplacement(rep: Vencord.PatchReplacement): PatchReplace {
	// rep.
	return {
		// TODO: This needs to be applied:
		// https://github.com/Vendicated/Vencord/blob/0fd76ab15a51a8426786b696d422f59bd1250099/src/utils/patches.ts#L22

		// Vencord converts string matches to RegExp
		match: typeof rep.match === 'string' ? new RegExp(rep.match) : rep.match,
		// TODO: Implement support for function replacements
		replacement: rep.replace
		// TODO: Predicate support
	};
}
