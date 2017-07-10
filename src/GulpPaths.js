var p = require('path');
var gutils = require('gulp-util');
var parsePath = require('parse-filepath');

var GulpPaths = function() {};

GulpPaths.prototype.src = function(src, prefix) {
    var self = this;

    src = this.prefix(src, prefix);

    if (Array.isArray(src)) {
        src = src.map(function(path) {
            if (self.parse(path).isDir) {
                path += '/**/*';
            }

            return path;
        });

        this.src = { path: src, baseDir: prefix };
    } else {
        this.src = this.parse(src);
        this.src.isDir && (this.src.path += '/**/*');
    }

    return this;
};

GulpPaths.prototype.output = function(output, defaultName) {
    this.output = this.parse(output);

    if ( ! this.output.name && defaultName) {
        if ( ! Array.isArray(this.src.path) && this.src.name.indexOf('*') == -1) {
            defaultName = this.changeExtension(
                this.src.name,
                this.parse(defaultName).extension
            );
        }

        this.output = this.parse(p.join(output, defaultName));
    }

    return this;
};

GulpPaths.prototype.changeExtension = function(path, newExtension) {
    return gutils.replaceExtension(path, newExtension);
};

GulpPaths.prototype.prefix = function(path, prefix) {
    if ( ! prefix) return path;

    var prefixOne = function(path) {
        if (path.indexOf('./') == 0) {
            return path;
        }

        if (path.indexOf('!') == 0) {
            path = '!' + p.join(prefix, path.substring(1));
        } else {
            path = p.join(prefix, path);
        }

        return path.replace(/\/\//g, '/')
            .replace(/\/\//g, '/')
            .replace(p.join(prefix, prefix), prefix);
    };

    if (Array.isArray(path)) {
        return path.map(prefixOne);
    }

    return prefixOne(path);
};

GulpPaths.prototype.parse = function(path) {
    var segments = parsePath(path);

    return {
        path      : path,
        name      : segments.extname ? segments.basename : '',
        extension : segments.extname,
        isDir     : ! (!! segments.extname),
        baseDir   : segments.extname
                        ? segments.dirname
                        : p.join(segments.dirname, segments.basename)
    };
};

module.exports = GulpPaths;
