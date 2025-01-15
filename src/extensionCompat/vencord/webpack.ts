import Commands from '@moonlight-mod/wp/commands_commands';
import {
	CommandType,
	InputType
} from '@moonlight-mod/types/coreExtensions/commands';
import getNatives from '../util/natives';
import { OptionalMessageOption } from './shims/@api/Commands';

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
	if (plugin.commands) {
		plugin.commands.forEach(c => {
			console.log(c);

			Commands.registerCommand({
				id: c.name,
				description: c.description,
				options: c.options?.map(opt => OptionalMessageOption) ?? [],
				type: CommandType.CHAT,
				inputType: InputType.BUILT_IN,
				execute: () => {
					console.log('vencord command executed');
				}
			});

		});
		console.log(Commands._getCommands());
	}
}
