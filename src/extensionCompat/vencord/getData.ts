import type { ExtensionData } from '../types';

import { mergeExtensionData } from '../natives';
import { convertPlugin } from './plugin';

const { fs } = moonlightNodeSandboxed;

export default async function getVencordData(): Promise<ExtensionData> {
	// TODO: Filter out non-folders, check if folder exists, etc.

	const folder = '/absolute/path/to/vencord/plugins/folder';
	const entries = await fs.readdir(folder);

	const folders = entries.map(path => fs.join(folder, path));

	return mergeExtensionData(
		await Promise.all(folders.map(convertPlugin))
	);
}
