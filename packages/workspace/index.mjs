import * as fs from 'node:fs/promises';
import path from 'node:path';
import * as Ow from '@produck/ow';
import { Assert } from '@produck/idiom';

const MKDIR_OPTIONS = { recursive: true };

const assertName = any => Assert.Type.String(any, 'name');

const assertPathname = any => any.forEach((section, index) => {
	Assert.Type.String(section, `pathname[${index}]`);
});

class Workspace {
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
			return Ow.Error.Common(`The path named ${name} is NOT existed.`);
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

export default Workspace;
