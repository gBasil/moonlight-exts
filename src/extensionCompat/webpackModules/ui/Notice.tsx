import type { NoticeProps } from '@moonlight-mod/types/coreExtensions/settings';

import React from '@moonlight-mod/wp/react';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import { ExtensionCompatStore } from '@moonlight-mod/wp/extensionCompat_stores';

export const notice: NoticeProps = {
	stores: [ExtensionCompatStore],
	element: function() {
		// Required here due to lazyloading
		const SettingsNotice = spacepack.findByCode('onSaveButtonColor', 'FocusRingScope')[0].exports.Z;

		return (
			<SettingsNotice
				submitting={ExtensionCompatStore.submitting}
				onReset={() => ExtensionCompatStore.reset()}
				onSave={() => ExtensionCompatStore.writeConfig()}
			/>
		);
	}
};
