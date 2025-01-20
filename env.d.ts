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
	VencordPluginDef = import('src/extensionCompat/vencord/shims/@utils/types'),

	// Types are also put here so as to not make them global
	/** The name of a plugin (not to be confused with the ID, which isn't capitalized). */
	VencordPluginName = string,
> {
	Vencord: {
		Plugins: {
			plugins: Record<VencordPluginName, VencordPluginDef>;
		};
		Settings: {
			// There are a bunch of other properties available here, but I'm not sure if we need those for compatibility
			plugins: Record<VencordPluginName, Record<string, any>>;
		};
	};
}
