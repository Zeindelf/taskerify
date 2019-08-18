const mix = require('laravel-mix');
const normalize = require('normalize-path');

const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');

class Imagemin {
  name() {
    return ['imagemin', 'images', 'img'];
  }

  register(src, output, imageminOptions = {}) {
    const { publicPath } = mix.config;
    const [, path] = output.split(publicPath);

    this.src = src;
    this.output = path;

    this.imageminOptions = Object.assign({
      test: /\.(jpe?g|png|gif|svg)$/i,
      optipng: {
        optimizationLevel: 5,
      },
      plugins: [
        imageminMozjpeg({
          quality: 80,
          progressive: true
        })
      ],
    }, imageminOptions);
  }

  webpackPlugins() {
    return [
      new CopyWebpackPlugin([{
        from: `${this.src}/**`,
        to: normalize(this.output).replace(/^\/|\/$/g, ''),
        flatten: true,
      }]),
      new ImageminPlugin(this.imageminOptions),
    ];
  }
}

mix.extend('imagemin', new Imagemin());
