var gulp    = require('gulp');
var compile = require('./shared/Css');
var Taskerify = require('./../index');

var config = Taskerify.config;

var gulpTask = function(src, output, options) {
    var paths = prepGulpPaths(src, output);

    new Taskerify.Task('sass', function() {
        return compile({
            name: 'Sass',
            compiler: require('gulp-sass'),
            src: paths.src,
            output: paths.output,
            task: this,
            pluginOptions: options || config.css.sass.pluginOptions
        });
    })
    .watch(paths.src.baseDir + '/**/*.+(sass|scss)')
    .ignore(paths.output.path);
};

Taskerify.extend('sass', function() {
    gulpTask.apply(this, arguments);
});

Taskerify.extend('rubySass', function() {
    gulpTask.apply(this, arguments);
});

var prepGulpPaths = function(src, output) {
    return new Taskerify.GulpPaths()
        .src(src, config.get('src.css.sass.folder'))
        .output(output || config.get('dist.css.outputFolder'), 'app.css');
};
