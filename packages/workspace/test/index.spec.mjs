import assert from 'node:assert';
import path from 'node:path';
import { Workspace } from '../index.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fs = require('fs-extra');

describe('Workspace::', function () {
	beforeEach(function () {
		fs.ensureDirSync('./.test');
	});

	afterEach(function () {
		fs.removeSync('./.test');
	});

	describe('buildRoot()', function () {
		it('should create root folder', async function () {
			const workspace = new Workspace();

			workspace.root = '.test';
			await workspace.buildRoot();

			assert.ok(fs.existsSync(workspace.root));
		});
	});

	describe('buildAll()', function () {
		it('should create all folder', async function () {
			const workspace = new Workspace();

			workspace.root = '.test';
			workspace.setPath('a', 'a', 'a1', 'a2');
			workspace.setPath('b', 'b', 'b1', 'b2');
			await workspace.buildAll();

			const path1 = workspace.getPath('a');
			const path2 = workspace.getPath('b');
			const flag1 = fs.existsSync(path1);
			const flag2 = fs.existsSync(path2);

			assert.ok(flag1 && flag2);
		});
	});

	describe('setPath()', function () {
		it('should find path prop in workspace instance', function () {
			const workspace = new Workspace();

			workspace.root = '.test';
			workspace.setPath('tmp', '.tmp', 'a', 'b', 'c', 'd');

			const result = path.resolve('.test/.tmp/a/b/c/d');
			const target = path.resolve(workspace.getPath('tmp'));

			assert.strictEqual(result, target);
		});
	});

	describe('getPath()', function () {
		it('should NOT exception', function () {
			const workspace = new Workspace();

			workspace.setPath('t1', 't1');

			const target = workspace.getPath('t1');
			const expected = path.resolve('t1');

			assert.strictEqual(target, expected);
		});

		it('should throw exception', function () {
			const workspace = new Workspace();

			workspace.root = '.test';
			workspace.setPath('t1', 't1');

			assert.throws(() => workspace.getPath('t0'), {
				message: 'The path named t0 is NOT existed.'
			});
		});
	});

	describe('build()', function () {
		it('should create multi-level nested file directories', async function () {
			const workspace = new Workspace();

			workspace.root = '.test';
			workspace.setPath('temp', 'a', 'b', 'c', 'd');
			await workspace.build('temp');

			const buildPath = path.resolve('.test', 'a/b/c/d');

			assert.ok(fs.existsSync(buildPath));
		});
	});

	describe('resolve()', function () {
		it('should return fits the expected absolute path', function () {
			const workspace = new Workspace();
			const expectedPath = path.resolve('resolve', 'a/s/d/f/g');

			workspace.setPath('resolve', 'resolve');

			const target = workspace.resolve('resolve', 'a', 's', 'd', 'f', 'g');

			assert.strictEqual(expectedPath, target);
		});
	});
});