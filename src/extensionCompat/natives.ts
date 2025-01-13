import type { ExtensionWebExports } from '@moonlight-mod/types';
import type { Config } from './types';

import esbuild from 'esbuild-wasm/lib/browser';
import Vencord from './vencord';
import { mergeExtensionData } from './util/data';
import { exists, readFileString, writeFileString } from './util/fs';

import esbuildWasm from 'esbuild-wasm/esbuild.wasm';

export let vencord: Vencord;

export async function initPlugins() {
	const config = await readConfig();

	await esbuild.initialize({
		// TODO: Do this better (don't just bundle the entire 10MB file inline)
		wasmURL: URL.createObjectURL(
			new Blob([esbuildWasm])
		)
	});

	vencord = await Vencord.init(config);

	await esbuild.stop();
}

export function getMoonlightData(): ExtensionWebExports {
	return mergeExtensionData([
		vencord.getMoonlightData()
	]);
}

export function getVencordPlugins(): Vencord['plugins'] {
	return vencord.plugins;
}

export async function hasConfig(): Promise<boolean> {
	return await exists('config.json');
}

export async function readConfig(): Promise<Config> {
	if (!(await hasConfig())) return new Promise(res => res({ vencord: {} }));
	const text = await readFileString('config.json');
	return JSON.parse(text) as Config;
}

export async function writeConfig(config: Config) {
	const text = JSON.stringify(config, null, '\t');
	await writeFileString('config.json', text);
}

export * from './vencord/natives';
