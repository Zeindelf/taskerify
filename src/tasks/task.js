var gulp = require('gulp');
var Taskerify = require('./../index');

Taskerify.extend('task', function(name, watcher) {
    var task = new Taskerify.Task('task', function() {
        return gulp.start(name);
    });

    if (watcher) {
        task.watch(watcher);
    }
});
