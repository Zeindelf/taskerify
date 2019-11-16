const mix = require('laravel-mix');
const path = require('path');

class Puglint {
  dependencies() {
    this.requiresReload = `
      Dependencies have been installed. Please run "npm run dev" again.
    `;

    return ['pug', 'pug-lint', 'puglint-stylish'];
  }

  register(options = {}) {
    this.options = {
      ...options,
    };
  }

  webpackRules() {
    return  {
      enforce: 'pre',
      test: /\.(pug|jade)$/,
      exclude: /node_modules/,
      loader: path.resolve(__dirname, './pug-lint-loader.js'),
      options: this.options,
    };
  }
}

mix.extend('puglint', new Puglint());
