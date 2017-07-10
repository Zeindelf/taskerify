
var fs        = require('fs');
var gulp      = require('gulp');
var remove    = require('rimraf');
var should    = require('chai').should();
var Taskerify = require('./../../src/index');

var JS_PATH = './taskerify-tests/src/assets/js/';


describe('Combine Task', function () {

    beforeEach( function () {
        Taskerify.tasks = Taskerify.config.tasks = [];
    });

    it('combina um array de arquivos passado', function (done) {
        Taskerify( function (mix) {
            return mix.combine([
                JS_PATH + 'lib1.js',
                JS_PATH + 'lib2.js'
            ], './dist/js/combined.js')
        });

        runGulp( function () {
            shouldExist('./dist/js/combined.js');

            fs.readFileSync('./dist/js/combined.js', { encoding: 'utf8' })
                .should.equal(
`var somelib;
var anotherlib;`, { encoding: 'utf8' });

            done();
        });
    });

    it('habilita um diretório base opicional', function (done) {
        Taskerify( function (mix) {
            return mix.combine([
                JS_PATH + 'lib1.js',
                JS_PATH + 'lib2.js'
            ], './dist/js/combined.js', 'src/assets')
        });

        runGulp( function () {
            shouldExist('./dist/js/combined.js');

            fs.readFileSync('./dist/js/combined.js', { encoding: 'utf8' })
                .should.equal(
`var somelib;
var anotherlib;`, { encoding: 'utf8' });

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
        remove.sync('./dist');
    });
};
