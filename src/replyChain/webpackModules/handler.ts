import type { AddEvent, ReplyData } from './component';

type Message = {
	id: string;
	content: string;
	channel_id: string;
	author: {
		getAvatarURL: (guildId?: string | null, size?: number) => string;
		globalName: string | null;
		username: string;
	};
};

type MessageData = {
	baseMessage: Message;
	referencedMessage: {
		state: 1;
	} | {
		state: 0;
		message: Message;
	};
	replyReference: {
		channel_id: string;
		message_id: string;
	};
	channel: {
		guild_id: string | null;
	};
};

function getReplyData(message: Message, guildId: string | null): ReplyData {
	return {
		authorAvatar: message.author.getAvatarURL(guildId, 16),
		// TODO: Get guild username
		authorUsername: message.author.globalName ?? message.author.username,
		messageContent: message.content,
		messageId: message.id,
		channelId: message.channel_id
	};
}

export async function handle(data: MessageData) {
	// If the reply isn't loaded, we don't jump, so we also shouldn't attempt to add it to the list
	if (data.referencedMessage.state === 1) return;

	const whitelist = moonlight.getConfigOption<string[]>('replyChain', 'whitelist') ?? [];
	if (whitelist.length > 0 && !whitelist.includes(data.baseMessage.channel_id)) {
		return;
	}

	document.dispatchEvent(
		new CustomEvent<AddEvent>('replyChain-add', {
			detail: {
				base:  getReplyData(data.baseMessage,               data.channel.guild_id),
				reply: getReplyData(data.referencedMessage.message, data.channel.guild_id)
			}
		})
	);
}
