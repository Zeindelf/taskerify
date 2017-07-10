
var n         = require('path').normalize;
var expect    = require('chai').expect;
var GulpPaths = require('./../../src/index').GulpPaths;

describe('Gulp Paths', function () {
    var paths;

    beforeEach( function () {
        return paths = new GulpPaths()
    });

    it('fetches all files, if a directory is provided for the source', function () {
        paths = paths.src('some/src');

        expect(paths.src.path).to.equal('some/src/**/*');
    });

    it('fetches all files, if an item in array is a directory', function () {
        paths = paths.src(['some/file.txt', 'some/src']);

        expect(paths.src.path).to.eql(['some/file.txt', 'some/src/**/*']);
    });

    it('uses the src file name as the output name, if an output file is not set', function () {
        paths.src('src.scss').output('some/output', 'output.css');

        expect(paths.output.path).to.equal(n('some/output/src.css'));
    });

    it('uses a default output name if no alternative is available', function () {
        paths.src(['file.scss']).output('some/output', 'output.css');

        expect(paths.output.path).to.equal(n('some/output/output.css'));
    });

    it('prefixes a base directory', function () {
        expect(paths.prefix('some/path', 'some/prefix')).to.equal(n('some/prefix/some/path'));
        expect(paths.prefix([n('one/path'), n('second/path')], n('some/prefix'))).to.eql([n('some/prefix/one/path'), n('some/prefix/second/path')]);
        expect(paths.prefix('./src/custom/file.scss', 'some/prefix')).to.equal('./src/custom/file.scss');
    });

    it('changes an extension', function () {
        expect(paths.changeExtension('some/path/foo.txt', '.png')).to.equal(n('some/path/foo.png'));
    });

    it('parses a file path', function () {
        var parsed = paths.parse('foo/bar/path/file.txt');

        expect(parsed.path).to.equal('foo/bar/path/file.txt');
        expect(parsed.name).to.equal('file.txt');
        expect(parsed.extension).to.equal('.txt');
        expect(parsed.isDir).to.be.false;
        expect(parsed.baseDir).to.equal(n('foo/bar/path'));
    });
});
