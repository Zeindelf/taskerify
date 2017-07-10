var gulp = require('gulp');
var Taskerify = require('./../index');

gulp.task('tdd', function() {
    new Taskerify.Log.message('Watching for tests...');

    Taskerify.tasks
        .filter(function(task) {
            return task.category == 'tdd';
        })
        .forEach(function(task) {
            gulp.watch(task.watchers, [task.name]);
        });
});
