import type { Config, ExtensionData } from '../types';

import VencordPlugin from './plugin';
import { mergeExtensionData } from '../util/data';
import { exists, getPath, isFile, readDir } from '../util/fs';
import { s } from '../util/text';

export default async function getVencordData(config: Config): Promise<ExtensionData> {
	if (!(await exists('vencord'))) return {
		styles: [],
		patches: [],
		webpackModules: {}
	};

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

	return mergeExtensionData(
		await Promise.all(
			entries.map(async entry =>
				await VencordPlugin.convert(await getPath(`vencord/${entry}`), entry)
			)
		)
	);
}
