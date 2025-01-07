import type { ExtensionData } from '../types';

import { mergeExtensionData } from '../natives';
import { convertPlugin } from './plugin';

export default function getVencordData(): ExtensionData {
	return mergeExtensionData(
		[
			'path/to/plugin'
		].map(convertPlugin)
	);
}
