var gulp = require('gulp');
var _ = require('underscore');
var gutils = require('gulp-util');
var Taskerify = require('./../index');
var browserSync = require('browser-sync').create();

var config = Taskerify.config;

Taskerify.extend('browserSync', function (options) {
    options = _.extend(config.browserSync, {
        files: [
            config.appPath + '/**/*.php',
            config.get('dist.css.outputFolder') + '/**/*.css',
            config.get('dist.js.outputFolder') + '/**/*.js',
            config.get('dist.versioning.buildFolder') + '/rev-manifest.json',
            config.viewPath +'/**/*.php'
        ],
        watchOptions: {
            usePolling: true
        },
        snippetOptions: {
            rule: {
                match: /(<\/body>|<\/pre>)/i,
                fn: function (snippet, match) {
                    return snippet + match;
                }
            }
        }
    }, options);

    if (gutils.env._.indexOf('watch') > -1) {
        browserSync.init(options);
    }

    new Taskerify.Task('browserSync', function () {}).watch();
});
