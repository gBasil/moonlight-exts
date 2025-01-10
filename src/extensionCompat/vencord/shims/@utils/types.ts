/**
 * Vencord
 *
 * @copyright 2022 Vendicated and contributors
 * @link https://github.com/Vendicated/Vencord
 * @license GPL-3.0-or-later
 */

export default function definePlugin<P extends PluginDef>(p: P & Record<string, any>) {
	return p;
}

export type ReplaceFn = (match: string, ...groups: string[]) => string;

export interface PatchReplacement {
	/** The match for the patch replacement. If you use a string it will be implicitly converted to a RegExp */
	match: string | RegExp;
	/** The replacement string or function which returns the string for the patch replacement */
	replace: string | ReplaceFn;
	/** A function which returns whether this patch replacement should be applied */
	predicate?(): boolean;
}

export interface Patch {
	plugin: string;
	/** A string or RegExp which is only include/matched in the module code you wish to patch. Prefer only using a RegExp if a simple string test is not enough */
	find: string | RegExp;
	/** The replacement(s) for the module being patched */
	replacement: PatchReplacement | PatchReplacement[];
	/** Whether this patch should apply to multiple modules */
	all?: boolean;
	/** Do not warn if this patch did no changes */
	noWarn?: boolean;
	/** Only apply this set of replacements if all of them succeed. Use this if your replacements depend on each other */
	group?: boolean;
	/** A function which returns whether this patch should be applied */
	predicate?(): boolean;
}

export interface PluginAuthor {
	name: string;
	id: bigint;
}

export interface Plugin extends PluginDef {
	patches?: Patch[];
	started: boolean;
	isDependency?: boolean;
}

export interface PluginDef {
	name: string;
	description: string;
	authors: PluginAuthor[];
	start?(): void;
	stop?(): void;
	patches?: Omit<Patch, 'plugin'>[];
	// TODO:
	// /**
	//  * List of commands that your plugin wants to register
	//  */
	// commands?: Command[];
	// /**
	//  * A list of other plugins that your plugin depends on.
	//  * These will automatically be enabled and loaded before your plugin
	//  * Generally these will be API plugins
	//  */
	// dependencies?: string[],
	// /**
	//  * Whether this plugin is required and forcefully enabled
	//  */
	// required?: boolean;
	// /**
	//  * Whether this plugin should be hidden from the user
	//  */
	// hidden?: boolean;
	// /**
	//  * Whether this plugin should be enabled by default, but can be disabled
	//  */
	// enabledByDefault?: boolean;
	// /**
	//  * When to call the start() method
	//  * @default StartAt.WebpackReady
	//  */
	// startAt?: StartAt,
	// /**
	//  * Which parts of the plugin can be tested by the reporter. Defaults to all parts
	//  */
	// reporterTestable?: number;
	// /**
	//  * Optionally provide settings that the user can configure in the Plugins tab of settings.
	//  * @deprecated Use `settings` instead
	//  */
	// // TODO: Remove when everything is migrated to `settings`
	// options?: Record<string, PluginOptionsItem>;
	// /**
	//  * Optionally provide settings that the user can configure in the Plugins tab of settings.
	//  */
	// settings?: DefinedSettings;
	// /**
	//  * Check that this returns true before allowing a save to complete.
	//  * If a string is returned, show the error to the user.
	//  */
	// beforeSave?(options: Record<string, any>): Promisable<true | string>;
	// /**
	//  * Allows you to specify a custom Component that will be rendered in your
	//  * plugin's settings page
	//  */
	// settingsAboutComponent?: React.ComponentType<{
	// 	tempSettings?: Record<string, any>;
	// }>;
	// /**
	//  * Allows you to subscribe to Flux events
	//  */
	// flux?: {
	// 	[E in FluxEvents]?: (event: any) => void | Promise<void>;
	// };
	// /**
	//  * Allows you to manipulate context menus
	//  */
	// contextMenus?: Record<string, NavContextMenuPatchCallback>;
	// /**
	//  * Allows you to add custom actions to the Vencord Toolbox.
	//  * The key will be used as text for the button
	//  */
	// toolboxActions?: Record<string, () => void>;

	// tags?: string[];
}
