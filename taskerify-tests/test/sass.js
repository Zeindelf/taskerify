
var fs        = require('fs');
var gulp      = require('gulp');
var remove    = require('rimraf');
var should    = require('chai').should();
var Taskerify = require('./../../src/index');

var SCSS_PATH = './taskerify-tests/src/assets/scss/';

describe('Sass Task', function () {

    beforeEach(function () {
        Taskerify.tasks = Taskerify.config.tasks = [];
    });

    it('compila arquivos SCSS para o diretório ./dist/assets/css', function (done) {
        Taskerify( function (mix) {
            return mix.sass(SCSS_PATH + 'app.scss')
        });

        runGulp( function () {
            shouldExist('./dist/assets/css/app.css');

            done();
        });
    });

    it('cria um arquivo sourcemaps para SCSSs compilados', function (done) {
        Taskerify( function (mix) {
            return mix.sass(SCSS_PATH + 'app.scss')
        });

        runGulp( function () {
            shouldExist('./dist/assets/css/app.css.map');

            done();
        });
    });

    it('compila para o nome do arquivo original se for passado um arquivo único', function (done) {
        Taskerify( function (mix) {
            return mix.sass(SCSS_PATH + 'another.scss')
        });

        runGulp( function () {
            shouldExist('./dist/assets/css/another.css');

            done();
        });
    });

    it('compila para um diretório customizado e renomeia o arquivo', function (done) {
        Taskerify( function (mix) {
            return mix.sass([SCSS_PATH + 'app.scss', SCSS_PATH + 'another.scss'], './dist/assets/styles/done.css')
        });

        runGulp( function () {
            shouldExist('./dist/assets/styles/done.css');

            done();
        });
    });
});

var shouldExist = function (file) {
    return fs.existsSync(file).should.be.true;
};

var runGulp = function (assertions) {
    gulp.start('default', function () {
        assertions();

        remove.sync('./dist/assets/css');
        remove.sync('./dist/assets/styles');
    });
};
