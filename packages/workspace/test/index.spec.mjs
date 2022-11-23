import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { Workspace } from '../index.mjs';

describe('Workspace::', function () {
	describe('Workspace:: new', function () {
		it('should create a new workspace instance', function () {
			const workspace = new Workspace();

			if (!(workspace instanceof Workspace)) {
				throw new Error('Error');
			}
		});
	});

	describe('Workspace:: buildRoot', function () {
		it('should create root folder', async function () {
			const workspace = new Workspace();

			workspace.root = '.test';
			await workspace.buildRoot();

			const flag = fs.existsSync(workspace.root);

			if (!flag) {
				throw new Error('Built folder is NOT exist.');
			}

			deleteDir(workspace.root);
		});
	});

	describe('Workspace:: buildAll', function () {
		it('should create all folder', async function () {
			const workspace = new Workspace();

			workspace.root = '.buildAll';
			workspace.setPath('a', 'a', 'a1', 'a2');
			workspace.setPath('b', 'b', 'b1', 'b2');
			await workspace.buildAll();

			[workspace.getPath('a'), workspace.getPath('b')].forEach((buildPath) => {
				const flag = fs.existsSync(buildPath);

				if (!flag) {
					throw new Error('Built folder is NOT exist.');
				}
			});

			deleteDir(workspace.root);
		});
	});

	describe('Workspace:: setPath', function () {
		it('should find path prop in workspace instance', function () {
			const workspace = new Workspace();
			workspace.root = '';

			workspace.setPath('tmp', '.tmp', 'a', 'b', 'c', 'd');

			const result = path.resolve('.tmp/a/b/c/d');
			const target = path.resolve(workspace.getPath('tmp'));

			assert.strictEqual(result, target);
		});
	});

	describe('Workspace:: getPath', function () {
		it('should NOT exception', function () {
			const workspace = new Workspace();

			workspace.setPath('t1', 't1');

			const target = workspace.getPath('t1');
			const expected = path.resolve('t1');

			assert.strictEqual(target, expected);
		});

		it('should throw exception', function () {
			const workspace = new Workspace();

			workspace.setPath('t1', 't1');

			assert.throws(() => {
				workspace.getPath('t0');
			}, {
				message: 'The path named t0 is NOT existed.'
			});
		});
	});

	describe('Workspace:: build', function () {
		it('should create multi-level nested file directories', async function () {
			const workspace = new Workspace();

			workspace.root = 'temp';
			workspace.setPath('temp1', 'a', 'b', 'c', 'd');
			await workspace.build('temp1');

			const buildPath = path.resolve('temp', 'a/b/c/d');

			const flag = fs.existsSync(buildPath);

			if (!flag) {
				throw new Error('Target directory is NOT exist.');
			}

			deleteDir(workspace.root);
		});
	});

	describe('Workspace:: resolve', function () {
		it('should return fits the expected absolute path', function () {
			const workspace = new Workspace();
			const expectedPath = path.resolve('resolve', 'a/s/d/f/g');

			workspace.setPath('resolve', 'resolve');
			const target = workspace.resolve('resolve', 'a', 's', 'd', 'f', 'g');

			assert.strictEqual(expectedPath, target);
		});
	});
});

function deleteDir(targetPath) {
	let files = [];

	if (fs.existsSync(targetPath)) {
		files = fs.readdirSync(targetPath);
		files.forEach(file => {
			const curPath = path.join(targetPath, file);

			if (fs.statSync(curPath).isDirectory()) {
				deleteDir(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});

		fs.rmdirSync(targetPath);
	} else {
		throw new Error('Target path is NOT found.');
	}
}