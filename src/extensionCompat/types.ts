import type { ExtensionWebExports } from '@moonlight-mod/types';

export type ExtensionData = Required<ExtensionWebExports>;

/** The config format stored in `extensionCompat/config.json`. */
export type Config = {
	/** A record of installed plugins and their data. The keys are the plugin IDs. */
	vencord: Record<string, {
		enabled: boolean;
		/** The metadata of the plugin when it was installed/updated. */
		meta: PluginMeta;
		settings: Record<string, any>;
	}>;
};

/** Plugin metadata format, to which all third-party plugins are normalized. */
export type PluginMeta = {
	id: string;
	name: string;
	description: string;
	tags: string[];
	authors: {
		name: string;
		discordId?: string;
		website?: string;
	}[];
};

export enum ExtensionState {
	NotInstalled,
	Disabled,
	Enabled
}
