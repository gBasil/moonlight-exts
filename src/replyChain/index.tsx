import type { ExtensionWebExports } from '@moonlight-mod/types';

export const patches: ExtensionWebExports['patches'] = [
	// Patch the function that gets called when you click a message reply to jump to the message
	{
		find: '{referencedUsernameProfile:',

		replace: [
			{
				match: /\.memo\(function\((.)\)(.+?)onClickReply:(.),/,
				replacement: (_, fnArg, orig, callback) =>
					`.memo(function(${fnArg})${orig}onClickReply:(()=>{require('replyChain_handler').handle(${fnArg});${callback}()}),`
			}
		]
	},
	// Add our custom component
	{
		find: '.PinToBottomScrollerAuto',

		replace: {
			match: /(\(0,.\.jsxs\))\(.\.PinToBottomScrollerAuto/,
			replacement: (orig, jsx) =>
				`${jsx}(require('replyChain_component').Component,{}),${orig}`
		}
	}
];

export const webpackModules: ExtensionWebExports['webpackModules'] = {
	handler: {},
	component: {
		dependencies: [
			{ id: 'react' },
			{ id: 'discord/components/common/index' },
			{ ext: 'spacepack', id: 'spacepack' },
			',jumpToMessage('
		]
	}
};
