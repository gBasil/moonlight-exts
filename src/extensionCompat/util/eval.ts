// Taken from packages/core/src/extension/loader.ts in moonlight (written by me)
export async function evalEsm<T>(source: string): Promise<T> {
	// Data URLs (`data:`) don't seem to work under the CSP, but object URLs do
	const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));

	const module = await import(url);

	URL.revokeObjectURL(url);

	return module;
}
