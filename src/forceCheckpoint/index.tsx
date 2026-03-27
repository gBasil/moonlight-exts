import type { ExtensionWebExports } from '@moonlight-mod/types';

export const patches: ExtensionWebExports['patches'] = [
	{
		find: '/checkpoint',

		replace: {
			match: /,.\){let{/,
			replacement: ',true){let{'
		}
	}
];
