/// <reference types='@moonlight-mod/types' />

import type { AddEvent } from './src/replyChain/webpackModules/component';

declare global {
	interface GlobalEventHandlersEventMap {
		'replyChain-add': CustomEvent<AddEvent>;
	}
}
