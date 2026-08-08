import type { ExtensionWebExports } from '@moonlight-mod/types';

export const patches: ExtensionWebExports['patches'] = [
	{
		find: 'sentinel:":"',
		replace: [
			{
				// The `matches` arguments, in order, are:
				// - A channel object
				// - A guild object
				// - The message, without the sentinel (":"). For example, typing ":check" would give you "check"
				// - A boolean, whether the emoji you're typing is at the start of the message (this is used for quick emoji reactions, for instance, which are handled elsewhere in this module)
				// - An object with some options and commands
				match: /{sentinel:":",stores:\[\i\.\i\],matches:\(\i,\i,(\i),\i,\i\)=>(?!{)/g,
				replacement: `$& require('excludeAutocompleteEmojis_match').shouldShow($1) &&`
			}
		]
	}
];

export const webpackModules: ExtensionWebExports['webpackModules'] = {
	match: {}
};
