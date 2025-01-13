import type { Patch, PatchReplace } from '@moonlight-mod/types';
import type { ExtensionData } from '../types';
import type { PluginDef } from './shims/@utils/types';
import type * as Vencord from './shims/@utils/types';

import esbuild from 'esbuild-wasm/lib/browser';
import { transformImports } from '../util/esbuild';
import { runtimeHashMessageKey } from './shims/@utils/intlHash';
import { strToRegex } from '../util/regex';
import { fs } from '../util/fs';

import constants from './shims/@utils/constants?raw';
import types from './shims/@utils/types?raw';

export default class VencordPlugin {
	private constructor(public plugin: PluginDef) {}

	static async init(folder: string): Promise<VencordPlugin> {
		// TODO: Dynamically determine whether ts or tsx
		const indexPath = fs().join(folder, 'index.ts');
		const file = await fs().readFileString(indexPath);

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

		const plugin = (new Function(code))().default as PluginDef;

		return new VencordPlugin(plugin);
	}

	convert(): ExtensionData {
		const patches: Patch[] = (this.plugin.patches ?? []).map(e => this.convertPatch(e));

		return {
			patches,
			styles: [],
			webpackModules: {}
		};
	}

	private convertPatch(patch: Omit<Vencord.Patch, 'plugin'>): Patch {
		let find: string | RegExp;
		if (patch.all) {
			if (typeof patch.find === 'string') {
				find = strToRegex(patch.find, 'g');
			} else {
				// Ensure that the RegExp is global
				let flags = patch.find.flags;
				if (!patch.find.flags.includes('g')) flags += 'g';

				find = new RegExp(patch.find.source, flags);
			}
		} else {
			find = patch.find;
		}
		find = this.canonicalizeMatch(find);

		const replace = (
			Array.isArray(patch.replacement)
				?  patch.replacement
				: [patch.replacement]
		).map(e => this.convertReplacement(e));

		return {
			find,
			replace

			// TODO: Prerequisite support
			// UNSUPPORTED:
			// - noWarn - moonlight does not have this concept
			// - group - moonlight does not have this concept (https://github.com/moonlight-mod/moonlight/issues/117)
		};
	}

	private convertReplacement(rep: Vencord.PatchReplacement): PatchReplace {
		rep.match = this.canonicalizeMatch(rep.match);
		rep.replace = this.canonicalizeReplace(rep.replace, this.plugin.name);

		return {
			// Vencord converts string matches to RegExp
			match: typeof rep.match === 'string' ? new RegExp(rep.match) : rep.match,
			replacement: rep.replace
			// TODO: Predicate support
		};
	}

	private canonicalizeMatch<T extends RegExp | string>(match: T): T {
		const src = typeof match === 'string' ? match : match.source;

		// Applies the i18n hash
		const canon = src.replaceAll(/#{intl::([\w$+/]*)(?:::(\w+))?}/g, (_, key, modifier) => {
			const hashed = modifier === 'raw' ? key : runtimeHashMessageKey(key);

			const isString = typeof match === 'string';
			const hasSpecialChars = !Number.isNaN(Number(hashed[0])) || hashed.includes('+') || hashed.includes('/');

			if (hasSpecialChars) {
				return isString
					? `["${hashed}"]`
					: String.raw`(?:\["${hashed}"\])`.replaceAll('+', '\\+');
			}

			return isString ? `.${hashed}` : String.raw`(?:\.${hashed})`;
		});

		if (typeof match === 'string') return canon as T;

		// We don't need to apply the \i replacement because moonlight already does that
		return new RegExp(canon, match.flags) as T;
	}

	private canonicalizeReplace<T extends string | Vencord.ReplaceFn>(replace: T, pluginName: string): T {
		const self = `Vencord.Plugins.plugins[${JSON.stringify(pluginName)}]`;

		if (typeof replace !== 'function')
			return replace.replaceAll('$self', self) as T;

		return ((...args) => replace(...args).replaceAll('$self', self)) as T;
	}
}
