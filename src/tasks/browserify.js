const gulp       = require('gulp');
const gutil      = require('gulp-util');
const watchify   = require('watchify');
const buffer     = require('vinyl-buffer');
const Taskerify  = require('./../index');
const browserify = require('browserify');
const source     = require('vinyl-source-stream');

var bundle;
var $ = Taskerify.Plugins;
var config = Taskerify.config;

Taskerify.extend('browserify', function(src, output, baseDir, options) {
    var paths = prepGulpPaths(src, baseDir, output);

    new Taskerify.Task('browserify', function() {
        var stream = config.js.browserify.watchify.enabled
            ? watchifyStream
            : browserifyStream;

        bundle = function(stream, paths) {
            this.log(paths.src, paths.output);

            return (
                stream
                .bundle()
                .on('error', function(e) {
                    new Taskerify.Notification().error(e, 'Browserify Failed!');

                    this.emit('end');
                })
                .pipe(source(paths.output.name))
                .pipe(buffer())
                .pipe($.if(config.sourcemaps, $.sourcemaps.init({ loadMaps: true })))
                .pipe($.if(config.production, $.uglify()))
                .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
                .pipe(gulp.dest(paths.output.baseDir))
                .pipe(new Taskerify.Notification('Browserify Compiled!'))
            );
        }.bind(this);

        return bundle(
            stream({
                paths: paths,
                options: options || config.js.browserify.options
            }),
            paths
        );
    })
    .watch();
});

var prepGulpPaths = function(src, baseDir, output) {
    return new Taskerify.GulpPaths()
        .src(src, baseDir || config.get('src.js.folder'))
        .output(output || config.get('dist.js.outputFolder'), 'bundle.js');
};

var browserifyStream = function(data) {
    var stream = browserify(data.paths.src.path, data.options);

    config.js.browserify.transformers.forEach(function(transformer) {
        stream.transform(
            require(transformer.name), transformer.options || {}
        );
    });

    config.js.browserify.plugins.forEach(function(plugin) {
        stream.plugin(
            require(plugin.name), plugin.options || {}
        );
    });

    config.js.browserify.externals.forEach(function(external) {
        stream.external(external);
    });

    return stream;
};

var watchifyStream = function(data) {
    var browserify = watchify(
        browserifyStream(data),
        config.js.browserify.watchify.options
    );

    browserify.on('log', gutil.log);
    browserify.on('update', function() {
        bundle(browserify, data.paths);
    });

    return browserify;
};
