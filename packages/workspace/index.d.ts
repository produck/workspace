type PathName = 'root' | string;

export default class Workspace {
	/**
	 * Current root path, an absolute path.
	 */
	readonly root: string;

	/**
	 * `Workspace.buildRoot()` & all `Workspace.build()`.
	 */
	buildAll(): Promise<void>;

	/**
	 * Build the root path in fs.
	 */
	buildRoot(): Promise<void>;

	/**
	 * Build a specific name path in fs.
	 * @param name The name of path.
	 * @param pathnames A relative path after the path specify by the name.
	 */
	build(name: PathName, ...pathnames: string[]): Promise<void>;

	/**
	 * Setting a named path. Overrides the path to a special directory or
	 * file associated with name.
	 * @param name The name of path.
	 * @param pathnames A relative path after the path specify by the name.
	 */
	setPath(name: PathName, ...pathnames: string[]): void;

	/**
	 * Getting a named path. On failure, an Error is thrown.
	 * @param name The name of path.
	 */
	getPath(name: PathName): string;

	/**
	 * Resolving a path by named path with a sub path.
	 * @param name The name of path.
	 * @param pathnames A relative path after the path specify by the name.
	 */
	resolve(name: PathName, ...pathnames: string[]): string;

	/**
	 * Return an iterator of all path names.
	 */
	names(): Generator<PathName, void, unknown>;

	/**
	 * Return an iterator of all path names and path values.
	 */
	entries(): Generator<[PathName, string], void, unknown>;
}
