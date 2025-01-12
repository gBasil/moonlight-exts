import * as natives from '../natives';

export default function getNatives(): typeof natives {
	// Doing it this way duplicates the native code, but moonlight doesn't provide a better way to do this
	if (moonlightNode.isBrowser) return natives;

	return moonlight.getNatives('extensionCompat');
}
