

//----------------------------------------------------------------
// The imports
//----------------------------------------------------------------


/**
 * Laravel Mix
 *
 * @type {Object}
 */
let mix = require('laravel-mix');


/**
 * Logger
 *
 * @type {Object}
 */
let logger = require('./logger');


/**
 * Node notifier
 *
 * @type {Object}
 */
let notifier = require('node-notifier');


/**
 * OS
 *
 * This module is included in the Node.js.
 *
 * @type {Object}
 */
let os = require('os');


/**
 * File system with extra methods
 *
 * This module is the dependency of the Laravel Mix.
 *
 * @type {Object}
 */
let fs = require('fs-extra');


/**
 * Path
 *
 * This module is included in the Node.js.
 *
 * @type {Object}
 */
let path = require('path');


/**
 * Chokidar
 *
 * This module is the dependency of the Laravel Mix.
 *
 * @type {Object}
 */
let chokidar = require('chokidar');


/**
 * Escape string to RegExp
 *
 * @type {Function}
 */
let escapeStringRegExp = require('escape-string-regexp');




//================================================================
// The Extension of Laravel Mix
//================================================================



//----------------------------------------------------------------
// Auto versioning
//----------------------------------------------------------------


/**
 * Set auto versioning.
 * If the running is in hot mode then the versioning is OFF, otherwise is ON.
 *
 */
if (!process.argv.includes('--hot')) {
	mix.version();
}



//----------------------------------------------------------------
// The mix.setPublicPath() method
//----------------------------------------------------------------


/**
 * Modify the original mix.setPublicPath() method.
 *
 */


/**
 * The original setPublicPath method.
 *
 * @type {Function}
 */
let originalSetPublicPath = mix.__proto__.setPublicPath;


/**
 * Override the default path to your project's public directory.
 * If the public directory does not exist yet, it will create it.
 *
 * @this mix
 *
 * @param  {string} path The public directory.
 *
 * @return {Object}      The "this" (to chaining), that is the mix object.
 */
mix.__proto__.setPublicPath = function setPublicPath(path) {
	originalSetPublicPath.call(this, path);
	if (Config.publicPath) {
		fs.ensureDirSync(Config.publicPath);
	}
	return this;
};



//----------------------------------------------------------------
// The mix.browserSync() method
//----------------------------------------------------------------


/**
 * Modify the default configuration of mix.browserSync() method.
 *
 */


/**
 * The original browserSync method.
 *
 * @type {Function}
 */
let originalBrowserSync = mix.__proto__.browserSync;


/**
 * Enable Browsersync support for the project.
 * Call the original browserSync method with the new default or the specified custom configuration.
 *
 * @this mix
 *
 * @param  {string|Object} config The custom configuration.
 *
 * @return {Object}               The "this" (to chaining), that is the mix object.
 */
mix.__proto__.browserSync = function browserSync(config) {
	return originalBrowserSync.call(
		this,
		Object.assign(
			// Watch files
			{ files: [Config.publicPath + '/**/*'] },
			// Service
			process.argv.includes('--hot')
				? { proxy: typeof config === 'string' ? config : 'localhost:8080' }
				: {
					proxy: undefined,
					server: { baseDir: [Config.publicPath] }
				}
			,
			// Custom options
			config && typeof config === 'object' ? config : {}
		)
	);
};



//--------------------------------
// The mix.out() method
//--------------------------------


/**
 * The output configuration.
 *
 * @type {Object}
 */
Config.out = {};


/**
 * Add the default settings of the output directories (images and fonts) to configuration.
 * {
 * 	images: {
 * 		directory: 'images',
 * 		extensions: ['png', 'jpe?g', 'gif']
 * 	},
 * 	fonts: {
 * 		directory: 'fonts',
 * 		extensions: ['woff2?', 'ttf', 'eot', 'svg', 'otf']
 * 	}
 * }
 *
 */
addOutProperty(Config.out, 'images', ['png', 'jpe?g', 'gif']);
addOutProperty(Config.out, 'fonts', ['woff2?', 'ttf', 'eot', 'svg', 'otf']);


/**
 * Add an output directory settings to the configuration.
 *
 * @param {Object}   out        The output configuration.
 * @param {string}   directory  The directory setting key and default name.
 * @param {string[]} extensions The file extensions.
 */
function addOutProperty(out, directory, extensions) {
	out[directory] = {
		extensions: extensions
	};
	Object.defineProperty(
		out[directory],
		'directory',
		{
			get: function () {
				return Config.fileLoaderDirs[directory];
			},
			set: function (value) {
				Config.fileLoaderDirs[directory] = value;
			},
			enumerable: true,
			configurable: false
		}
	);
	out[directory].directory = out[directory].directory || directory;
}


/**
 * Set the output directories (modify the default settings).
 *
 * @this mix
 *
 * @param  {Object} options The custom settings.
 *
 * @return {Object}         The "this" (to chaining), that is the mix object.
 */
Object.defineProperty(
	mix.__proto__,
	'out',
	{
		value: function out(options) {
			if (
				options
				&&
				(typeof options === 'object' || typeof options === 'function')
			) {
				for (let key in Config.out) {
					if (Config.out.hasOwnProperty(key)) {
						setOutProperty(key, options);
					}
				}
			}
			return this;
		},
		writable: true,
		enumerable: false,
		configurable: true
	}
);


/**
 * Set a property (which corresponds to an output directory) of Config.out object.
 *
 * @param {string} key     The name of property.
 * @param {Object} options The custom settings.
 */
function setOutProperty(key, options) {
	if (options[key]) {
		// Directory
		let directory = (
			typeof options[key] === 'string' && options[key]
			||
			!Array.isArray(options[key]) && options[key].directory
		);
		if (directory) {
			Config.out[key].directory = '' + directory;
		}
		// Extensions
		let extensions = (
			Array.isArray(options[key]) && options[key]
			||
			Array.isArray(options[key].extensions) && options[key].extensions
		);
		if (extensions) {
			for (let k in Config.out) {
				if (Config.out.hasOwnProperty(k)) {
					Config.out[k].extensions = arraySubtraction(
						Config.out[k].extensions,
						extensions
					);
				}
			}
			Config.out[key].extensions =
				Config.out[key].extensions.concat(extensions)
			;
		}
	}
}


/**
 * Array subtraction.
 *
 * @param  {Array} arrA The minuend array.
 * @param  {Array} arrB The subtrahend array.
 *
 * @return {Array}      The difference array.
 */
function arraySubtraction(arrA, arrB) {
	arrA = arrA.slice();
	for (let i = 0; i < arrB.length; ++i) {
		arrA = arrA.filter(function (value) {
			return value !== arrB[i];
		});
	}
	return arrA;
}



//----------------------------------------------------------------
// The mix.tpl() method
//----------------------------------------------------------------


/**
 * The templates.
 *
 * @type {Object}
 */
Config.tpl = {};


/**
 * Add a template file to template processing and specify the target file.
 *
 * @this mix
 *
 * @param  {string} src    The source template file.
 * @param  {string} target The compiled target file.
 *
 * @return {Object}        The "this" (to chaining), that is the mix object.
 */
Object.defineProperty(
	mix.__proto__,
	'tpl',
	{
		value: function tpl(src, target) {
			Config.tpl[src] = target;
			return this;
		},
		writable: true,
		enumerable: false,
		configurable: true
	}
);


/**
 * Auxiliary variables and RegExp strings for the processing of template tags.
 * A template tag is {{ mix('path/of/file') }} or {{ mix("path/of/file") }}.
 *
 */
let

	/**
	 * The prefix of RegExp strings.
	 *
	 * @type {string}
	 */
	prefix = '\\{\\{\\s*mix\\s*\\(\\s*',


	/**
	 * The suffix of RegExp strings.
	 *
	 * @type {string}
	 */
	suffix = '\\s*\\)\\s*\\}\\}',


	/**
	 * The array of quotes.
	 *
	 * @type {string[]}
	 */
	quotes = ['"', "'"],


	/**
	 * The RegExp string of quotes.
	 *
	 * @type {string}
	 */
	quotesRegExpStr = '[' + quotes.join('') + ']',


	/**
	 * The RegExp string of template tag.
	 *
	 * @type {string}
	 */
	tplTagRegExpStr = getTplTagRegExpStr(),


	/**
	 * The RegExp string of path in template tag.
	 *
	 * @type {string}
	 */
	tplTagPathRegExpStr = getTplTagPathRegExpStr(),


	/**
	 * The number of parts of the RegExp string of template tag.
	 *
	 * @type {integer}
	 */
	numberOfTplTagRegExpParts = 2 * quotes.length + 1

;


/**
 * Get the part of RegExp string of template tag.
 *
 * @param  {string} quote The quote.
 *
 * @return {string}       The part of RegExp string of template tag.
 */
function getTplTagRegExpStrPart(quote) {
	return (
		prefix + quote
		+ '(([^\\\\' + quote + ']|\\\\.)*)'
		+ quote + suffix
	);
}


/**
 * Get the RegExp string of template tag.
 *
 * @return {string} The RegExp string of template tag.
 */
function getTplTagRegExpStr() {
	return '(' + quotes.map(getTplTagRegExpStrPart).join('|') + ')';
}


/**
 * Get the RegExp string of path in template tag.
 *
 * @return {string} The RegExp string of path in template tag.
 */
function getTplTagPathRegExpStr() {
	return (
		'^'
		+ prefix + quotesRegExpStr
		+ '(.*)'
		+ quotesRegExpStr + suffix
		+ '$'
	);
}


/**
 * Get the directory of file from public path.
 *
 * @param  {Object} file The file.
 * @return {string}      The directory of file from public path.
 */
function getDirFromPublicPath(file) {
	return path.posix.dirname(
		path.posix.normalize(
			path.posix.sep
			+ file.path().replace(
				new RegExp(
					'^' + escapeStringRegExp(path.resolve(Config.publicPath))
				),
				''
			).split(path.sep).join(path.posix.sep)
		)
	);
}


/**
 * Replace a template tag.
 *
 * @param  {string} dirFromPublicPath The directory of the file that contains the template tag.
 * @param  {string} tag               The template tag.
 * @param  {Object} replacements      The replacements.
 * @param  {Object} templateFileLog   The template file log.
 *
 * @return {string}                   The replaced (or original) template tag.
 */
function replaceTplTag(dirFromPublicPath, tag, replacements, templateFileLog) {
	let tagPath = tag.replace(new RegExp(tplTagPathRegExpStr), '$1');
	let tagPathFromPublicPath = path.posix.resolve(dirFromPublicPath, tagPath);
	if (
		tagPathFromPublicPath in replacements
		&&
		replacements.hasOwnProperty(tagPathFromPublicPath)
	) {
		let result = (
			path.posix.isAbsolute(tagPath)
				? replacements[tagPathFromPublicPath]
				: path.posix.relative(
					dirFromPublicPath,
					replacements[tagPathFromPublicPath]
				)
		);
		templateFileLog.addTemplateTagLog(tag, result);
		return result;
	}
	templateFileLog.addTemplateTagLog(tag);
	return tag;
}


/**
 * Get the compiled content of template file.
 *
 * @param  {Object}   file            The template file.
 * @param  {string[]} fragments       The content fragments.
 * @param  {string[]} tags            The template tags in original content.
 * @param  {Object}   replacements    The replacements.
 * @param  {Object}   templateFileLog The template file log.
 *
 * @return {string}                The compiled content.
 */
function getCompiledContent(file, fragments, tags, replacements, templateFileLog) {
	let content = '';
	let fragmentStep = numberOfTplTagRegExpParts + 1;
	let dirFromPublicPath = getDirFromPublicPath(file);
	let i = 0;
	for (; i < tags.length; ++i) {
		content += fragments[i * fragmentStep];
		content += replaceTplTag(
			dirFromPublicPath,
			tags[i],
			replacements,
			templateFileLog
		);
	}
	content += fragments[i * fragmentStep];
	return content;
}


/**
 * Compile the template file.
 *
 * @param {string} file            The template file.
 * @param {Object} replacements    The replacements.
 * @param {Object} templateFileLog The template file log.
 */
function compileTemplate(file, replacements, templateFileLog) {
	file = File.find(path.resolve(file));
	let content = file.read();
	let tags = content.match(new RegExp(tplTagRegExpStr, 'g'));
	if (tags && tags.length) {
		content = getCompiledContent(
			file,
			content.split(new RegExp(tplTagRegExpStr)),
			tags,
			replacements,
			templateFileLog
		);
		file.write(content);
	}
}


/**
 * Process the template files.
 *
 * @param {Object} templates The templates.
 */
function processTemplates(templates) {
	var templateProcessingLog = logger.createTemplateProcessingLog();
	var replacements = Mix.manifest.get();
	for (let template in templates) {
		if (templates.hasOwnProperty(template)) {
			// Copy to target
			fs.copySync(template, templates[template]);
			// Compile
			compileTemplate(
				templates[template],
				replacements,
				templateProcessingLog.addTemplateFileLog(
					template,
					templates[template]
				)
			);
		}
	}
	templateProcessingLog.print();
}


/**
 * Watch the file's changes.
 *
 * @param {string}   file     The file.
 * @param {Function} callback The callback function.
 */
function watchFile(file, callback) {
	let absolutePath = File.find(file).path();
	let watcher = chokidar
		.watch(
			absolutePath,
			{
				persistent: true
			}
		)
		.on(
			'change',
			function () {
				if (typeof callback === 'function') {
					callback(file);
				}
				watcher.unwatch(absolutePath);
				watchFile(file, callback);
			}
		)
	;
}


/**
 * Send a cross platform native notification.
 *
 * @param {string} message The message.
 */
function notify(message) {
	if (Mix.isUsing('notifications')) {
		let contentImage = path.join(__dirname, '../img/sunshine.png');
		notifier.notify({
			title: 'The Extension of Laravel Mix',
			message: message,
			contentImage: contentImage,
			icon: (os.platform() === 'win32' || os.platform() === 'linux') ? contentImage : undefined
		});
	}
}


/**
 * Determine whether the template files are watched or not.
 *
 * @type {Boolean}
 */
let areTemplateFilesWatched = false;


/**
 * Set the template processing.
 *
 */
mix.then(function () {
	processTemplates(Config.tpl);
	if (!areTemplateFilesWatched) {
		areTemplateFilesWatched = true;
		// Watch or Hot mode
		if (
			process.argv.includes('--watch')
			||
			process.argv.includes('--hot')
		) {
			// Watch template files
			for (let template in Config.tpl) {
				if (Config.tpl.hasOwnProperty(template)) {
					let tpl = {};
					tpl[template] = Config.tpl[template];
					watchFile(
						template,
						function () {
							processTemplates(tpl);
							notify('The template processing is done.');
						}
					);
				}
			}
		}
	}
});



//----------------------------------------------------------------
// The exports
//----------------------------------------------------------------


/**
 * The extended Laravel Mix.
 *
 * @type {Object}
 */
module.exports = mix;
