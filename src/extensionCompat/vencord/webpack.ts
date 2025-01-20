import { ExtensionCompatStore } from '@moonlight-mod/wp/extensionCompat_stores';
import getNatives from '../util/natives';

console.log('hai!');

const natives = getNatives();console.log(1);
const plugins = natives.getVencordPlugins();console.log(2);

window.Vencord = {
	Plugins: {
		plugins: Object.fromEntries(
			Object.values(plugins)
				.map(e => [e.plugin.name, e.plugin])
		)
	}
	// Settings: {
	// 	plugins: new Proxy({}, {
	// 		get(_, pluginName: string) {
	// 			const settings = ExtensionCompatStore.getVencordPluginSettings(pluginName);

	// 			if (settings === undefined)
	// 				throw new Error(`Failed to getting settings for ${pluginName} because it isn't enabled.`);

	// 			return settings;
	// 		},
	// 	})
	// }
};

console.log(':3 ', window.Vencord);

// StartAt.WebpackReady
// Note: Vencord has several different "start points" (the `StartAt` enum), but we don't support that (and might not have a need to), and *hopefully* doing it like this won't break anything.
for (const { plugin } of Object.values(plugins)) {
	if (plugin.start) plugin.start();
}
