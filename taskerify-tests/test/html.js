
var fs        = require('fs');
var gulp      = require('gulp');
var remove    = require('rimraf');
var should    = require('chai').should();
var Taskerify = require('./../../src/index');

var VIEWS_PATH = './taskerify-tests/views';
var HTML_DIST = './dist/html';

describe('HTML Include Task', function () {

    beforeEach( function () {
        Taskerify.tasks = Taskerify.config.tasks = [];
    });

    it('faz inclusao dos arquivos .html | mantem nome original', function (done) {
        Taskerify( function (mix) {
            return mix.partialifyHtml(VIEWS_PATH + '/index.html');
        });

        runGulp( function () {
            shouldExist(HTML_DIST + '/index.html');

            done();
        });
    });

    it('faz inclusao dos arquivos .html | compara output padrão', function (done) {
        Taskerify( function (mix) {
            return mix.partialifyHtml(VIEWS_PATH + '/index.html');
        });

        runGulp( function () {
            shouldExist(HTML_DIST + '/index.html');

            fs.readFileSync(HTML_DIST + '/index.html', { encoding: 'utf8' })
                .should.equal(
`<!DOCTYPE html>
<html lang="pt-br">

<head>

  <meta charset="UTF-8">
  <title>Test</title>


  <link rel="stylesheet" href="foo/bar/main.css">


</head>

<body>

  <header>
    <h1>Taskerify Tests</h1>
    <p>Running unit tests</p>
  </header>


  <main>
    <p>Main content</p>
  </main>


  <footer>
    <p>Copy &copy; 2017</p>
  </footer>


  <script src="foo/bar/main.js"></script>

</body>

</html>
`);

            done();
        });
    });

    it('faz inclusao dos arquivos .html | renomeia o original', function (done) {
        Taskerify( function (mix) {
            return mix.partialifyHtml(VIEWS_PATH + '/index.html', HTML_DIST + '/renamed-html.html');
        });

        runGulp( function () {
            shouldExist('./dist/html/renamed-html.html');

            done();
        });
    });

    it('faz inclusao dos arquivos .html | custom dist dir', function (done) {
        Taskerify( function (mix) {
            return mix.partialifyHtml(VIEWS_PATH + '/index.html', './dist/custom-dir/index.html');
        });

        runGulp( function () {
            shouldExist('./dist/custom-dir/index.html');

            done();
        });
    });

    it('faz inclusao dos arquivos .html | Indentacao de 4 espacos', function (done) {
        Taskerify( function (mix) {
            return mix.partialifyHtml(VIEWS_PATH + '/index.html', null, { indent: 4 });
        });

        runGulp( function () {
            shouldExist(HTML_DIST + '/index.html');

            fs.readFileSync(HTML_DIST + '/index.html', { encoding: 'utf8' })
                .should.equal(
`<!DOCTYPE html>
<html lang="pt-br">

<head>

    <meta charset="UTF-8">
    <title>Test</title>


    <link rel="stylesheet" href="foo/bar/main.css">


</head>

<body>

    <header>
        <h1>Taskerify Tests</h1>
        <p>Running unit tests</p>
    </header>


    <main>
        <p>Main content</p>
    </main>


    <footer>
        <p>Copy &copy; 2017</p>
    </footer>


    <script src="foo/bar/main.js"></script>

</body>

</html>
`);

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
