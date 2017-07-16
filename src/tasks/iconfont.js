var gulp         = require('gulp');
var iconFont     = require('gulp-iconfont');
var rename       = require("gulp-rename");
var appRoot      = require('app-root-path');
var consolidate  = require('gulp-consolidate');
var runTimestamp = Math.round(Date.now()/1000);
var _            = require('underscore');
var Taskerify    = require('./../index');

var $      = Taskerify.Plugins;
var Task   = Taskerify.Task;
var config = Taskerify.config;

Taskerify.extend('iconfont', function (options) {

    var customExtension = false;
    var defaultOptions = {
        // Plugin options
        formats            : ['eot', 'ttf', 'woff', 'woff2', 'svg'],
        appendCodepoints   : true,
        prependUnicode     : false,
        normalize          : true,
        fontHeight         : 1001,
        centerHorizontally : true,
        // Fonts / CSS options
        iconsPath       : config.srcPath + '/icons/',
        sassPath        : config.srcPath + '/' + config.css.sass.folder + '/',
        fontPath        : config.distPath + '/fonts/',
        outputFontPath  : config.distPath + '/fonts/',
        className       : 'iconfont',
        iconFontName    : 'iconfont',
        template        : __dirname + '/iconfont/_icons.scss',
        sassFileName    : null,
        customExtension : false,
        hash            : Math.random().toString(36).substring(6),
    };

    options = _.extend(defaultOptions, options);
    options.sassFileName = options.sassFileName ? options.sassFileName : '_' + options.iconFontName;

    if ( options.customExtension ) {
        customExtension = true;
    }

    new Task('iconfont', function () {
        return gulp.src(options.iconsPath + '*.svg')
            .pipe(iconFont({
                fontName           : options.iconFontName,
                formats            : options.formats,
                appendCodepoints   : options.appendCodepoints,
                prependUnicode     : options.prependUnicode,
                timestamp          : runTimestamp,
                normalize          : options.normalize,
                fontHeight         : options.fontHeight,
                centerHorizontally : options.centerHorizontally,
            }))
            .on('glyphs', function (glyphs, opts) {
                // SCSS templating
                gulp.src(options.template)
                    .pipe(consolidate('underscore', {
                        glyphs : glyphs.map( function (glyph) {
                            return {
                                name: glyph.name,
                                codepoint: glyph.unicode[0].charCodeAt(0)
                            };
                        }),
                        fontName        : options.iconFontName,
                        fontPath        : options.fontPath,
                        className       : options.className,
                        customExtension : options.customExtension || '',
                    }))
                    .pipe(rename(function (path) {
                        path.basename = options.sassFileName;
                    }))
                    .pipe(gulp.dest(options.sassPath))
                    .pipe(new Taskerify.Notification('SCSS Font File Complete!'));
            })
            .pipe($.if( customExtension, rename(function (path) {
                path.extname += options.customExtension;
            }) ))
            .pipe(gulp.dest(options.outputFontPath))
            .pipe(new Taskerify.Notification('Iconfont Complete!'));

    })
    .watch(options.iconsPath + '*.svg');
});
