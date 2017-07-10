var _ = require('underscore');

var id = 0, Taskerify;

var Task = function(name, description) {
    this.id = id++;
    this.name = name;
    this.watchers = [];

    if (description) {
        this.describe(description);
    }
};

Task.find = function(name) {
    var tasks = _.where(Taskerify.tasks, { name: name });

    return tasks[Taskerify.config.activeTasks[name]];
};

Task.prototype.describe = function(definition) {
    this.definition = definition;

    this.register();

    return this;
};

Task.prototype.register = function() {
    Taskerify.tasks.push(this);

    Taskerify.config.activeTasks = Taskerify.config.activeTasks || {};
    Taskerify.config.activeTasks[this.name] = 0;

    return this;
};

Task.prototype.watch = function(regex, category) {
    if (regex) {
        this.watchers.push(regex);
    }

    this.category = category || 'default';

    return this;
};

Task.prototype.ignore = function(path) {
    this.watchers.push(('!./' + path).replace('././', './'));

    return this;
};

Task.prototype.run = function() {
    return this.definition();
};

Task.prototype.log = function(src, output) {
    var task = this.name.substr(0,1).toUpperCase() + this.name.substr(1);

    Taskerify.Log
       .heading("Fetching " + task + " Source Files...")
       .files(src.path ? src.path : src, true);

    if (output) {
        Taskerify.Log
            .heading('Saving To...')
            .files(output.path ? output.path : output);
    }
};

module.exports = function(taskerify) {
    Taskerify = taskerify;

    return Task;
};
