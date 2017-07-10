var fs = require('fs');
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var rev = require('gulp-rev');
var Taskerify = require('./../index');
var vinylPaths = require('vinyl-paths');
var parsePath  = require('parse-filepath');
var distPath  = Taskerify.config.distPath;
var revReplace = require('gulp-rev-replace');

Taskerify.extend('version', function(src, buildPath) {
    var paths = prepGulpPaths(src, buildPath);

    new Taskerify.Task('version', function() {
        var files = vinylPaths();
        var manifest = paths.output.baseDir + '/rev-manifest.json';

        this.log(paths.src, paths.output);

        emptyBuildPathFiles(paths.output.baseDir, manifest);

        var filePathPrefix = paths.output.baseDir.replace(distPath, '') + '/';

        return (
            gulp.src(paths.src.path, { base: './' + distPath })
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(files)
            .pipe(rev())
            .pipe(revReplace({prefix: filePathPrefix}))
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(rev.manifest())
            .pipe(gulp.dest(paths.output.baseDir))
            .on('end', function() {
                del(files.paths, { force: true });

                copyMaps(paths.src.path, paths.output.baseDir);
            })
        );
    })
    .watch(paths.src.path);
});

var prepGulpPaths = function(src, buildPath) {
    src = Array.isArray(src) ? src : [src];

    return new Taskerify.GulpPaths()
        .src(src, Taskerify.config.distPath)
        .output(buildPath || Taskerify.config.get('dist.versioning.buildFolder'));
};

var emptyBuildPathFiles = function(buildPath, manifest) {
    fs.stat(manifest, function(err, stat) {
        if (! err) {
            manifest = JSON.parse(fs.readFileSync(manifest));

            for (var key in manifest) {
                del.sync(buildPath + '/' + manifest[key], { force: true });
            }
        }
    });
};

var copyMaps = function(src, buildPath) {
    src.forEach(function(file) {
        glob(file, {}, function(error, files) {
            if (error) return;

            files
                .filter(function(file) {
                    return fs.existsSync(file + '.map');
                })
                .forEach(function(file) {
                    var map = file.replace(distPath, buildPath);

                    gulp.src(file + '.map').pipe(gulp.dest(parsePath(map).dirname));
                });
        });
    });
};
