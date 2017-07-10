
const path   = require('path').normalize;
const notify = require('gulp-notify');

const Notification = function() {
    this.title = 'Taskerify';

    if (arguments.length) {
        return this.message(arguments[0]);
    }
};

var n = Notification.prototype;

n.message = function(message) {
    return notify({
        title: this.title,
        subtitle: message,
        message: "Generate file: <%= file.relative %>",
        icon: path(__dirname + '/../icons/success.png'),
        onLast: true
    });
};

n.error = function(e, message) {
    notify.onError({
        title: this.title,
        message: message + ': <%= error.message %>',
        icon: path(__dirname + '/../icons/error.png'),
        onLast: true
    })(e);

    console.log(e);
};

n.forPassedTests = function(framework) {
    return notify({
        title: 'Green!',
        message: 'Your ' + framework + ' tests passed!',
        icon: path(__dirname + '/../icons/success.png'),
        onLast: true
    });
};

n.forFailedTests = function(e, framework) {
    return notify.onError({
        title: 'Red!',
        message: 'Your ' + framework + ' tests failed!',
        icon: path(__dirname + '/../icons/error.png'),
        onLast: true
    })(e);
};

module.exports = Notification;
