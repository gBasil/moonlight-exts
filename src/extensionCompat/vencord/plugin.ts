import type { Patch, PatchReplace } from '@moonlight-mod/types';
import type * as Vencord from './types';
import type { ExtensionData } from '../types';

// const { fs } = moonlightNodeSandboxed;
// const { join } = fs;

export function convertPlugin(folder: string): ExtensionData {
	// TODO: Actually implement this function
	// const indexPath = join(folder, 'index.ts');

	const patches: Patch[] = ([] as Vencord.Patch[]).map(convertPatch);

	return {
		patches,
		styles: [],
		webpackModules: {}
	};
}

function convertPatch(patch: Vencord.Patch): Patch {
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
