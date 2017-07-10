var gulp        = require('gulp');
var fileinclude = require('gulp-file-include');
var fixJson     = require('gulp-fix-json');
var jsonFormat  = require('gulp-json-format');
var rename      = require("gulp-rename");
var Taskerify   = require('./../index');

var $      = Taskerify.Plugins;
var config = Taskerify.config;

Taskerify.extend('jsonInclude', function(src, output, options) {
    new Taskerify.Task('json-include', function() {
        var paths = new Taskerify.GulpPaths()
            .src(src || config.get('src.json.folder'))
            .output(output || config.get('dist.json.outputFolder'));

        options = options || {};

        var configs = {
            prefix: options.prefix || '@',
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

        var errorHandler = function(e) {
            new Taskerify.Notification().error(e, 'Parsing JSON failed');
            this.emit('end');
        };

        return gulp.src(paths.src.path)
            .pipe(fileinclude({
                prefix: configs.prefix,
                basepath: configs.basepath
            }))
            .pipe(fixJson())
            .on('error', errorHandler)
            .pipe(jsonFormat(configs.indent))
            .pipe($.if( sources, rename(paths.output.name, paths.src.name) ))
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(new Taskerify.Notification('JSON generated'));
    })
    .watch(config.get('src.json.folder') + '/**/*.json');
});
