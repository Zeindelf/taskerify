var gulp = require('gulp');
var _ = require('underscore');
var batch = require('gulp-batch');
var Taskerify = require('./../index');

gulp.task('watch', function() {
    var tasks = _.sortBy(Taskerify.tasks, 'name');
    var mergedTasks = {};

    if (isWatchingBrowserify(tasks)) {
        Taskerify.config.js.browserify.watchify.enabled = true;

        gulp.start('browserify');
    }

    tasks.forEach(function(task) {
        if (task.name in mergedTasks) {
            return mergedTasks[task.name].watchers = _.union(mergedTasks[task.name].watchers, task.watchers);
        }

        mergedTasks[task.name] = {
            name: task.name,
            watchers: Array.isArray(task.watchers) ? task.watchers : [task.watchers]
        };
    });

    _.sortBy(mergedTasks, 'name').forEach(function(task) {
        if (task.watchers.length > 0) {
            gulp.watch(task.watchers, batch(Taskerify.config.batchOptions, function(events) {
                events.on('end', gulp.start(task.name));
            }));
        }
    });
});

var isWatchingBrowserify = function(tasks) {
    return _.contains(_.pluck(tasks, 'name'), 'browserify');
};
