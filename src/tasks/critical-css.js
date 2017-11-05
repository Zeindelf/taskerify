
const gulp      = require('gulp');
const rename    = require('gulp-rename');
const concat    = require('gulp-concat-util');
const Taskerify = require('./../index');

const config = Taskerify.config;

Taskerify.extend('criticalCss', (src, output, file) => {
    const fileName = file.substr(0, file.lastIndexOf('.'));
    const fileExt = file.substr(file.lastIndexOf('.') + 1, file.length);

    new Taskerify.Task('critical-css', () => {
        return gulp.src(src)
            .pipe(concat.header('<style>'))
            .pipe(concat.footer('</style>'))
            .pipe(rename({
                basename: fileName,
                extname: `.${fileExt}`,
            }))
            .pipe(gulp.dest(output));
    }).watch(src);
});
