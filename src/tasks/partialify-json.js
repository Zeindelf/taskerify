const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const fixJson = require('gulp-fix-json');
const jsonFormat = require('gulp-json-format');
const rename = require("gulp-rename");
const Taskerify = require('./../index');

const $ = Taskerify.Plugins;
const config = Taskerify.config;

Taskerify.extend('partialifyJson', function(src, output, options) {
  const paths = new Taskerify.GulpPaths()
    .src(src || config.get('src.json.folder'))
    .output(output || config.get('dist.json.outputFolder'));

  new Taskerify.Task('partialify-json', function() {
    options = options || {};

    const configs = {
      prefix: options.prefix || '@@',
      basepath: options.basepath || '@file',
      indent: options.indent || 2,
    };

    const sources = false;
    src = src || false;
    output = output || false;

    if ( src && output ) sources = true;

    this.log(paths.src, paths.output);

    const errorHandler = function(e) {
      new Taskerify.Notification().error(e, 'Parsing JSON failed');
      this.emit('end');
    };

    return gulp.src(paths.src.path)
      .pipe(fileinclude({
        prefix: configs.prefix,
        basepath: configs.basepath,
      }))
      .pipe(fixJson())
      .on('error', errorHandler)
      .pipe(jsonFormat(configs.indent))
      .pipe($.if( sources, rename(paths.output.name, paths.src.name) ))
      .pipe(gulp.dest(paths.output.baseDir))
      .pipe(new Taskerify.Notification('JSON generated'));
  })
  .watch((paths.src.baseDir || config.get('src.json.folder')) + '/**/*.json');
});
