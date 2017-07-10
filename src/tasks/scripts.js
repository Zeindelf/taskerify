var gulp = require('gulp');
var Taskerify = require('./../index');

var $ = Taskerify.Plugins;
var config = Taskerify.config;

Taskerify.extend('scripts', function(scripts, output, baseDir) {
    var paths = prepGulpPaths(scripts, baseDir, output);

    new Taskerify.Task('scripts', function() {
        return gulpTask.call(this, paths);
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});

Taskerify.extend('scriptsIn', function(baseDir, output) {
    var paths = prepGulpPaths('**/*.js', baseDir, output);

    new Taskerify.Task('scriptsIn', function() {
        return gulpTask.call(this, paths);
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});

Taskerify.extend('babel', function(scripts, output, baseDir, options) {
    var paths = prepGulpPaths(scripts, baseDir, output);

    new Taskerify.Task('babel', function() {
        var babelOptions = options || config.js.babel.options;

        return gulpTask.call(this, paths, babelOptions);
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});

var gulpTask = function(paths, babel) {
    this.log(paths.src, paths.output);

    return (
        gulp
        .src(paths.src.path)
        .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
        .pipe($.concat(paths.output.name))
        .pipe($.if(babel, $.babel(babel)))
        .on('error', function(e) {
            new Taskerify.Notification().error(e, 'Babel Compilation Failed!');
            this.emit('end');
        })
        .pipe($.if(config.production, $.uglify(config.js.uglify.options)))
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest(paths.output.baseDir))
        .pipe(new Taskerify.Notification('Scripts Merged!'))
    );
};

var prepGulpPaths = function(src, baseDir, output) {
    return new Taskerify.GulpPaths()
        .src(src, baseDir || config.get('src.js.folder'))
        .output(output || config.get('dist.js.outputFolder'), 'all.js');
};
