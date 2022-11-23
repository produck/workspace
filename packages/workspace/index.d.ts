declare namespace Workspace {

}

type PathName = 'root' | string;

interface Workspace {
	/**
	 * Current root path, an absolute path.
	 *
	 */
	root: string;

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
	 * @param pathname A relative path after the path specify by the name.
	 */
	build(name: PathName, ...pathname: string[]): Promise<void>;

	/**
	 * Setting a named path. Overrides the path to a special directory or
	 * file associated with name.
	 * @param name The name of path.
	 * @param pathname A relative path after the path specify by the name.
	 */
	setPath(name: PathName, ...pathname: string[]): void;

	/**
	 * Getting a named path. On failure, an Error is thrown.
	 * @param name The name of path.
	 */
	getPath(name: PathName);

	/**
	 * Resolving a path by named path with a sub path.
	 * @param name The name of path.
	 * @param pathname A relative path after the path specify by the name.
	 */
	resolve(name: PathName, ...pathname: string[]);
}