
const glob = require('glob');
const path = require('path');
const assert = require('assert');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FakerPlugin = require('./faker/index');

const _output = Symbol('output');
const _verify = Symbol('verify');
const _config = Symbol('config');
const _normalize = Symbol('normalize');
const _addFaker = Symbol('addFaker');
const _createHtmlPlugins = Symbol('createPlugins');

/**
 * @description
 * Build a pug's webpackconfig
 * that you can load with laravel-mix webpackConfig method
 *
 * @class Pug
 */
class Pug {
	/**
	 * @description
	 * @param {Array}...entries
	 */
	entry(...entries) {
    this.production = process.env.NODE_ENV === 'production' || process.argv.includes('-p');
    this.config = this[_config]();
    this.entries = this[_normalize](entries);
    this.hash = false;
    this.faker = false;

    return this;
	}

  /**
   * @description
   * @param {Array} entries args
   * @return {void}
   */
  [_normalize](entries) {
    let normalizedEntries = [];

    assert(
      Array.isArray(entries) && entries.length > 0,
      'pug() is missing at least one parameter: entry "path/to/*.pug"'
    );

    entries.forEach(entry => {
      if ( !Array.isArray(entry) ) {
        entry = new Array(entry);
      }

      let [ input, outputDir ] = entry;
      this[_verify](input, outputDir);
      normalizedEntries.push([input, outputDir]);
    });

    return normalizedEntries;
  }

  /**
   * @description
   * Verifies entry and output directory args
   * @param {string} entry Files entry
   * @param {string} outputDir output dir
   * @return {void}
   */
  [_verify](entry, outputDir) {
    assert(
      typeof entry === 'string' && entry.includes('*.pug'),
      'pug() is missing required or valid parameter: entry : "path/to/*.pug"'
    );
    assert(
      glob.sync(path.resolve(process.cwd(), entry)).length > 0,
      `Whoops, no files there ${entry} : entry("path/to/*.pug")`
    );
    assert(
      typeof outputDir === 'string' || outputDir === undefined,
      'pug() is missing required or valid parameter: output : "path/to/html/dir"'
    );
  }

  /**
   * @description Insert an hash number to the css and js files
   */
  withHash() {
    this.hash = true;

    return this;
  }

  /**
   * @description
   * Inject a faker globar variable in pug files
   * see fakers.js documentation for more informations
   */
  withFaker(fakerLocale = undefined) {
    this.faker = true;
    this[_addFaker](fakerLocale);

    return this;
  }

  /**
   * @description
   * Push a webpack.ProvidePlugin with a faker global variable
   * into webpack config plugins[]
   * look at fakers.js documentation for more informations
   */
  [_addFaker](fakerLocale) {
    this.fakerpackage = new FakerPlugin(fakerLocale).package;
    this.config.plugins.push(new webpack.ProvidePlugin({
      faker: this.fakerpackage,
    }));
  }

  /**
   * @description
   * Adds the needed plugins an return a webpackconfig
   * @returns  {Object} webpackconfig
   */
  load() {
    this.entries.forEach(entry => {
      this[_createHtmlPlugins](entry[0], entry[1]);
    });

    return this.config;
  }

  /**
   * @description
   * @returns {Object} webpackconfig
   */
  [_config]() {
    return {
      module: {
        rules: [
          {
            test: /\.pug/,
            use: [
              {
                loader: 'pug-loader',
                options: {
                  pretty: !this.production,
                  ignore: ['**/node_modules/**/*', '**/components/**/*', '**/control/**/*', '**/_*.*'],
                  debug: false,
                }
              }
            ]
          },
        ]
      },
      plugins: []
    };
  }

  /**
   * @description
   * @param {String} file input file
   * @param {String} outputDir output dir
   * @returns {string} output file name with relative path
   */
  [_output](file, outputDir) {
    let fileName = path.basename(file).replace('.pug', '.html');
    let outputFile = outputDir === undefined
      ? fileName
      : path.join(outputDir, fileName);
    return outputFile;
  }

  /**
   * @description
   * Push HtmlWebpackPlugins
   * to the webpackcongig plugins[]
   *
   * @param {string} entry Files entry
   * @param  {string} outputDir Output dir
   * @returns {void}
   */
  [_createHtmlPlugins](entry, outputDir) {
    let pugFiles = glob.sync(path.resolve(process.cwd(), entry));

    pugFiles.forEach(pugFile => {
      this.config.plugins.push(new HtmlWebpackPlugin({
        filename: this[_output](pugFile, outputDir),
        template: pugFile,
        inject: false,
        hash: this.hash,
        env: process.env,
      }));
    });
  }
}

module.exports = new Pug();
