/**
 * File system with extra methods
 *
 * @type {Object}
 */
let fs = require('fs-extra');

/**
 * The source directory (the module's "example/source" directory).
 *
 * @type {string}
 */
const sourceDirectory = __dirname + '/source/';

/**
 * The target directory (the project's root directory).
 *
 * @type {string}
 */
const targetDirectory = __dirname + '/../../../';

/**
 * The force argument.
 *
 * @type {boolean}
 */
const force = process.argv.includes('-f');

/**
 * Copy the example into the project's root directory.
 *
 */
fs.copySync(
  sourceDirectory,
  targetDirectory,
  { overwrite: force },
);
