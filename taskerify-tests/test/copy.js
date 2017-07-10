
var fs        = require('fs');
var gulp      = require('gulp');
var remove    = require('rimraf');
var should    = require('chai').should();
var Taskerify = require('./../../src/index');

var COPY_PATH = './taskerify-tests/copy/';

describe('Copy Task', function () {

    beforeEach( function () {
        Taskerify.tasks = Taskerify.config.tasks = [];
    });

    it('copia um arquivo para um novo diretório', function (done) {
        Taskerify( function (mix) {
            return mix.copy(COPY_PATH + 'foo/foo.txt', 'copy-dest')
        });

        runGulp( function () {
            shouldExist('copy-dest/foo.txt');

            done();
        });
    });

    it('copia e renomeia um arquivo para um novo diretório', function (done) {
        Taskerify( function (mix) {
            return mix.copy(COPY_PATH + 'foo/foo.txt', 'copy-dest/changed.txt')
        });

        runGulp( function () {
            shouldExist('copy-dest/changed.txt');

            done();
        });
    });

    it('copia um array de arquivos passados para um novo diretório', function (done) {
        Taskerify( function (mix) {
            return mix.copy([COPY_PATH + 'foo', COPY_PATH + 'bar'], 'copy-dest')
        });

        runGulp( function () {
            shouldExist('copy-dest/foo.txt');
            shouldExist('copy-dest/bar.txt');

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
        remove.sync('./copy-dest');
    });
};
