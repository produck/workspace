[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
![npm (scoped)](https://img.shields.io/npm/v/%40produck/workspace)
![NPM](https://img.shields.io/npm/l/%40produck%2Fworkspace)
![npm](https://img.shields.io/npm/dm/%40produck/workspace)

# workspace
A tool module for define path aliases and build folder.

## Installation
```
$ npm install @produck/workspace
```

## Example

```js
process.cwd(); // /home/user/example
```

Define path alias and get resolved path.

`setPath`: Define alias for path.\
`getPath`: Get path by path alias.\
`resolve`: Get resolved path by path alias and passed path name.\
`names`: Get generator for registered path alias.\
`entries`: Get generator for registered path.
```js
import Workspace from '@produck/workspace';

const workspace = new Workspace();

worksapce.setPath('root', '.test');
workspace.getPath('root'); // /home/user/example/.test

workspace.setPath('log', 'log');
workspace.getPath('log'); // /home/user/example/.test/log

workspace.getPath('subLog'); // Error: 'The path named subLog is NOT existed.'

workspace.resolve('log', 'subLog'); // /home/user/example/.test/log/subLog

[...workspace.names()]; // ['root', 'log']
[...workspace.entries()];
// [['root', '/home/user/example/.test'], ['log', '/home/user/example/.test/log']]
```

Build folder.

`buildRoot`: Build folder for registered root path.\
`build`: Build folder by path alias and passed path name.\
`buildAll`: Build folder by all registered path.

```js
workspace.buildRoot();
/**
 * /home/user/example
 * 			|__.test
*/
// OR
workspace.build('log', '2023', '0710');
/**
 * /home/user/example
 * 			|__.test
 * 				|__log
 * 					|__2023
 * 		 				|__0710
*/
// OR
workspace.buildAll();
/**
 * /home/user/example
 * 			|__.test
 * 	 			|__log
 *
*/
```

## Usage

As esModule,
```js
import Workspace from '@produck/workspace';

const workspace = new Workspace();
```

As CommonJS,
```js
const Workspace = require('@produck/workspace');
```
