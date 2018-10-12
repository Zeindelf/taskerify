
var path = require('path');
var gulp   = require('gulp');
var eslint = require('gulp-eslint');
var Taskerify = require('./../index');

var notify = new Taskerify.Notification();
var config = Taskerify.config;

Taskerify.extend('eslint', function(src, options) {
    var paths = new Taskerify.GulpPaths()
        .src(src || [
            path.normalize(config.get('src.js.folder') + '/**/*.js'),
        ]);

    var onError = function (err) {
        notify.error(err, 'ESLint Failed');
        this.emit('end');
    };

    new Taskerify.Task('eslint', function() {
        this.log(paths.src);

        return gulp.src(paths.src.path)
            .pipe(eslint(options || {}))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
            .on('error', onError);
    }).watch(paths.src.path);
});
