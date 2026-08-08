const matchers = moonlight.getConfigOption<string[]>('excludeAutocompleteEmojis', 'strings')!;

export function shouldShow(text: string): boolean {
	if (matchers.length === 0) return true;

	const match = matchers.some(match => {
		if (match.startsWith('/') && match.endsWith('/')) {
			const regex = new RegExp(match.slice(1, -1));
			return regex.test(text);
		} else {
			return match === text;
		}
	});

	return !match;
}
