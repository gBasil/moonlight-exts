import type { Config, PluginMeta } from '../types';

import { Store } from '@moonlight-mod/wp/discord/packages/flux';
import Dispatcher from '@moonlight-mod/wp/discord/Dispatcher';
import getNatives from '../util/natives';
import { VENCORD_PLUGINS_JSON } from '../consts';

const logger = moonlight.getLogger('extensionCompat');

const natives = getNatives();

class ExtensionCompatStore extends Store<any> {
	vencord: {
		/**
		 * A record of installed plugins and their data.
		 *
		 * The keys are the plugin IDs. The data contains the metadata at the time of installation, and the settings.
		 */
		installed: Config['vencord'];
		/** Like `installed`, but used for reverting to the last saved state. */
		origInstalled: Config['vencord'];
		/** The list of plugins, fetched from a remote URL. */
		repo: PluginMeta[];
	};

	// State for UI
	/** If the config is being saved. Used in <Notice> to show feedback. */
	submitting: boolean;
	/** If the config has been modified. */
	// TODO: To mimic Discord's behavior, actually check if it's different
	modified: boolean;

	constructor() {
		super(Dispatcher);

		this.vencord = {
			repo: [],
			installed: {},
			origInstalled: {}
		};

		this.submitting = false;
		this.modified = false;

		natives.hasConfig()
			.then(has => {
				if (!has) return;
				natives.readConfig()
					.then(data => {
						this.vencord.installed = data.vencord;
						this.vencord.origInstalled = this.clone(data.vencord);
						this.emitChange();
					})
					.catch(e => logger.error('Failed to read extensionCompat config:', e));
			});

		fetch(VENCORD_PLUGINS_JSON)
			.then<PluginMeta[]>(res => res.json())
			.then(data => {
				this.vencord.repo = data;
				this.emitChange();
			})
			.catch(e => logger.error('Failed to fetch Vencord plugins.json:', e));
	}

	// Required by <SettingsNotice />
	showNotice() {
		return this.modified;
	}

	/** Installs a Vencord plugin by its ID. */
	async installVencordPlugin(id: string) {
		try {
			await natives.installVencordPlugin(id);

			const val: Config['vencord'][''] = {
				enabled: true,
				meta: this.vencord.repo.find(e => e.id === id)!,
				settings: {} // TODO: Set default settings?
			};
			// Installing and uninstalling the extension should forcefully modify the entry,
			// given we use the presence of an entry to determine if it's installed
			this.vencord.installed[id] = val;
			this.vencord.origInstalled[id] = val;

			this.writeConfig();
		} catch (e) {
			logger.error(`Error installing Vencord plugin ${id}:`, e);
			throw e;
		}
	}

	/** Uninstalls a Vencord plugin by its ID. */
	async uninstallVencordPlugin(id: string) {
		try {
			await natives.uninstallVencordPlugin(id);

			// TODO: Store the settings regardless of whether a plugin is installed or not?
			delete this.vencord.installed[id];
			delete this.vencord.origInstalled[id];

			// TODO: This shouldn't trigger `modified`, but instead show a
			// dialog to confirm and then immediately write upon confirmation
			this.modified = true;
			this.emitChange();
		} catch (e) {
			logger.error(`Error uninstalling Vencord plugin ${id}:`, e);
			throw e;
		}
	}

	isInstalledVencordPlugin(id: string) {
		return this.vencord.installed[id] !== undefined;
	}

	isEnabledVencordPlugin(id: string) {
		return this.vencord.installed[id].enabled;
	}

	setEnabledVencordPlugin(id: string, enabled: boolean) {
		this.vencord.installed[id].enabled = enabled;
		this.modified = true;
		this.emitChange();
	}

	async writeConfig() {
		this.submitting = true;

		await natives.writeConfig({
			vencord: this.clone(this.vencord.installed)
		});
		this.vencord.origInstalled = this.clone(this.vencord.installed);

		this.submitting = false;
		this.modified = false;
		this.emitChange();
	}

	reset() {
		this.submitting = false;
		this.modified = false;
		this.vencord.installed = this.clone(this.vencord.origInstalled);
		this.emitChange();
	}

	private clone<T>(obj: T): T {
		return structuredClone(obj);
	}
}

const settingsStore = new ExtensionCompatStore();
export { settingsStore as ExtensionCompatStore };
