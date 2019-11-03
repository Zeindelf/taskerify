const mix = require('laravel-mix');

/**
 * Lint stylesheets via ESLINT
 *
 * return {void}
 *
 */
class StylelintMixin {
  /**
   * The optional name to be used when called by Mix.
   *
   * @return {String|Array}   Name
   */
  name() {
    return ['stylelint'];
  }

  /**
   * Merge configuration with defaults
   *
   * @param {Object} settings         An object containing user configuration option overrides
   * @returns {void} false
   */
  register(settings) {
    this.config = settings;
  }

  /**
   * Plugins to be merged with the master webpack config.
   *
   * @return {Array|Object}   Plugin
   */
  webpackPlugins() {
    const StyleLintPlugin = require('stylelint-webpack-plugin');

    return new StyleLintPlugin(this.config);
  }
}

mix.extend('stylelint', new StylelintMixin());
