/// <reference types='@moonlight-mod/types' />

import type { AddEvent } from './src/replyChain/webpackModules/component';

declare global {
	interface GlobalEventHandlersEventMap {
		'replyChain-add': CustomEvent<AddEvent>;
	}

	declare module '*?raw' {
		const src: string;
		export default src;
	}

	declare module '*.wasm' {
		const src: Uint8Array;
		export default src;
	}
}
