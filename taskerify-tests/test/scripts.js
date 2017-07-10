
var fs        = require('fs');
var gulp      = require('gulp');
var remove    = require('rimraf');
var should    = require('chai').should();
var Taskerify = require('./../../src/index');

var JS_PATH = './taskerify-tests/src/assets/js/';

describe('Scripts Task', function () {

    beforeEach( function () {
        Taskerify.tasks = Taskerify.config.tasks = [];
    });

    it('concatena scripts', function (done) {
        Taskerify( function (mix) {
            return mix.scripts([JS_PATH + 'lib1.js', JS_PATH + 'lib2.js'])
        });

        runGulp( function () {
            shouldExist('./dist/assets/js/all.js');

            done();
        });
    });

    it('concatena scripts, renomeia e salva em um diretório customizado', function (done) {
        Taskerify( function (mix) {
            return mix.scripts([JS_PATH + 'lib1.js', JS_PATH + 'lib2.js'], './dist/assets/js/merged.js')
        });

        runGulp( function () {
            shouldExist('./dist/assets/js/merged.js');

            done();
        });
    });

    it('customiza um diretório base', function (done) {
        Taskerify( function (mix) {
            mix.copy('./src/assets/js', './src/assets/scripts');

            mix.scripts([JS_PATH + 'lib1.js', JS_PATH + 'lib2.js'], null, './src/assets/scripts');
        });

        runGulp( function () {
            shouldExist('./dist/assets/js/all.js');

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

        remove.sync('./dist/assets/js');
        remove.sync('./src/assets/scripts');
    });
};
