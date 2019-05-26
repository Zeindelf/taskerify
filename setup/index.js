

//----------------------------------------------------------------
// The imports
//----------------------------------------------------------------


/**
 * File system with extra methods
 *
 * @type {Object}
 */
let fs = require('fs-extra');




//================================================================
// The setup
//================================================================


/**
 * Set up The Extension of Laravel Mix to the project.
 *
 */


/**
 * The directories
 *
 */
let

	/**
	 * The source directory (the module's "setup/source" directory).
	 *
	 * @type {string}
	 */
	sourceDirectory = __dirname + '/source/',


	/**
	 * The target directory (the project's root directory).
	 *
	 * @type {string}
	 */
	targetDirectory = __dirname + '/../../../'

;


/**
 * The force argument.
 *
 * @type {boolean}
 */
let force = process.argv.includes('-f');



/**
 * Copy the webpack.mix.js file into the project's root directory.
 *
 */
fs.copySync(
	sourceDirectory,
	targetDirectory,
	{overwrite: force}
);



/**
 * Set commands (scripts) in package.json.
 *
 */


/**
 * The package and scripts JSONs.
 *
 */
let

	/**
	 * The package.json file.
	 *
	 * @type {string}
	 */
	packageJsonFile = targetDirectory + 'package.json',


	/**
	 * The scripts.json file.
	 *
	 * @type {string}
	 */
	scriptsJsonFile = __dirname + '/scripts-to-package.json',


	/**
	 * The package JSON.
	 *
	 * @type {Object}
	 */
	packageJson = fs.readJsonSync(packageJsonFile),


	/**
	 * The scripts JSON.
	 *
	 * @type {Object}
	 */
	scriptsJson = fs.readJsonSync(scriptsJsonFile)

;


/**
 * Merge the scripts JSON into the package JSON.
 *
 */

// With overwrite
if (force) {
	packageJson.scripts = Object.assign(
		packageJson.scripts || {},
		scriptsJson.scripts
	);
}

// Without overwrite
else {
	packageJson.scripts = Object.assign(
		scriptsJson.scripts,
		packageJson.scripts || {}
	);
}


/**
 * Write back the package JSON into the package.json file.
 *
 */
fs.writeJsonSync(
	packageJsonFile,
	packageJson,
	{spaces: 2}
);
