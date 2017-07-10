var gulp = require('gulp');
var Taskerify = require('../../index');

var notify = new Taskerify.Notification();

module.exports = function(name, src, command) {
    new Taskerify.Task(name, function(error) {
        Taskerify.Log.heading('Triggering ' + name + ': ' + command);

        return (
            gulp
            .src('')
            .pipe(Taskerify.Plugins.shell(command))
            .on('error', function(e) {
                notify.forFailedTests(e, name);

                this.emit('end');
            })
            .pipe(notify.forPassedTests(name))
        );
    })
    .watch(src)
    .watch(Taskerify.config.appPath + '/**/*.php', 'tdd')
    .watch(Taskerify.config.viewPath +'/**/*.php', 'tdd');
};

