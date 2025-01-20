import { ExtensionCompatStore } from '@moonlight-mod/wp/extensionCompat_stores';

export function definePluginSettings<
	Def extends SettingsDefinition,
	Checks extends SettingsChecks<Def>,
	PrivateSettings extends object = {}
>(def: Def, checks?: Checks) {
	// const definedSettings: DefinedSettings<Def, Checks, PrivateSettings> = {
	//     get store() {
	//         if (!definedSettings.pluginName) throw new Error("Cannot access settings before plugin is initialized");
	//         return Settings.plugins[definedSettings.pluginName] as any;
	//     },
	//     get plain() {
	//         if (!definedSettings.pluginName) throw new Error("Cannot access settings before plugin is initialized");
	//         return PlainSettings.plugins[definedSettings.pluginName] as any;
	//     },
	//     use: settings => useSettings(
	//         settings?.map(name => `plugins.${definedSettings.pluginName}.${name}`) as UseSettings<Settings>[]
	//     ).plugins[definedSettings.pluginName] as any,
	//     def,
	//     checks: checks ?? {} as any,
	//     pluginName: "",

	//     withPrivateSettings<T extends object>() {
	//         return this as DefinedSettings<Def, Checks, T>;
	//     }
	// };

	// const definedSettings = new


	const definedSettings = {
		get store() {
			console.log('a');
			// TODO: Don't hardcore the iD!!!!!!!!!!!!!!!!!!!!!!!
			console.log(window.Vencord);
			const a = window.Vencord.Settings.plugins['ctrlEnterSend'];
			console.log('b');
			return a;
		}
	};

	return definedSettings;
	// return def;
}
