var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var _ = require('underscore');
var Taskerify = require('./../index');

var Task = Taskerify.Task;

Taskerify.extend('spriteImg', function(options) {

    options = options || {};
    var spritesmithOptions = options;
    var TaskerifyConfig = this.config;

    var config = {
        src: options.src || TaskerifyConfig.srcPath + '/img/sprites',
        imgOutput: options.imgOutput || 'dist/src/img',
        cssOutput: options.cssOutput || TaskerifyConfig.srcPath + '/scss',

        imgName: options.imgName || 'sprite.png',
        cssName: options.cssName || '_sprite.scss',
        cssFormat: options.cssFormat || 'scss',
        imgPath: options.imgPath || '../img/sprite.png',

        cssVarMap: options.cssVarMap,
        retinaSrcFilter: options.retinaSrcFilter,
        retinaImgName: options.retinaImgName,
        retinaImgPath: options.retinaImgPath
    };

    config = _.extend(config, spritesmithOptions);

    new Task('sprite-img', function() {
        var sprite = gulp.src(config.src + '/**/*.png')
            .pipe(spritesmith(config));

        sprite.img.pipe(gulp.dest(config.imgOutput));
        sprite.css.pipe(gulp.dest(config.cssOutput));

        return sprite;
    })
    .watch(config.src + '/**/*.png');
});
