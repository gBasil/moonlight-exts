import getNatives from '../util/natives';

const natives = getNatives();
const plugins = natives.getVencordPlugins();

window.Vencord = {
	Plugins: {
		plugins: Object.fromEntries(
			Object.values(plugins)
				.map(e => [e.plugin.name, e.plugin])
		)
	}
};

// StartAt.WebpackReady
// Note: Vencord has several different "start points" (the `StartAt` enum), but we don't support that (and might not have a need to), and *hopefully* doing it like this won't break anything.
for (const { plugin } of Object.values(plugins)) {
	if (plugin.start) plugin.start();
}
