import React from '@moonlight-mod/wp/react';
import { useStateFromStores } from '@moonlight-mod/wp/discord/packages/flux';
import { ExtensionCompatStore } from '@moonlight-mod/wp/extensionCompat_stores';
import BasePage from './BasePage';

export default function VencordPage() {
	const plugins = useStateFromStores([ExtensionCompatStore], () => ExtensionCompatStore.vencord.repo);

	return <BasePage cards={
		plugins.map(e => ({
			name: e.name,
			tagline: e.description,
			// TODO: Use the longer README description for the description
			authors: e.authors,
			tags: e.tags.length > 0 ? e.tags : undefined,
			source: `https://github.com/Vendicated/Vencord/tree/main/src/plugins/${e.id}`,

			state: ExtensionCompatStore.getVencordPluginState(e.id),
			failed: ExtensionCompatStore.getVencordPluginFailed(e.id),

			// TODO: All of these
			compatible: true,
			conflicting: false,
			implicitlyEnabled: false,
			updateAvailable: false,

			onInstall: () => (
				ExtensionCompatStore.installVencordPlugin(e.id)
					.then(() => true)
					.catch(() => false)
			),
			onUninstall: () => (
				ExtensionCompatStore.uninstallVencordPlugin(e.id)
					.then(() => true)
					.catch(() => false)
			),
			onEnableChange: enabled => {
				ExtensionCompatStore.setEnabledVencordPlugin(e.id, enabled);
			}
		}))
	} />;
}
