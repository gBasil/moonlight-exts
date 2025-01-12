import type { PluginMeta } from 'src/extensionCompat/types';

import React from '@moonlight-mod/wp/react';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import * as Components from '@moonlight-mod/wp/discord/components/common/index';
import Flex from '@moonlight-mod/wp/discord/uikit/Flex';
import MarkupUtils from '@moonlight-mod/wp/discord/modules/markup/MarkupUtils';
import IntegrationCard from '@moonlight-mod/wp/discord/modules/guild_settings/IntegrationCard.css';
import CardInfo from './CardInfo';

enum ExtensionPage {
	Info,
	Description
}

export enum ExtensionState {
	NotInstalled,
	Disabled,
	Enabled
}

const { TrashIcon, AngleBracketsIcon, CircleWarningIcon, Tooltip } = Components;
const PanelButton = spacepack.findByCode('Masks.PANEL_BUTTON')[0].exports.Z;
const TabBarClasses = spacepack.findByExports('tabBar', 'tabBarItem', 'headerContentWrapper')[0].exports;
const MarkupClasses = spacepack.findByExports('markup', 'inlineFormat')[0].exports;

export type CardProps = {
	name: string;
	tagline?: string;
	description?: string;
	authors: PluginMeta['authors'];
	tags?: string[];
	version?: string;
	/** The URL to the source code of the extension. */
	source?: string;

	state: ExtensionState;
	implicitlyEnabled: boolean;
	compatible: boolean;
	conflicting: boolean;
	updateAvailable: boolean;
	/**
	 * Callback that runs when clicking the install button to install the extension.
	 *
	 * Returns a boolean that indicates whether the operation succeeded.
	 */
	onInstall: () => Promise<boolean>;
	/**
	 * Callback that runs when clicking the delete button to uninstall the extension.
	 *
	 * Returns a boolean that indicates whether the operation succeeded.
	 */
	onUninstall: () => Promise<boolean>;
	/** Callback that runs when enabling or disabling the extension. */
	onEnableChange: (enabled: boolean) => void;
};

/*

TODO:
- dependencies
- settings
- updates
- implicitly enabled due to being a dependency

*/

export default function Card(props: CardProps) {
	const [tab, setTab] = React.useState(ExtensionPage.Info);
	const [busy, setBusy] = React.useState(false);

	// TODO:
	const restartNeeded = false;

	const { Card, Text, FormSwitch, TabBar, Button } = Components;

	return (
		<Card editable={true} className={IntegrationCard.card}>
			<div className={IntegrationCard.cardHeader}>
				<Flex direction={Flex.Direction.VERTICAL}>
					<Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.CENTER}>
						<Text variant='text-md/semibold'>{props.name}</Text>
					</Flex>

					{props.tagline !== undefined && <Text variant='text-sm/normal'>{MarkupUtils.parse(props.tagline)}</Text>}
				</Flex>

				<Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.END} justify={Flex.Justify.END}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '1rem'
						}}
					>
						{props.source !== undefined && (
							<PanelButton
								icon={AngleBracketsIcon}
								tooltipText='View source'
								onClick={() => {
									window.open(props.source);
								}}
							/>
						)}

						{props.state === ExtensionState.NotInstalled ? (
							<Tooltip text='Incompatible extension' shouldShow={!props.compatible}>
								{tooltipProps => (
									<Button
										{...tooltipProps}
										color={Button.Colors.BRAND}
										submitting={busy}
										disabled={!props.compatible || props.conflicting}
										onClick={() => {
											setBusy(true);

											props.onInstall()
												.finally(() => setBusy(false));
										}}
									>
										Install
									</Button>
								)}
							</Tooltip>
						) : (
							<>
								<PanelButton
									icon={TrashIcon}
									tooltipText='Delete'
									onClick={props.onUninstall}
								/>

								{restartNeeded && (
									<PanelButton
										icon={() => <CircleWarningIcon color={Components.tokens.colors.STATUS_DANGER} />}
										onClick={() => window.location.reload()}
										tooltipText='You will need to reload/restart your client for this extension to work properly.'
									/>
								)}

								<FormSwitch
									value={props.state === ExtensionState.Enabled || props.implicitlyEnabled}
									disabled={props.implicitlyEnabled || !props.compatible}
									hideBorder={true}
									style={{ marginBottom: '0px' }}
									onChange={props.onEnableChange}
								/>
							</>
						)}
					</div>
				</Flex>
			</div>

			<div>
				{(props.description !== undefined) && (
					<TabBar
						selectedItem={tab}
						type='top'
						onItemSelect={setTab}
						className={TabBarClasses.tabBar}
						style={{
							padding: '0 20px'
						}}
					>
						<TabBar.Item className={TabBarClasses.tabBarItem} id={ExtensionPage.Info}>
							Info
						</TabBar.Item>

						{props.description !== undefined && (
							<TabBar.Item className={TabBarClasses.tabBarItem} id={ExtensionPage.Description}>
								Description
							</TabBar.Item>
						)}
					</TabBar>
				)}

				<Flex
					justify={Flex.Justify.START}
					wrap={Flex.Wrap.WRAP}
					style={{
						padding: '16px 16px'
					}}
				>
					{tab === ExtensionPage.Info && <CardInfo {...props} />}
					{tab === ExtensionPage.Description && (
						<Text variant='text-md/normal' className={MarkupClasses.markup} style={{ width: '100%' }}>
							{MarkupUtils.parse(props.description ?? '*No description*', true, {
								allowHeading: true,
								allowLinks: true,
								allowList: true
							})}
						</Text>
					)}
				</Flex>
			</div>
		</Card>
	);
}
