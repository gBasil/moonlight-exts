/// <reference types='@moonlight-mod/types' />

declare module '@moonlight-mod/wp/discord/utils/ComponentDispatchUtils' {
	// It would be nice to have better typings, like with `GlobalEventHandlersEventMap`
	class ComponentDispatchClass {
		safeDispatch(eventKey: string, ...args: any): this;
		dispatch(eventKey: string, data: any): this;
		dispatchToLastSubscribed(eventKey: string, data: any): this;
		hasSubscribers(eventKey: string): boolean;
		subscribe(eventKey: string, callback: (...args: any) => void): this;
		subscribeOnce(eventKey: string, callback: (...args: any) => void): this;
		// Presumably this `| undefined` is unintentional on Discord's part
		resubscribe(eventKey: string, callback: (...args: any) => void): this | undefined;
		unsubscribe(eventKey: string, callback: (...args: any) => void): this;
		reset(): this;
		dispatchKeyed(primaryKey: string, secondaryKey: string, ...args: any): this;
		subscribeKeyed(primaryKey: string, secondaryKey: string, callback: (...args: any) => void): this;
		unsubscribeKeyed(primaryKey: string, secondaryKey: string, callback: (...args: any) => void): this;
	}

	export const ComponentDispatcher: InstanceType<typeof ComponentDispatchClass>;
	export const ComponentDispatch: ComponentDispatchClass;
}

// These aren't typed in the mappings yet, so I'm only typing what I actually use
declare module '@moonlight-mod/wp/discord/actions/MessageActionCreators' {
	export function jumpToMessage(data: {
		channelId: string;
		messageId: string;
		flash?: boolean;
	}): void;
}
