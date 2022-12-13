import assert from 'node:assert/strict';
import path from 'node:path';
import Workspace from '../index.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fs = require('fs-extra');
const TEST_PATH = '.test';

describe('Workspace::', function () {
	this.beforeEach(() => fs.ensureDirSync(TEST_PATH));
	this.afterEach(() => fs.removeSync(TEST_PATH));

	describe('root', function () {
		it('should return absolute path', async function () {
			const workspace = new Workspace();

			workspace.setPath('root', TEST_PATH);
			assert.ok(path.isAbsolute(workspace.getPath('root')));
		});
	});

	describe('buildRoot()', function () {
		it('should create root folder', async function () {
			const workspace = new Workspace();

			workspace.setPath('root', TEST_PATH);
			await workspace.buildRoot();

			assert.ok(fs.existsSync(workspace.root));
		});
	});

	describe('buildAll()', function () {
		it('should create all folder', async function () {
			const workspace = new Workspace();

			workspace.setPath('root', TEST_PATH);
			workspace.setPath('a', 'a', 'a1', 'a2');
			workspace.setPath('b', 'b', 'b1', 'b2');

			await workspace.buildAll();

			assert.ok(fs.existsSync(workspace.getPath('a')));
			assert.ok(fs.existsSync(workspace.getPath('b')));
		});
	});

	describe('setPath()', function () {
		it('should find path prop in workspace instance', function () {
			const workspace = new Workspace();

			workspace.setPath('root', TEST_PATH);
			workspace.setPath('tmp', '.tmp', 'a', 'b', 'c', 'd');

			assert.equal(
				workspace.getPath('tmp'),
				path.resolve('.test/.tmp/a/b/c/d')
			);
		});

		it('should throw if bad name.', function () {
			const workspace = new Workspace();

			assert.throws(() => workspace.setPath(1), {
				name: 'TypeError',
				message: 'Invalid "name", one "string" expected.'
			});
		});

		it('should throw if bad ...pathname.', function () {
			const workspace = new Workspace();

			assert.throws(() => workspace.setPath('a', '1', null), {
				name: 'TypeError',
				message: 'Invalid "pathname[1]", one "string" expected.'
			});
		});
	});

	describe('getPath()', function () {
		it('should NOT exception', function () {
			const workspace = new Workspace();

			workspace.setPath('t1', 't1');
			assert.equal(workspace.getPath('t1'), path.resolve('t1'));
		});

		it('should throw exception', function () {
			const workspace = new Workspace();

			workspace.setPath('root', TEST_PATH);
			workspace.setPath('t1', 't1');

			assert.throws(() => workspace.getPath('t0'), {
				message: 'The path named t0 is NOT existed.'
			});
		});

		it('should throw if bad name.', function () {
			const workspace = new Workspace();

			assert.throws(() => workspace.getPath(1), {
				name: 'TypeError',
				message: 'Invalid "name", one "string" expected.'
			});
		});
	});

	describe('build()', function () {
		it('should create multi-level nested file directories', async function () {
			const workspace = new Workspace();

			workspace.setPath('root', TEST_PATH);
			workspace.setPath('temp', 'a', 'b', 'c', 'd');
			await workspace.build('temp');

			const buildPath = path.resolve(TEST_PATH, 'a/b/c/d');

			assert.ok(fs.existsSync(buildPath));
		});

		it('should throw if bad name.', function () {
			const workspace = new Workspace();

			assert.rejects(() => workspace.build(1), {
				name: 'TypeError',
				message: 'Invalid "name", one "string" expected.'
			});
		});

		it('should throw if bad ...pathname.', function () {
			const workspace = new Workspace();

			assert.rejects(() => workspace.build('a', '1', null), {
				name: 'TypeError',
				message: 'Invalid "pathname[1]", one "string" expected.'
			});
		});
	});

	describe('resolve()', function () {
		it('should return fits the expected absolute path', function () {
			const workspace = new Workspace();

			workspace.setPath('resolve', 'resolve');

			assert.equal(
				workspace.resolve('resolve', 'a', 's', 'd', 'f', 'g'),
				path.resolve('resolve', 'a/s/d/f/g')
			);
		});

		it('should throw if bad name.', function () {
			const workspace = new Workspace();

			assert.throws(() => workspace.resolve(1), {
				name: 'TypeError',
				message: 'Invalid "name", one "string" expected.'
			});
		});

		it('should throw if bad ...pathname.', function () {
			const workspace = new Workspace();

			assert.throws(() => workspace.resolve('a', '1', null), {
				name: 'TypeError',
				message: 'Invalid "pathname[1]", one "string" expected.'
			});
		});
	});
});
