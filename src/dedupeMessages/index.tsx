import { ExtensionWebExports } from '@moonlight-mod/types';

export const patches: ExtensionWebExports['patches'] = [
	// NOTE: This does not work for messages with attachments
	{
		find: '_sendMessage',

		replace: {
			match: /async sendMessage\((.),(.)\){/,
			replacement: (orig, channelId, messageData) => {
				return `${orig}if(await require('dedupeMessages_handler').handle(${channelId},${messageData}))return;`;
			}
		}
	}
];

export const webpackModules: ExtensionWebExports['webpackModules'] = {
	handler: {
		dependencies: [
			{ ext: 'spacepack', id: 'spacepack' },
			{ id: 'discord/utils/HTTPUtils' },
			{ id: 'react' },
			'_checkSavedDispatches',
			'close(){},'
		]
	}
};
