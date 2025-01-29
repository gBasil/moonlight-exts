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
	},
	// Add the escape handler
	{
		// Called when dispatching `SCROLLTO_PRESENT`
		find: 'messagesNavigationDescription',

		replace: {
			match: /(.)\.scrollToBottom\(\)/,
			replacement: (orig, cmp) =>
				// We have a slight buffer because sometimes `getDistanceFromBottom()` returns a
				// non-zero number when it's scrolled all the way down
				`${cmp}.getDistanceFromBottom() <= 1 ? require('discord/utils/ComponentDispatchUtils').ComponentDispatcher.dispatch('REPLYCHAIN_CLOSE') : ${orig}`
		}
	}
];

export const webpackModules: ExtensionWebExports['webpackModules'] = {
	handler: {
		dependencies: [
			{ id: 'discord/utils/ComponentDispatchUtils' }
		]
	},
	component: {
		dependencies: [
			{ id: 'react' },
			{ id: 'discord/utils/ComponentDispatchUtils' },
			{ id: 'discord/actions/MessageActionCreators' },
			{ id: 'discord/components/common/index' }
		]
	},
	mappings: {
		dependencies: [
			{ ext: 'spacepack', id: 'spacepack' },
			'ComponentDispatchUtils'
		],
		entrypoint: true
	}
};
