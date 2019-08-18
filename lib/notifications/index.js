const mix = require('laravel-mix');
const path = require('path');

// install "webpack-build-notifications"
// https://github.com/ntavelis/pretty-mix-notifications
class Notifications {
  constructor() {
    this.defaultConfig = {
      title: 'Taskerify',
      successIcon: path.resolve(__dirname, 'icons/success.png'),
      warningIcon: path.resolve(__dirname, 'icons/error.png'),
      failureIcon: path.resolve(__dirname, 'icons/error.png'),
    };
  }

  /**
   * Add custom config to the 'webpack-build-notifications'
   * @param config
   */
  register(config) {
    this.config = config || {};
  }

  /**
   * Remove the laravel mix notifications plugin, so that we can use our own
   * @param config
   */
  webpackConfig(config) {
    config.plugins.forEach((value, index) => {
      if (value.options !== undefined) {
        if (value.options.title === 'Laravel Mix') {
          config.plugins.splice(index, 1);
        }
      }
    });
  }

  /**
   * Append our webpack notifications plugin, to the master config.
   * If the mix notifications are enabled.
   */
  webpackPlugins() {
    if (Mix.isUsing('notifications')) {
      const WebpackBuildNotifications = require('webpack-build-notifications');

      return new WebpackBuildNotifications(Object.assign(this.defaultConfig, this.config));
    }
  }
}

mix.extend('prettyNotifications', new Notifications());
