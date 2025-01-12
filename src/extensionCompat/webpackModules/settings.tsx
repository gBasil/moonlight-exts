import settings from '@moonlight-mod/wp/settings_settings';
import { Settings, pages, notice } from '@moonlight-mod/wp/extensionCompat_ui';

settings.addSection('extensionCompat', 'Extension Compat', Settings, null, -2, notice);
settings.addSectionMenuItems('extensionCompat', ...pages.map(e => e.element as unknown as React.ReactElement));
