
var gulp   = require('gulp');
var del    = require('del');
var Taskerify = require('./../index');

var Task = Taskerify.Task;
var config = Taskerify.config;

Taskerify.extend('clean', function (dirs) {

    dirs = dirs || config.cleanDirs;

    new Task('clean', function (cb) {
        return del(dirs, cb);
    })
    .watch(Taskerify.config.srcPath + '/**');
});
