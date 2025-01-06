import { ExtensionWebExports } from '@moonlight-mod/types';

let fnArg: string;
export const patches: ExtensionWebExports['patches'] = [
	// Patch the function that gets called when you click a message reply to jump to the message
	{
		find: '{referencedUsernameProfile:',

		replace: [
			{
				match: /\.memo\(function\((.)\)/,
				replacement: (orig, arg) => {
					fnArg = arg;
					// As of writing, moonlight shows a "Patch replacement failed" warning
					// in the console if a patch is deemed to have not changed any code, even
					// if it matched. Hopefully this will be fixed in future versions.
					// (I know I can put an empty comment here to suppress the warning, but
					// I'd rather wait until it's properly fixed)
					return orig;
				}
			},
			{
				match: /onClickReply:(.),/,
				replacement: (_, callback) =>
					`onClickReply:(()=>{require('replyChain_handler').handle(${fnArg});${callback}()}),`
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
