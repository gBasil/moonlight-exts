export const enum ApplicationCommandInputType {
	BUILT_IN = 0,
	BUILT_IN_TEXT = 1,
	BUILT_IN_INTEGRATION = 2,
	BOT = 3,
	PLACEHOLDER = 4
}
export const OptionalMessageOption = {
	name: 'message',
	description: 'message',
	type: 3 // STRING
};
export const RequiredMessageOption = {
	...OptionalMessageOption,
	required: true
};

export function sendBotMessage() {}
export function findOption() {}
