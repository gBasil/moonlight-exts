import type { ExtensionData } from '../types';

import { mergeExtensionData } from '../natives';
import VencordPlugin from './plugin';

const { fs } = moonlightNodeSandboxed;

export default async function getVencordData(): Promise<ExtensionData> {
	// TODO: Filter out non-folders, check if folder exists, etc.

	const location = '/absolute/path/to/vencord/plugins/';
	const entries = (await fs.readdir(location))
		.filter(e => e !== '.DS_Store' && !e.startsWith('_'));

	moonlightNode.getLogger('extensionCompat/vencord').info(`Loading extensions: ${entries.join(', ')}`);

	return mergeExtensionData(
		await Promise.all(
			entries.map(entry =>
				VencordPlugin.convert(fs.join(location, entry), entry)
			)
		)
	);
}
