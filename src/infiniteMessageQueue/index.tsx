import type { ExtensionWebExports } from '@moonlight-mod/types';

export const patches: ExtensionWebExports['patches'] = [
	{
		find: 'Draining Message Queue',
		replace: {
			match: /constructor\((.{1,2})=5\)\{/,
			replacement: '$&$1=Infinity;'
		}
	}
];
