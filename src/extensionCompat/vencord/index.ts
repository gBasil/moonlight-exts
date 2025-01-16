import type { ExtensionWebExports } from '@moonlight-mod/types';
import type { Config } from '../types';

import VencordPlugin from './plugin';
import { exists, getPath, isFile, readDir } from '../util/fs';
import { s } from '../util/text';
import { mergeExtensionData } from '../util/data';

export default class Vencord {
	private constructor(
		/** Keys are plugin IDs. */
		public plugins: Record<string, VencordPlugin>,
		/** The IDs of plugins that failed to load. */
		public failures: string[]
	) {}

	static async init(config: Config): Promise<Vencord> {
		if (!(await exists('vencord'))) return new Vencord({}, []);
		const rawEntries = await readDir('vencord');
		const entries: string[] = [];
		for (const entry of rawEntries) {
			// It would be better to check if it was a folder (i.e. in the case of symlinks), but this is the best moonlight lets us do
			const file = await isFile(`vencord/${entry}`);
			const settings = config.vencord[entry];
			if (!file && settings !== undefined && settings.enabled) entries.push(entry);
		}

		const logger = moonlightNode.getLogger('extensionCompat/vencord');

		logger.info(`Loading ${entries.length} extension${s(entries.length)}`);

		const plugins: Record<string, VencordPlugin> = {};
		const failures: string[] = [];
		for (const entry of entries) {
			try {
				plugins[entry] = await VencordPlugin.init(await getPath(`vencord/${entry}`));
			} catch (e) {
				failures.push(entry);
				logger.error(`Failed to load extension ${entry}:\n\n`, e);
			}
		}

		return new Vencord(plugins, failures);
	}

	getMoonlightData(): Required<ExtensionWebExports> {
		return mergeExtensionData(
			Object.values(this.plugins).map(plugin =>
				plugin.convert()
			)
		);
	}
}
