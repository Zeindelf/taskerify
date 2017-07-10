var gulp = require('gulp');
var Taskerify = require('./../index');

var $      = Taskerify.Plugins;
var config = Taskerify.config;

Taskerify.extend('styles', function(styles, output, baseDir) {
    var paths = prepGulpPaths(styles, baseDir, output);

    new Taskerify.Task('styles', function() {
        return gulpTask.call(this, paths);
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});

Taskerify.extend('stylesIn', function(baseDir, output) {
    var paths = prepGulpPaths('**/*.css', baseDir, output);

    new Taskerify.Task('stylesIn', function() {
        return gulpTask.call(this, paths);
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});

var gulpTask = function(paths) {
    this.log(paths.src, paths.output);

    return (
        gulp
        .src(paths.src.path)
        .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
        .pipe($.concat(paths.output.name))
        .pipe($.if(config.production, $.cssnano(config.css.cssnano.pluginOptions)))
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest(paths.output.baseDir))
        .pipe(new Taskerify.Notification('Stylesheets Merged!'))
    );
};

var prepGulpPaths = function(src, baseDir, output) {
    return new Taskerify.GulpPaths()
        .src(src, baseDir || config.get('src.css.folder'))
        .output(output || config.get('dist.css.outputFolder'), 'all.css');
};
