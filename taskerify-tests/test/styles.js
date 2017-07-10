
var fs        = require('fs');
var gulp      = require('gulp');
var remove    = require('rimraf');
var should    = require('chai').should();
var Taskerify = require('./../../src/index');

var CSS_PATH = './taskerify-tests/src/assets/css/';

describe('Styles Task', function () {

    beforeEach( function () {
        Taskerify.tasks = Taskerify.config.tasks = [];
    });

    it('concatena CSSs', function (done) {
        Taskerify( function (mix) {
            return mix.styles([CSS_PATH + 'one.css', CSS_PATH + 'two.css'])
        });

        runGulp( function () {
            shouldExist('./dist/assets/css/all.css');

            done();
        });
    });

    it('concatena CSSs, renomeia e salva em um diretório customizado', function (done) {
        Taskerify( function (mix) {
            return mix.styles([CSS_PATH + 'one.css', CSS_PATH + 'two.css'], './dist/assets/css/merged.css')
        });

        runGulp( function () {
            shouldExist('./dist/assets/css/merged.css');

            done();
        });
    });

    it('customiza um diretório base', function (done) {
        Taskerify( function (mix) {
            mix.copy('./src/assets/css', './src/assets/styles');

            mix.styles([CSS_PATH + 'one.css', CSS_PATH + 'two.css'], null, './src/assets/styles');
        });

        runGulp( function () {
            shouldExist('./dist/assets/css/all.css');

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
        remove.sync('./src/assets/styles');
    });
};
