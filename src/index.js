/**
 * Laravel Mix
 *
 * @type {Object}
 */
const mix = require('laravel-mix');

require('laravel-mix-bundle-analyzer');
require('../plugins/imagemin');
require('../plugins/pug');
require('../plugins/vtex');
require('../plugins/eslint');
require('../plugins/stylelint');

require('../lib/notifications');

/**
 * Disable mix-manifest file
 */
Mix.manifest.refresh = _ => 0;

/**
 * File system with extra methods
 * This module is the dependency of the Laravel Mix.
 *
 * @type {Object}
 */
const fs = require('fs-extra');

//----------------------------------------------------------------
// The mix.setPublicPath() method
//----------------------------------------------------------------

/**
 * Modify the original mix.setPublicPath() method.
 */

/**
 * The original setPublicPath method.
 *
 * @type {Function}
 */
const originalSetPublicPath = mix.__proto__.setPublicPath;

/**
 * Override the default path to your project's public directory.
 * If the public directory does not exist yet, it will create it.
 *
 * @this mix
 * @param  {string} path The public directory.
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
 */

/**
 * The original browserSync method.
 *
 * @type {Function}
 */
const originalBrowserSync = mix.__proto__.browserSync;

/**
 * Enable Browsersync support for the project.
 * Call the original browserSync method with the new default or the specified custom configuration.
 *
 * @this mix
 * @param  {string|Object} config The custom configuration.
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
          },
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
 *   images: {
 *     directory: 'images',
 *     extensions: ['png', 'jpe?g', 'gif']
 *   },
 *  fonts: {
 *   directory: 'fonts',
 *   extensions: ['woff2?', 'ttf', 'eot', 'svg', 'otf']
 *   }
 * }
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

  Object.defineProperty(out[directory], 'directory', {
    get: function() {
      return Config.fileLoaderDirs[directory];
    },
    set: function(value) {
      Config.fileLoaderDirs[directory] = value;
    },
    enumerable: true,
    configurable: false
  });

  out[directory].directory = out[directory].directory || directory;
}

/**
 * Set the output directories (modify the default settings).
 *
 * @this mix
 * @param  {Object} options The custom settings.
 * @return {Object}         The "this" (to chaining), that is the mix object.
 */
Object.defineProperty(mix.__proto__, "out", {
  value: function out(options) {
    if (
      options &&
      (typeof options === "object" || typeof options === "function")
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
});

/**
 * Set a property (which corresponds to an output directory) of Config.out object.
 *
 * @param {string} key     The name of property.
 * @param {Object} options The custom settings.
 */
function setOutProperty(key, options) {
  if (options[key]) {
    // Directory
    let directory =
      (typeof options[key] === "string" && options[key]) ||
      (!Array.isArray(options[key]) && options[key].directory);

    if (directory) {
      Config.out[key].directory = "" + directory;
    }

    // Extensions
    let extensions =
      (Array.isArray(options[key]) && options[key]) ||
      (Array.isArray(options[key].extensions) && options[key].extensions);

    if (extensions) {
      for (let k in Config.out) {
        if (Config.out.hasOwnProperty(k)) {
          Config.out[k].extensions = arraySubtraction(
            Config.out[k].extensions,
            extensions
          );
        }
      }
      Config.out[key].extensions = Config.out[key].extensions.concat(
        extensions
      );
    }
  }
}

/**
 * Array subtraction.
 *
 * @param  {Array} arrA The minuend array.
 * @param  {Array} arrB The subtrahend array.
 * @return {Array}      The difference array.
 */
function arraySubtraction(arrA, arrB) {
  arrA = arrA.slice();

  for (let i = 0; i < arrB.length; ++i) {
    arrA = arrA.filter(function(value) {
      return value !== arrB[i];
    });
  }

  return arrA;
}

/**
 * Internal self invoke methods
 */
mix.prettyNotifications();

/**
 * The extended Laravel Mix.
 *
 * @type {Object}
 */
module.exports = mix;
