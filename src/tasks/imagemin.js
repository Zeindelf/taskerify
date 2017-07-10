var gulp       = require('gulp');
var changed    = require('gulp-changed');
var imagemin   = require('gulp-imagemin');
var pngquant   = require('imagemin-pngquant');
var recompress = require('imagemin-jpeg-recompress');
var _          = require('underscore');
var Taskerify  = require('./../index');
var config     = Taskerify.config;

Taskerify.extend('imagemin', function(src, output, options) {

    options = _.extend([
        imagemin.gifsicle({ interlaced: true }),
        recompress({
            progressive: true,
            max: config.images.maxCompress,
            min: config.images.minCompress
        }),
        pngquant({ quality: config.images.quality }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: config.images.optimizationLevel }),
        imagemin.svgo({ plugins: [{ removeViewBox: false }]})
    ], {
        verbose: true
    }, options);

    new Taskerify.Task('imagemin', function () {
        var paths = new Taskerify.GulpPaths()
            .src(src || config.get('src.images.folder'))
            .output(output || config.get('dist.images.outputFolder'));

        return gulp.src(paths.src.path)
            .pipe(changed(paths.output.path))
            .pipe(imagemin(options))
            .on('error', function(e) {
                new Taskerify.Notification().error(e, 'ImageMin Failed!');
                this.emit('end');
            })
            .pipe(gulp.dest(paths.output.path))
            .pipe(new Taskerify.Notification('ImageMin Complete!'))
    }).watch(
        [
            config.get('src.images.folder') + '/**/*.jpg',
            config.get('src.images.folder') + '/**/*.jpeg',
            config.get('src.images.folder') + '/**/*.svg',
            config.get('src.images.folder') + '/**/*.gif',
            config.get('src.images.folder') + '/**/*.png'
        ]
    );
});
