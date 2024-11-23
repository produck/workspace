import * as fs from 'node:fs/promises';
import path from 'node:path';
import * as Ow from '@produck/ow';
import { Assert } from '@produck/idiom';

const MKDIR_OPTIONS = { recursive: true };

export default class Workspace {
	#map = { root: path.resolve() };

	#resolve(name, ...pathnames) {
		return path.join(this.#getPath(name), ...pathnames);
	}

	#getPath(name) {
		const pathname = this.#map[name];

		if (pathname === undefined) {
			return Ow.Error.Common(`The path named ${name} is NOT existed.`);
		}

		return path.resolve(this.root, pathname);
	}

	async #build(name, ...pathnames) {
		await fs.mkdir(this.#resolve(name, ...pathnames), MKDIR_OPTIONS);
	}

	get root() {
		return this.#map.root;
	}

	async buildAll() {
		for (const name in this.#map) {
			await this.#build(name);
		}
	}

	build(...args) {
		return this.#build(...args);
	}

	async buildRoot() {
		await fs.mkdir(this.root, MKDIR_OPTIONS);
	}

	setPath(name, ...pathnames) {
		this.#map[name] = name === 'root'
			? path.resolve(this.root, ...pathnames)
			: path.join(...pathnames);
	}

	resolve(...args) {
		return this.#resolve(...args);
	}

	getPath(...args) {
		return this.#getPath(...args);
	}

	*names() {
		for (const name in this.#map) {
			yield name;
		}
	}

	*entries() {
		for (const name in this.#map) {
			yield [name, this.#getPath(name)];
		}
	}
}

for (const name of ['build', 'setPath', 'resolve']) {
	const _fn = Workspace.prototype[name];

	function assertEachPathname (section, index) {
		Assert.Type.String(section, `pathname[${index}]`);
	}

	Workspace.prototype[name] = { [name]: function (name, ...pathnames) {
		pathnames.forEach(assertEachPathname);

		return _fn.call(this, name, ...pathnames);
	} }[name];
}

for (const name of ['build', 'setPath', 'getPath', 'resolve']) {
	const _fn = Workspace.prototype[name];

	Workspace.prototype[name] = { [name]: function (name, ...args) {
		Assert.Type.String(name, 'name');

		return _fn.call(this, name, ...args);
	} }[name];
}
