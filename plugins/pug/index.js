const mix = require("laravel-mix");
const glob = require("glob");
const path = require("path");
const normalize = require("normalize-path");
const webpack = require("webpack");
const _ = require("lodash");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const FakerPlugin = require("./faker/index");

class Pug {
  name() {
    return ["pug"];
  }

  register(src, dist, customOptions = {}) {
    this.rootPath = path.resolve(__dirname, "../../../../");
    this.production =
      process.env.NODE_ENV === "production" || process.argv.includes("-p");

    const views = path.resolve(this.rootPath, src);
    const options = _.extend({}, customOptions);

    this.htmlPlugins = this.generateHtmlPlugins(views, dist);
    options.fakerLocale && this.withFaker(options.fakerLocale);
  }

  /**
   * @description
   * Inject a faker global variable in pug files
   * See fakers.js documentation for more informations
   */
  withFaker(fakerLocale) {
    this.faker = new webpack.ProvidePlugin({
      faker: new FakerPlugin(fakerLocale).package
    });
  }

  generateHtmlPlugins(views, dist) {
    const options = { cwd: views, ignore: ["**/_*/**"] };
    const files = glob.sync("**/*.pug", options);

    return files.map(file => {
      const [name, extension] = file.split(".");

      return new HtmlWebpackPlugin({
        filename: normalize(`${dist}/${name}.html`),
        template: normalize(`${views}/${name}.${extension}`),
        inject: false,
        env: process.env
      });
    });
  }

  webpackRules() {
    return {
      test: /\.pug/,
      use: [
        {
          loader: "pug-loader",
          options: {
            pretty: !this.production,
            ignore: [
              "**/node_modules/**/*",
              "**/components/**/*",
              "**/control/**/*",
              "**/_*/**",
              "**/_*.*"
            ],
            debug: false
          }
        }
      ]
    };
  }

  webpackPlugins() {
    const plugins = [...this.htmlPlugins];
    this.faker && plugins.push(this.faker);
    return plugins;
  }
}

mix.extend("pug", new Pug());
