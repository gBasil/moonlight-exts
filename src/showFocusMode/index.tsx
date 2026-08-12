import type { ExtensionWebExports } from '@moonlight-mod/types';

export const patches: ExtensionWebExports['patches'] = [
	{
		find: 'menu-separator-statuses',
		replace: [
			{
				match: /,.(\?\(0,.\.jsxs\))/g,
				replacement: `,true$1`
			}
		]
	}
];
