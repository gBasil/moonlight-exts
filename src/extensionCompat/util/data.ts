import type { ExtensionData } from '../types';

export function mergeExtensionData(data: ExtensionData[]): ExtensionData {
	return data.reduce<ExtensionData>((acc, cur) => {
		for (const item of cur.styles) acc.styles.push(item);
		for (const item of cur.patches) acc.patches.push(item);
		for (const [key, val] of Object.entries(cur.webpackModules)) {
			acc.webpackModules[key] = val;
		}

		return acc;
	}, {
		styles: [],
		patches: [],
		webpackModules: {}
	});
}
