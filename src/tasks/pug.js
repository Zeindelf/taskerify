
var path = require('path');
var gulp = require('gulp');
var extend = require('extend');
var pick = require('object.pick');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var ignore  = require('gulp-ignore');
var Taskerify = require('./../index');

var $ = Taskerify.Plugins;
var config = Taskerify.config;
var Task = Taskerify.Task;

Taskerify.extend('pug', function (src, output, options) {
    options = extend({
        pretty: true,
        exclude: [
            '**/_*/**/*.pug',
        ],
    }, options);

    var pugOptions = pick(
        options,
        [
            'basedir',
            'doctype',
            'pretty',
            'filters',
            'self',
            'debug',
            'compileDebug',
            'locals',
            'globals',
            'cache',
            'inlineRuntimeFunctions',
            'name'
        ]
    );

    return new Task('pug', function () {
        var paths = new Taskerify.GulpPaths()
            .src(src || path.normalize(config.get('srcViews.views.folder')))
            .output(output || path.normalize(config.get('distViews.views.outputFolder')));

        this.log(paths.src, paths.output);

        var errorHandler = function(e) {
            new Taskerify.Notification().error(e, 'Parsing Pug failed');
            this.emit('end');
        };

        return gulp.src(paths.src.path + '*.pug')
            .pipe(plumber())
            .pipe(ignore.exclude(options.exclude))
            .pipe(pug(pugOptions))
            .on('error', errorHandler)
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(new Taskerify.Notification('Pug generated'));
    })
    .watch(path.normalize(config.get('srcViews.views.folder') + '/**/*.pug'));
});
