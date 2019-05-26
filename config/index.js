

//----------------------------------------------------------------
// The imports
//----------------------------------------------------------------


/**
 * Webpack configuration
 *
 * @type {Object}
 */
let WebpackConfig = require('laravel-mix/setup/webpack.config.js');




//================================================================
// The modifying of webpack configuration
//================================================================



//----------------------------------------------------------------
// The modifying of the rules of output directories
//----------------------------------------------------------------


/**
 * Modify the rules of output directories in the webpack configuration.
 *
 */
modifyOutRules(WebpackConfig.module.rules);


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



//----------------------------------------------------------------
// The configuration of the webpack DevServer
//----------------------------------------------------------------


/**
 * Set the webpack DevServer to the auto opening of the browser.
 *
 */
WebpackConfig.devServer.open = true;


/**
 * Set the webpack DevServer which page to open in the browser.
 *
 */
WebpackConfig.devServer.openPage = '';



//----------------------------------------------------------------
// The exports
//----------------------------------------------------------------


/**
 * The modified webpack configuration.
 *
 * @type {Object}
 */
module.exports = WebpackConfig;
