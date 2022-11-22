import * as fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_OPTIONS = { recursive: true };

export class Workspace {
	#root = path.resolve();
	#map = {}

	constructor() { }

	async buildAll() {
		await this.buildRoot();

		for (const name in this.#map) {
			await this.build(name);
		}
	}

	async buildRoot() {
		return fs.mkdir(this.root, DEFAULT_OPTIONS);
	}

	async build(name, pathname = '') {
		return fs.mkdir(this.resolve(name, pathname), DEFAULT_OPTIONS);
	}

	set root(pathname) {
		this.#root = path.resolve(pathname);
	}

	get root() {
		return this.#root;
	}

	setPath(name, pathname, fromRoot = true) {
		if (fromRoot) {
			this.#map[name] = path.join(this.root, pathname);
		} else {
			this.#map[name] = path.resolve(pathname);
		}
	}

	getPath(name) {
		const pathname = this.#map[name];

		if (!pathname) {
			throw new Error(`The path named ${name} is NOT existed.`);
		}

		return pathname;
	}

	resolve(name, pathname = '') {
		return path.join(this.getPath(name), pathname);
	}
} 