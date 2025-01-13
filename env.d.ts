/// <reference types='@moonlight-mod/types' />

interface GlobalEventHandlersEventMap {
	'replyChain-add': CustomEvent<
		import('./src/replyChain/webpackModules/component').AddEvent
	>;
}

declare module '@moonlight-mod/wp/extensionCompat_stores' {
	export * from 'src/extensionCompat/webpackModules/stores';
}

declare module '@moonlight-mod/wp/extensionCompat_ui' {
	export * from 'src/extensionCompat/webpackModules/ui';
}

declare module '*?raw' {
	const src: string;
	export default src;
}

declare module '*.wasm' {
	const src: Uint8Array;
	export default src;
}

declare module '*.webp' {
	/** The image as a data URL. */
	const src: string;
	export default src;
}

interface Window<
	// Imports are put here into generics to get around weirdness when adding imports
	VencordPluginDef = import('src/extensionCompat/vencord/shims/@utils/types')
> {
	Vencord: {
		Plugins: {
			plugins: Record<string, VencordPluginDef>;
		};
	};
}
