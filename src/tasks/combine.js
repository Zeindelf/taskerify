var gulp   = require('gulp');
var Taskerify = require('./../index');

var $ = Taskerify.Plugins;
var config = Taskerify.config;

Taskerify.extend('combine', function(src, output, baseDir) {
    var paths = prepGulpPaths(src, baseDir, output);

    new Taskerify.Task('combine', function() {
        this.log(paths.src, paths.output);

        return (
            gulp
            .src(paths.src.path)
            .pipe($.concat(paths.output.name))
            .pipe(gulp.dest(paths.output.baseDir))
        );
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});

var prepGulpPaths = function(src, baseDir, output) {
    return new Taskerify.GulpPaths()
        .src(src, baseDir || '')
        .output(output);
};
