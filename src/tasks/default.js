var gulp = require('gulp');
var _ = require('underscore');
var Taskerify = require('./../index');
var inSequence = require('run-sequence');

gulp.task('default', function() {
    inSequence.apply(this, _.pluck(Taskerify.tasks, 'name'));
});
