import * as fs from 'node:fs/promises';
import path from 'node:path';

const MKDIR_OPTIONS = { recursive: true };

const assertName = any => {
	if (typeof any !== 'string') {
		throw new TypeError('Invalid "name", one "string" expected.');
	}
};

const validatePathSection = (section, index) => {
	if (typeof section !== 'string') {
		throw new TypeError(`Invalid "pathname[${index}]", one "string" expected.`);
	}
};

const assertPathname = any => any.forEach(validatePathSection);

export class Workspace {
	#map = { root: path.resolve() };

	get root() {
		return this.#map.root;
	}

	async buildAll() {
		for (const name in this.#map) {
			await this.build(name);
		}
	}

	async buildRoot() {
		await fs.mkdir(this.root, MKDIR_OPTIONS);
	}

	async build(name, ...pathname) {
		assertName(name);
		assertPathname(pathname);
		await fs.mkdir(this.resolve(name, ...pathname), MKDIR_OPTIONS);
	}

	setPath(name, ...pathname) {
		assertName(name);
		assertPathname(pathname);

		this.#map[name] = name === 'root'
			? path.resolve(this.root, ...pathname)
			: path.join(...pathname);
	}

	getPath(name) {
		assertName(name);

		const pathname = this.#map[name];

		if (pathname === undefined) {
			throw new Error(`The path named ${name} is NOT existed.`);
		}

		return path.resolve(this.root, pathname);
	}

	resolve(name, ...pathname) {
		assertName(name);
		assertPathname(pathname);

		return path.join(this.getPath(name), ...pathname);
	}

	*names() {
		for (const name in this.#map) {
			yield name;
		}
	}

	*entries() {
		for (const name in this.#map) {
			yield [name, this.getPath(name)];
		}
	}
}
