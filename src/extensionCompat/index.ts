import type { ExtensionWebExports } from '@moonlight-mod/types';

import getNatives from './util/natives';

const natives = getNatives();
await natives.initPlugins();
const data = natives.getMoonlightData();

export const { patches, styles } = data;
export const webpackModules: ExtensionWebExports['webpackModules'] = {
	...data.webpackModules,

	webpack: { entrypoint: true },

	stores: {
		dependencies: [{ id: 'discord/packages/flux' }, { id: 'discord/Dispatcher' }]
	},

	ui: {
		dependencies: [
			{ ext: 'spacepack', id: 'spacepack' },
			{ ext: 'common', id: 'stores' },
			{ ext: 'extensionCompat', id: 'stores' },
			{ id: 'react' },
			{ id: 'discord/components/common/index' },
			{ id: 'discord/modules/guild_settings/IntegrationCard.css' }
		]
	},

	settings: {
		dependencies: [
			{ ext: 'settings', id: 'settings' },
			{ ext: 'extensionCompat', id: 'ui' }
		],
		entrypoint: true
	}
};
