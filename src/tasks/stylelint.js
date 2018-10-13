
var path = require('path');
var gulp   = require('gulp');
var gutil = require('gulp-util');
var stylelint = require('gulp-stylelint');
var extend = require('extend');
var Taskerify = require('./../index');

var notify = new Taskerify.Notification();
var config = Taskerify.config;

Taskerify.extend('stylelint', function(src, options) {
    options = extend({
        failAfterError: true,
        reporters: [
            {
                formatter: 'string',
                console: true
            }
        ]
    }, options);

    var paths = new Taskerify.GulpPaths()
        .src(src || [
            path.normalize(config.get('src.css.sass.folder') + '/**/*.scss'),
        ]);

    var onError = function(err) {
        notify.error(err, 'StyleLint Failed');
        this.emit('end');
    };

    new Taskerify.Task('stylelint', function() {
        this.log(paths.src);

        return gulp.src(paths.src.path)
            .pipe(stylelint(options))
            .on('error', onError)
            .pipe(gutil.buffer())
    }).watch(paths.src.path);
});
