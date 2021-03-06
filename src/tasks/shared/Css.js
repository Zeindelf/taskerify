var gulp   = require('gulp');
var changed = require('gulp-changed');
var Taskerify = require('../../index');

var $ = Taskerify.Plugins;
var config = Taskerify.config;

module.exports = function(options) {
    var name = options.name;

    options.task.log(options.src, options.output);

    return (
        gulp
        .src(options.src.path)
        .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
        .pipe(options.compiler(options.pluginOptions))
        .on('error', function(e) {
            new Taskerify.Notification().error(e, name + ' Compilation Failed');

            this.emit('end');
        })
        .pipe($.if(config.css.autoprefix.enabled, $.autoprefixer(config.css.autoprefix.options)))
        .pipe($.concat(options.output.name))
        .pipe($.if(config.production, $.cssnano(config.css.cssnano.pluginOptions)))
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest(options.output.baseDir))
        .pipe(new Taskerify.Notification(name + ' Compiled!'))
    );
};
