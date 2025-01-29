/// <reference types='@moonlight-mod/types' />

// These aren't typed in the mappings yet, so I'm only typing what I actually use
declare module '@moonlight-mod/wp/discord/actions/MessageActionCreators' {
	export function jumpToMessage(data: {
		channelId: string;
		messageId: string;
		flash?: boolean;
	}): void;
}
