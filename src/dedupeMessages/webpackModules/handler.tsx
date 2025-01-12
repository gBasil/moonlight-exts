import { HTTP } from '@moonlight-mod/wp/discord/utils/HTTPUtils';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import React from '@moonlight-mod/wp/react';

const Dispatcher = spacepack.findObjectFromKey(
	spacepack.findByCode(`_checkSavedDispatche${''}s`)[0].exports,
	`_checkSavedDispatche${''}s`
) as Dispatcher;
const Alerts = spacepack.findByCode(`close(){}${''},`)[0].exports.Z as Alerts;

// Discord's URL RegEx
const URL_REGEX = /https?:\/\/[^\s<]+[^<.,:;"')\]\s]/gm;

const logger = moonlight.getLogger('dedupeMessages/handler');

type MessageData = {
	content: string;
	tts: boolean;
	invalidEmojis: unknown[];
	validNonShortcutEmojis: unknown[];
};

type SearchResponse = Awaited<ReturnType<typeof HTTP.get>> & {
	body: {
		messages: [{
			content: string;
		}][];
		total_results: number;
	};
};

interface Dispatcher {
	dispatchToLastSubscribed(key: string, n: unknown): Dispatcher;
}

// There are more options here, but these are just the ones I use
type AlertOptions = Partial<{
	title: string;
	body: string | React.JSX.Element;
	cancelText: string;
	confirmText: string;
	/** Function that gets called when you pres the cancel button. */
	onCancel: () => void;
	onConfirm: () => void;
	/** Function that gets called when you press escape. */
	onCloseCallback: () => void;
}>;
interface Alerts {
	show(options: AlertOptions): Promise<boolean>;
}

function linksInStr(str: string): string[] {
	const links = Array.from(str.matchAll(URL_REGEX)).map(([url]) => url);
	const unique = links.filter((url, i, arr) =>
		!arr.slice(0, i).some(e => e === url)
	);

	return unique;
}

function confirmPrompt(options: AlertOptions): Promise<boolean> {
	return new Promise(resolve => {
		Alerts.show({
			onCancel() { resolve(false); },
			onConfirm() { resolve(true); },
			onCloseCallback() {
				setTimeout(() => resolve(false), 100);
			},
			cancelText: 'Cancel',
			...options
		});
	});
}

// Returns a boolean indicating if message sending should abort
export async function handle(channelId: number, data: MessageData): Promise<boolean> {
	const channels = moonlight.getConfigOption<string[]>('dedupeMessages', 'channels') ?? [];
	if (!channels.includes(channelId.toString())) return false;

	const domains = moonlight.getConfigOption<string[]>('dedupeMessages', 'domains') ?? [];
	const urls = linksInStr(data.content);
	const duplicates = [];

	for (const url of urls) {
		const { host } = new URL(url);

		if (!domains.includes(host)) continue;

		try {
			const data = (await HTTP.get({
				url: `/channels/${channelId}/messages/search`,
				query: { content: url }
			})) as SearchResponse;

			const hasBeenSent = data.body.messages.some(([msg]) => linksInStr(msg.content).includes(url));

			if (hasBeenSent) duplicates.push(url);
		} catch (e) {
			logger.error('Failed to search URL', url, e);
		}
	}

	if (duplicates.length > 0) {
		const send = await confirmPrompt({
			title: 'Send Message?',
			confirmText: 'Send',
			body: <>
				<p>The following URLs have already been sent:</p>

				<ul>
					{duplicates.map(url => <li>
						<a href={url} target='_blank'>{url}</a>
					</li>)}
				</ul>
			</>
		});

		if (!send) {
			Dispatcher.dispatchToLastSubscribed(
				'INSERT_TEXT',
				{ rawText: data.content }
			);

			return true;
		}
	}

	return false;
}
