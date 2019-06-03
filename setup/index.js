/**
 * File system with extra methods
 *
 * @type {Object}
 */
let fs = require('fs-extra');

/**
 * The source directory (the module's "setup/source" directory).
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
 * Copy the webpack.mix.js file into the project's root directory.
 *
 */
fs.copySync(
  sourceDirectory,
  targetDirectory,
  { overwrite: force },
);

/**
 * The package.json file.
 *
 * @type {string}
 */
const packageJsonFile = targetDirectory + 'package.json';

/**
 * The scripts.json file.
 *
 * @type {string}
 */
const scriptsJsonFile = __dirname + '/scripts-to-package.json';

/**
 * The package JSON.
 *
 * @type {Object}
 */
const packageJson = fs.readJsonSync(packageJsonFile);

/**
 * The scripts JSON.
 *
 * @type {Object}
 */
const scriptsJson = fs.readJsonSync(scriptsJsonFile);

/**
 * Merge the scripts JSON into the package JSON.
 *
 */
if (force) { // With overwrite
  packageJson.scripts = Object.assign(
    packageJson.scripts || {},
    scriptsJson.scripts,
  );
} else { // Without overwrite
  packageJson.scripts = Object.assign(
    scriptsJson.scripts,
    packageJson.scripts || {},
  );
}

/**
 * Write back the package JSON into the package.json file.
 *
 */
fs.writeJsonSync(
  packageJsonFile,
  packageJson,
  { spaces: 2 },
);
