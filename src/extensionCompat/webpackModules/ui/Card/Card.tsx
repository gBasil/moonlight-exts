import type { PluginMeta } from 'src/extensionCompat/types';
import type { ExtensionSettingsManifest } from '@moonlight-mod/types';

import React from '@moonlight-mod/wp/react';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import * as Components from '@moonlight-mod/wp/discord/components/common/index';
import Flex from '@moonlight-mod/wp/discord/uikit/Flex';
import MarkupUtils from '@moonlight-mod/wp/discord/modules/markup/MarkupUtils';
import IntegrationCard from '@moonlight-mod/wp/discord/modules/guild_settings/IntegrationCard.css';
import { ExtensionState } from 'src/extensionCompat/types';
import CardInfo from './CardInfo';
import CardSettings from './CardSettings';

enum ExtensionPage {
	Info,
	Description,
	Settings
}

const { TrashIcon, AngleBracketsIcon, CircleWarningIcon, Tooltip, Card: DiscordCard, Text, FormSwitch, TabBar, Button } = Components;
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

	settings?: Record<string, ExtensionSettingsManifest>;

	state: ExtensionState;
	implicitlyEnabled: boolean;
	compatible: boolean;
	conflicting: boolean;
	failed: boolean;
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
	/** Callback that runs when a setting value is changed */
	onSettingsChange(key: string, value: any): void;
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

	// const hasSettings = props.state === ExtensionState.Enabled && Extens;

	return (
		<DiscordCard editable={true} className={IntegrationCard.card}>
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
						{props.failed && (
							<Tooltip
								text={
									'An error ocurred when attempting to load this plugin.' +
									'\n\n' +
									'The full error has been printed to the console.'
								}
								tooltipStyle={{ 'whiteSpaceCollapse': 'preserve-breaks' }}
								shouldShow
							>
								{tooltipProps => (
									<CircleWarningIcon {...tooltipProps} color={Components.tokens.colors.STATUS_DANGER} />
								)}
							</Tooltip>
						)}

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

						{/*
							// TODO: This is only visible after the plugin is enabled and loaded.
							It would be good if it was at least indicated that a plugin *has* settings when uninstalled/disabled
						*/}
						{(props.settings !== undefined) && (
							<TabBar.Item className={TabBarClasses.tabBarItem} id={ExtensionPage.Settings}>
								Settings
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
					{/* {tab === ExtensionPage.Settings && <CardSettings
						settings={props.settings!}
						onChange={props.onSettingsChange}
					/>} */}
				</Flex>
			</div>
		</DiscordCard>
	);
}
