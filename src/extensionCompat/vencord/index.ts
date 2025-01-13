import type { ExtensionWebExports } from '@moonlight-mod/types';
import type { Config } from '../types';

import VencordPlugin from './plugin';
import { exists, getPath, isFile, readDir } from '../util/fs';
import { s } from '../util/text';
import { mergeExtensionData } from '../util/data';

export default class Vencord {
	private constructor(
		/** Keys are plugin IDs. */
		public plugins: Record<string, VencordPlugin>
	) {}

	static async init(config: Config): Promise<Vencord> {
		if (!(await exists('vencord'))) return new Vencord({});
		const rawEntries = await readDir('vencord');
		const entries: string[] = [];
		for (const entry of rawEntries) {
			// It would be better to check if it was a folder (i.e. in the case of symlinks), but this is the best moonlight lets us do
			const file = await isFile(`vencord/${entry}`);
			const settings = config.vencord[entry];
			if (!file && settings !== undefined && settings.enabled) entries.push(entry);
		}

		moonlightNode.getLogger('extensionCompat/vencord')
			.info(`Loading ${entries.length} extension${s(entries.length)}`);

		const plugins: Record<string, VencordPlugin> = {};
		for (const entry of entries) {
			const plugin = await VencordPlugin.init(await getPath(`vencord/${entry}`));
			plugins[entry] = plugin;
		}

		return new Vencord(plugins);
	}

	getMoonlightData(): Required<ExtensionWebExports> {
		return mergeExtensionData(
			Object.values(this.plugins).map(plugin =>
				plugin.convert()
			)
		);
	}
}
