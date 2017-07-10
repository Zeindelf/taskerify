var fs = require('fs');
var gulp = require('gulp');
var _ = require('underscore');
var gutils = require('gulp-util');

var Taskerify = function(recipe) {
    require('require-dir')('./tasks');
    recipe(Taskerify.mixins);
    createGulpTasks.call(Taskerify);
};

Taskerify.mixins       = {};
Taskerify.Log          = require('./Logger');
Taskerify.Notification = require('./Notification');
Taskerify.GulpPaths    = require('./GulpPaths');
Taskerify.config       = require('./Config');
Taskerify.Task         = require('./Task')(Taskerify);
Taskerify.tasks        = Taskerify.config.tasks;
Taskerify.Plugins      = require('gulp-load-plugins')();

Taskerify.extend = function(name, callback) {
    Taskerify.mixins[name] = function() {
        callback.apply(this, arguments);

        return this.mixins;
    }.bind(this);
};

Taskerify.setDefaultsFrom = function(file) {
    var overrides;

    if (fs.existsSync(file)) {
        overrides = JSON.parse(fs.readFileSync(file, 'utf8'));

        _.mixin({
            deepExtend: require('underscore-deep-extend')(_)
        });

        _.deepExtend(Taskerify.config, overrides);
    }
}('taskerify.json');

var createGulpTasks = function() {
    var tasks = this.tasks;

    tasks.forEach(function(task) {
        if (_.contains(gulp.tasks, task.name)) return;

        gulp.task(task.name, function() {
            if (_.intersection(gutils.env._, [task.name, 'watch', 'tdd']).length) {
                return _.where(tasks, { name: task.name })
                    .forEach(function(task) {
                        task.run();
                    });
            }

            var gulp = Taskerify.Task.find(task.name).run();

            Taskerify.config.activeTasks[task.name]++;

            return gulp;
        });
    });
};

module.exports = Taskerify;
