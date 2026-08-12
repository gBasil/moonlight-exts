import type { ExtensionWebExports } from '@moonlight-mod/types';

export const patches: ExtensionWebExports['patches'] = [
	{
		find: 'menu-separator-statuses',
		replace: [
			{
				match: /,(.)(\?\(0,.\.jsxs\))(.+?)badge:{text:.*?}/g,
				replacement: `,true$2$3badge:{text:$1?"ON":"OFF"}`
			}
		]
	}
];
