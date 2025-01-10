/** Constructs a RegEx that matches a specific string (unescaping anything that needs escaping). */
export function strToRegex(string: string, flags?: string | undefined): RegExp {
	const escaped = string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');

	return new RegExp(escaped, flags);
}
