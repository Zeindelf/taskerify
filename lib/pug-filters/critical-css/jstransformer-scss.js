const path = require('path');
const sass = require('node-sass');
const extend = require('extend-shallow');
const packageImporter = require('node-sass-package-importer');
const stripCssComments = require('strip-css-comments');
const postcss = require('postcss'); // eslint-disable-line
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import-sync');

exports.name = 'scss';
exports.outputFormat = 'css';

exports.render = (str, options) => {
  const input = extend({}, options, {
    data: str,
    importer: packageImporter(),
  });
  const output = sass.renderSync(input);

  return {
    body: output.css.toString(),
    dependencies: output.stats.includedFiles.map((filename) => path.resolve(filename)),
  };
};

exports.renderFile = (file, options) => {
  const input = extend({}, options, {
    file: path.resolve(file),
    importer: packageImporter(),
  });

  const output = sass.renderSync(input);
  const prefixer = postcss([autoprefixer])
    .use(atImport())
    .process(output.css, { from: path.resolve(file) });
  const stripped = stripCssComments(prefixer.css.toString(), { preserve: /^!!/ });

  return {
    body: stripped,
    dependencies: output.stats.includedFiles
      .map((filename) => path.resolve(filename))
      .filter((name) => name !== file),
  };
};
