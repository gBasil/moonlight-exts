import React from '@moonlight-mod/wp/react';
import MessageActionCreators from '@moonlight-mod/wp/discord/actions/MessageActionCreators';
import { ComponentDispatcher } from '@moonlight-mod/wp/discord/utils/ComponentDispatchUtils';
import * as Components from '@moonlight-mod/wp/discord/components/common/index';

export type ReplyData = {
	authorAvatar: string;
	authorUsername: string;
	messageContent: string;
	messageId: string;
	channelId: string;
};

export type AddEvent = {
	/** The message data. */
	base: ReplyData;
	/** The reply data. */
	reply: ReplyData;
};

export function Component() {
	const listEl = React.useRef<HTMLUListElement>(null);
	// Whether we're currently scrolled to the top of the component,
	// in which case we should scroll to the top again on any update
	const atTop = React.useRef(true);
	// The reply chain, from newest to oldest message
	const [list, setList] = React.useState<ReplyData[]>([]);

	const showWithTwo = moonlight.getConfigOption<boolean>('replyChain', 'showWithTwo') ?? false;

	const shown = list.length >= (showWithTwo ? 2 : 3);

	if (atTop.current && listEl.current) {
		listEl.current.scrollTop = 0;
	}

	React.useEffect(() => {
		ComponentDispatcher.subscribe('REPLYCHAIN_ADD', add);

		function add(data: AddEvent) {
			setList(list => {
				const i = list.findIndex(e => e.messageId === data.base.messageId);

				if (i === -1) return [data.reply, data.base];
				if (i === 0) return [data.reply, ...list];
				return [data.reply, ...list.slice(i)];
			});
		}

		return function() {
			ComponentDispatcher.unsubscribe('REPLYCHAIN_ADD', add);
		};
	}, []);

	React.useEffect(() => {
		if (shown) ComponentDispatcher.subscribe  ('REPLYCHAIN_CLOSE', close);
		else       ComponentDispatcher.unsubscribe('REPLYCHAIN_CLOSE', close);

		return function() {
			ComponentDispatcher.unsubscribe('REPLYCHAIN_CLOSE', close);
		};
	}, [shown]);

	function onScroll() {
		if (!listEl.current) return;

		atTop.current = listEl.current.scrollTop === 0;
	}

	function close() {
		setList([]);
	}

	if (!shown) return <></>;

	return <div className='replyChain-container'>
		<button className='replyChain-close' onClick={close}>
			<Components.XSmallIcon />
		</button>

		<Components.Scroller className='replyChain-scroller'>
			<ul ref={listEl} onScroll={onScroll}>
				{list.map(entry => <Line key={entry.messageId} data={entry} />)}
			</ul>
		</Components.Scroller>
	</div>;
}

function Line({ data }: { data: ReplyData; }) {
	function jump() {
		MessageActionCreators.jumpToMessage({
			channelId: data.channelId,
			messageId: data.messageId,
			flash: true
		});
	}

	// TODO: Render the content properly (highlighting links, removing markdown, and such)
	// TODO: Show a media icon if media exists
	return <li>
		<button className='replyChain-entry' onClick={jump}>
			<img src={data.authorAvatar} alt='' width={16} height={16} />
			<strong>{data.authorUsername}</strong>
			<span>{data.messageContent}</span>
		</button>
	</li>;
}
