const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const prettify = require('gulp-html-prettify');
const rename = require("gulp-rename");
const Taskerify = require('./../index');

const $ = Taskerify.Plugins;
const config = Taskerify.config;

Taskerify.extend('partialifyHtml', function(src, output, options) {
  const paths = new Taskerify.GulpPaths()
    .src(src || config.get('srcViews.views.folder'))
    .output(output || config.get('distViews.views.outputFolder'));

  new Taskerify.Task('partialify-html', function() {
    options = options || {};

    const configs = {
      prefix: options.prefix || '@@',
      basepath: options.basepath || '@file',
      indent: options.indent || 2,
    };

    let sources = false;
    src = src || false;
    output = output || false;

    if ( src && output ) sources = true;

    return gulp.src(paths.src.path)
      .pipe(fileinclude({
        prefix: configs.prefix,
        basepath: configs.basepath,
      }))
      .pipe(prettify({
        indent_char: ' ',
        indent_size: configs.indent,
      }))
      .pipe($.if( sources, rename(paths.output.name, paths.src.name) ))
      .pipe(gulp.dest(paths.output.baseDir))
      .pipe(new Taskerify.Notification('HTML generated'));
  })
  .watch((paths.src.baseDir || config.get('src.views.folder')) + '/**/*.html');
});
