var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');

var Logger = function() {};

Logger.heading = function(heading) {
    console.log(''); // line break

    console.log(
        gutil.colors.black(gutil.colors.bgGreen(heading))
    );

    return Logger;
};

Logger.message = function(message) {
    console.log(message);

    return Logger;
};

Logger.files = function(files, checkForFiles) {
    files = Array.isArray(files) ? files : [files];
    var spacer = '   - ';

    files.forEach(function(file) {
        if ( ! checkForFiles || assertFileExists(file)) {
            console.log(spacer + file);
        } else {
            console.log(spacer + gutil.colors.bgRed(file) + ' <-- Not Found');
        }
    });

    console.log(); // For a line break.

    return Logger;
};

var assertFileExists = function(file) {
    if (file.indexOf('!') == 0) {
        file = file.slice(1);
    }

    return file.match(/\*/) || fs.existsSync(file);
};

module.exports = Logger;
