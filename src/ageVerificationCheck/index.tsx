import type { ExtensionWebExports } from '@moonlight-mod/types';

export const webpackModules: ExtensionWebExports['webpackModules'] = {
	index: {
		entrypoint: true,
		dependencies: [
			{ id: 'discord/stores/UserStore' }
		]
	}
};
