var gulp = require('gulp');
var Taskerify = require('./../index');

var $ = Taskerify.Plugins;

Taskerify.extend('copy', function(src, output) {
    var paths = new Taskerify.GulpPaths().src(src).output(output);

    new Taskerify.Task('copy', function() {
        this.log(paths.src, paths.output);

        return (
            gulp
            .src(paths.src.path)
            .pipe($.if(! paths.output.isDir, $.rename(paths.output.name)))
            .pipe(gulp.dest(paths.output.baseDir))
        );
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});
