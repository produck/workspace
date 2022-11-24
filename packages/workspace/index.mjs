import * as fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_OPTIONS = { recursive: true };

class Workspace {
	#map = { root: path.resolve() };

	async buildAll() {
		await this.buildRoot();

		for (const name in this.#map) {
			await this.build(name);
		}
	}

	async buildRoot() {
		await fs.mkdir(this.root, DEFAULT_OPTIONS);
	}

	async build(name, ...pathname) {
		await fs.mkdir(this.resolve(name, ...pathname), DEFAULT_OPTIONS);
	}

	set root(pathname) {
		this.#map.root = path.resolve(pathname);
	}

	get root() {
		return this.#map.root;
	}

	setPath(name, ...pathname) {
		this.#map[name] = path.join(this.root, ...pathname);
	}

	getPath(name) {
		const pathname = this.#map[name];

		if (!pathname) {
			throw new Error(`The path named ${name} is NOT existed.`);
		}

		return pathname;
	}

	resolve(name, ...pathname) {
		return path.join(this.getPath(name), ...pathname);
	}
}

export default Workspace;