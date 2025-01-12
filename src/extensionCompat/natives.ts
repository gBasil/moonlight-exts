import type { ExtensionWebExports } from '@moonlight-mod/types';
import type { Config, ExtensionData } from './types';

import esbuild from 'esbuild-wasm/lib/browser';
import getVencordData from './vencord/getData';
import { mergeExtensionData } from './util/data';
import { exists, readFileString, writeFileString } from './util/fs';

import esbuildWasm from 'esbuild-wasm/esbuild.wasm';

// buildPluginData might be a better name
export async function buildPluginData(): Promise<ExtensionWebExports> {
	if (!(await hasConfig())) return {
		styles: [],
		patches: [],
		webpackModules: {}
	};

	const config = await readConfig();

	await esbuild.initialize({
		// TODO: Do this better (don't just bundle the entire 10MB file inline)
		wasmURL: URL.createObjectURL(
			new Blob([esbuildWasm])
		)
	});

	const data: ExtensionData[] = [
		await getVencordData(config)
	];

	await esbuild.stop();

	return mergeExtensionData(data);
}

export async function hasConfig(): Promise<boolean> {
	return await exists('config.json');
}

export async function readConfig(): Promise<Config> {
	const text = await readFileString('config.json');
	return JSON.parse(text) as Config;
}

export async function writeConfig(config: Config) {
	const text = JSON.stringify(config, null, '\t');
	await writeFileString('config.json', text);
}

export * from './vencord/natives';
