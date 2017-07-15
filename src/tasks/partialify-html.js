var gulp        = require('gulp');
var fileinclude = require('gulp-file-include');
var prettify    = require('gulp-html-prettify');
var rename      = require("gulp-rename");
var Taskerify   = require('./../index');

var $      = Taskerify.Plugins;
var config = Taskerify.config;

Taskerify.extend('partialifyHTML', function(src, output, options) {
    new Taskerify.Task('partialify-html', function() {
        var paths = new Taskerify.GulpPaths()
            .src(src || config.get('src.views.folder'))
            .output(output || config.get('dist.views.outputFolder'));

        options = options || {};

        var configs = {
            prefix: options.prefix || '@@',
            basepath: options.basepath || '@file',
            indent: options.indent || 2
        };

        var sources = false;
        src = src || false;
        output = output || false;

        if ( src && output ) {
            sources = true;
        }

        this.log(paths.src, paths.output);

        // var errorHandler = function(e) {
        //     new Taskerify.Notification().error(e, 'Parsing JSON failed');
        //     this.emit('end');
        // };

        return gulp.src(paths.src.path)
            .pipe(fileinclude({
                prefix: configs.prefix,
                basepath: configs.basepath
            }))
            .pipe(prettify({indent_char: ' ', indent_size: configs.indent}))
            // .on('error', errorHandler)
            // .pipe(jsonFormat(configs.indent))
            .pipe($.if( sources, rename(paths.output.name, paths.src.name) ))
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(new Taskerify.Notification('HTML generated'));
    })
    .watch(config.get('src.views.folder') + '/**/*.html');
});
