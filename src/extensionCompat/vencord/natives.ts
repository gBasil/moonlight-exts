import { parseTarGzip } from 'nanotar';
import { readDir, rmDir, writeFile } from '../util/fs';

export async function installVencordPlugin(id: string) {
	// TODO: Prevent the race condition where there's a really small chance that the fetched plugin ends up being newer than the version shown in the repo (since the repo can be outdated)
	// (hash checks should really be implemented)
	const pluginUrl = `https://gbasil.github.io/extensionCompat-artifacts/vencord/plugins/${id}.tar.gz`;

	const tar = await fetch(pluginUrl)
		.then(res => res.arrayBuffer())
		.then(dir => parseTarGzip(dir));

	for (const entry of tar) {
		if (entry.type !== 'file') continue;

		const name = entry.name.replace(/^\.?\//, '');
		// Surely plugins won't do evil things and have slashes in their IDs
		await writeFile(`vencord/${id}/${name}`, entry.data!, true);
	}
}

export async function uninstallVencordPlugin(id: string) {
	await rmDir(`vencord/${id}`);

	if ((await readDir('vencord')).length === 0) await rmDir('vencord');
}
