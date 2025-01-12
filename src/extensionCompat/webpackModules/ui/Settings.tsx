import type { IconProps } from './Icons';

import React from '@moonlight-mod/wp/react';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import { UserSettingsModalStore } from '@moonlight-mod/wp/common_stores';
import { TabBar } from '@moonlight-mod/wp/discord/components/common/index';
import { useStateFromStores } from '@moonlight-mod/wp/discord/packages/flux';
import { VencordIcon } from './Icons';
import VencordPage from './pages/VencordPage';

const { setSection, clearSubsection } = spacepack.findByExports('setSection', 'clearSubsection')[0].exports.Z;
const TitleBarClasses = spacepack.findByCode('iconWrapper:', 'children:')[0].exports;
const TabBarClasses = spacepack.findByCode('nowPlayingColumn:')[0].exports;
const MarginClasses = spacepack.require('discord/styles/shared/Margins.css');

export const pages: {
	id: string;
	name: string;
	icon: React.FunctionComponent<IconProps>;
	element: React.FunctionComponent;
}[] = [
	{
		id: 'vencord',
		name: 'Vencord',
		icon: VencordIcon,
		element: VencordPage
	}
];

export default function Settings() {
	const subsection = useStateFromStores([UserSettingsModalStore], () => UserSettingsModalStore.getSubsection() ?? 0);
	const setSubsection = React.useCallback(
		(to: string) => {
			if (subsection !== to) setSection('moonbase', to);
		},
		[subsection]
	);

	// "Normally there's an onSettingsClose prop you can set but we don't expose it and I don't care enough to add support for it right now" - Moonbase
	React.useEffect(() => clearSubsection, []);

	return (
		<>
			<div className={`${TitleBarClasses.children} ${MarginClasses.marginBottom20}`}>
				<TabBar
					selectedItem={subsection}
					onItemSelect={setSubsection}
					type='top-pill'
					className={TabBarClasses.tabBar}
				>
					{pages.map((page, i) => (
						<TabBar.Item key={page.id} id={i} className={`${TabBarClasses.item} extensionCompat-settings-tabBarItem`}>
							<page.icon size={24} /> {page.name}
						</TabBar.Item>
					))}
				</TabBar>
			</div>

			{React.createElement(pages[subsection].element)}
		</>
	);
}
