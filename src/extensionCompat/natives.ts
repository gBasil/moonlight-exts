import type { ExtensionWebExports } from '@moonlight-mod/types';
import type { ExtensionData } from './types';

import esbuild from 'esbuild-wasm/lib/browser';
import getVencordData from './vencord/getData';
import { mergeExtensionData } from './util/data';

import esbuildWasm from 'esbuild-wasm/esbuild.wasm';

export interface CompatNatives {
	getPluginData(): Promise<ExtensionWebExports>;
};

// buildPluginData might be a better name
export async function getPluginData(): Promise<ExtensionWebExports> {
	await esbuild.initialize({
		// TODO: Do this better (don't just bundle the entire 10MB file inline)
		wasmURL: URL.createObjectURL(
			new Blob([esbuildWasm])
		)
	});

	const data: ExtensionData[] = [
		await getVencordData()
	];

	await esbuild.stop();

	return mergeExtensionData(data);
};
