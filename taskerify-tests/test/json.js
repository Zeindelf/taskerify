var fs = require('fs');
var gulp = require('gulp');
var remove = require('rimraf');
var should = require('chai').should();
var Taskerify = require('./../../src/index');

var JSON_PATH = './taskerify-tests/src/json';
var JSON_DIST = './dist/json';

describe('JSON Include Task', function() {
  beforeEach(function() {
    Taskerify.tasks = Taskerify.config.tasks = [];
  });

  it('faz inclusao dos arquivos .json | mantem nome original', function(done) {
    Taskerify(function(mix) {
      return mix.partialifyJson(JSON_PATH + '/index.json');
    });

    runGulp(function() {
      shouldExist('./dist/assets/json/index.json');

      done();
    });
  });

  it('faz inclusao dos arquivos .json | compara output padrão', function(done) {
    Taskerify(function(mix) {
      return mix.partialifyJson(JSON_PATH + '/index.json');
    });

    runGulp(function() {
      shouldExist('./dist/assets/json/index.json');

      fs.readFileSync('./dist/assets/json/index.json', { encoding: 'utf8' })
        .should.equal(
`{
  "json1": {
    "prop": "Foo"
  },
  "json2": {
    "prop": "Bar"
  },
  "json3": {
    "json4": {
      "prop": "Foo"
    }
  }
}`);

        done();
      });
    });

  it('faz inclusao dos arquivos .json | renomeia o original', function(done) {
    Taskerify(function(mix) {
      return mix.partialifyJson(JSON_PATH + '/index.json', JSON_DIST + '/renamed-json.json');
    });

    runGulp(function() {
      shouldExist('./dist/json/renamed-json.json');

      done();
    });
  });

  it('faz inclusao dos arquivos .json | custom dist dir', function(done) {
    Taskerify(function(mix) {
      return mix.partialifyJson(JSON_PATH + '/index.json', './dist/custom-dir/index.json');
    });

    runGulp(function() {
      shouldExist('./dist/custom-dir/index.json');

      done();
    });
  });

//   it('faz inclusao dos arquivos .json | Indentacao de 4 espacos', function(done) {
//     Taskerify(function(mix) {
//       return mix.partialifyJson(JSON_PATH + '/index.json', null, { indent: 4 });
//     });

//     runGulp(function() {
//       shouldExist('./dist/assets/json/index.json');

//       fs.readFileSync('./dist/assets/json/index.json', { encoding: 'utf8' })
//         .should.equal(`
// {
//     "json1": {
//         "prop": "Foo"
//     },
//     "json2": {
//         "prop": "Bar"
//     },
//     "json3": {
//         "json4": {
//             "prop": "Foo"
//         }
//     }
// }
// `);

//       done();
//     });
//   });

//   it('faz inclusao dos arquivos .json | custom prefix include', function(done) {
//     Taskerify(function(mix) {
//       return mix.partialifyJson('./taskerify-tests/src/json-custom/index.json', JSON_DIST + '/json-custom-prefix-include.json', { prefix: '__', indent: 1 });
//     });

//     runGulp(function() {
//       shouldExist('./dist/json/json-custom-prefix-include.json');

//       fs.readFileSync('./dist/json/json-custom-prefix-include.json', { encoding: 'utf8' })
//         .should.equal(`
// {
//  "json1": {
//   "prop": "Foo"
//  }
// }
// `);

//       done();
//     });
//   });
});

var shouldExist = function(file) {
  return fs.existsSync(file).should.be.true;
};

var runGulp = function(assertions) {
  gulp.start('default', function() {
    assertions();
    // remove.sync('./dist');
  });
};
