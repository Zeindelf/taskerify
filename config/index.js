/**
 * Webpack configuration
 *
 * @type {Object}
 */
const WebpackConfig = require('laravel-mix/setup/webpack.config.js');

/**
 * Dotenv plugin
 */
const Dotenv = require('dotenv-webpack');

/**
 * Modify the rules of output directories in the webpack configuration.
 */
modifyOutRules(WebpackConfig.module.rules);

modifyPlugins(WebpackConfig.plugins);

/**
 * Modify the rules of output directories.
 *
 * @param  {Array} rules The rules.
 */
function modifyOutRules(rules) {
  for (let i = 0; i < rules.length; ++i) {
    if (rules[i].test) {
      switch ('' + rules[i].test) {
        // Images
        case '/\\.(png|jpe?g|gif)$/':
          modifyOutRule(rules[i], 'images');
          break;

        // Fonts
        case '/\\.(woff2?|ttf|eot|svg|otf)$/':
          modifyOutRule(rules[i], 'fonts');
          break;

        default:
          return false;
      }
    }
  }
}

/**
 * Modify the rule of output directory.
 *
 * @param  {Object} rule The rule.
 * @param  {string} type The output directory type.
 */
function modifyOutRule(rule, type) {
  rule.test = new RegExp(
    '\\.(' + Config.out[type].extensions.join('|') + ')$'
  );
}

function modifyPlugins(plugins) {
  plugins.push(new Dotenv());
}

/**
 * Set the webpack DevServer to the auto opening of the browser.
 */
WebpackConfig.devServer.open = true;

/**
 * Set the webpack DevServer which page to open in the browser.
 */
WebpackConfig.devServer.openPage = '';

/**
 * The modified webpack configuration.
 *
 * @type {Object}
 */
module.exports = WebpackConfig;
