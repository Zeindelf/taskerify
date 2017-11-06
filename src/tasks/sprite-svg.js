var gulp      = require('gulp');
var svgSprite = require('gulp-svg-sprite');
var Taskerify    = require('./../index');

var config    = Taskerify.config;

Taskerify.extend('spriteSvg', function(src, output, options) {
    new Taskerify.Task('sprite-svg', function() {
        var paths = new Taskerify.GulpPaths()
            .src('**/*.svg', src || config.get('src.svgSprite.folder'))
            .output(output || config.get('dist.svgSprite.outputFolder'));

        this.log(paths.src, paths.output);

        var errorHandler = function(e) {
            new Taskerify.Notification().error(e, 'SVG Sprite failed');
            this.emit('end');
        };

        return gulp.src(paths.src.path)
            .pipe(svgSprite(options || config.svgSprite.pluginOptions))
            .on('error', errorHandler)
            .pipe(gulp.dest(paths.output.path))
            .pipe(new Taskerify.Notification('SVG Sprite generated'))
    })
    .watch(config.get('src.svgSprite.folder') + '/**/*.svg');
});
