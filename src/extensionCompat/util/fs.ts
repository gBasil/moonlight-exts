/** Convenience wrapper for `moonlightNodeSandboxed.fs`, so the whole thing doesn't have to be typed out every time. */
export function fs() {
	return moonlightNodeSandboxed.fs;
}

/**
 * Return a path relative to the `extensionCompat` folder in the moonlight config directory.
 *
 * Optionally creates all parent directories if they don't exist.
 */
export async function getPath(path: string, create = false): Promise<string> {
	const dir = moonlightNode.getMoonlightDir();
	const frags = path.split('/');
	const target = fs().join(dir, 'extensionCompat', ...frags);

	if (create) {
		for (let i = 1; i < frags.length; i++) {
			const subdir = fs().join(dir, 'extensionCompat', ...frags.slice(0, i));

			if (!(await fs().exists(subdir))) await fs().mkdir(subdir);
		}
	}

	return target;
}

/**
 * Return a path to a folder relative to the `extensionCompat` folder in the moonlight config directory.
 *
 * By default, the folder is created if it doesn't exist yet.
 */
export async function getDir(path: string, create = true): Promise<string> {
	const target = await getPath(path, create);

	if (!(await fs().exists(target)))
		await fs().mkdir(target);

	return target;
}

/**
 * Writes a file relative to the `extensionCompat` folder in the moonlight config directory,
 * optionally creating any parent directories if they doesn't exist yet.
 */
export async function writeFile(path: string, data: Uint8Array, create = false) {
	await fs().writeFile(await getPath(path, create), data);
}

/** Writes a text file relative to the `extensionCompat` folder in the moonlight config directory. */
export async function writeFileString(path: string, data: string) {
	await fs().writeFileString(await getPath(path), data);
}

/** Reads a text file relative to the `extensionCompat` folder in the moonlight config directory. */
export async function readFileString(path: string): Promise<string> {
	return await fs().readFileString(await getPath(path));
}

/** Returns whether a path relative to the `extensionCompat` folder in the moonlight config directory exists. */
export async function exists(path: string): Promise<boolean> {
	return await fs().exists(await getPath(path));
}

/** Returns whether a path relative to the `extensionCompat` folder in the moonlight config directory is a file. */
export async function isFile(path: string): Promise<boolean> {
	return await fs().isFile(await getPath(path));
}

/** Removes a directory relative to the `extensionCompat` folder in the moonlight config directory. */
export async function rmDir(path: string) {
	await fs().rmdir(await getPath(path));
}

/** Returns the contents of a folder relative to the `extensionCompat` folder in the moonlight config directory. */
export async function readDir(path: string): Promise<string[]> {
	return await fs().readdir(await getPath(path));
}
