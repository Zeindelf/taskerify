const UglifyJS = require('uglify-js');
const fs = require('fs');
const path = require('path');

exports.name = 'uglify';
exports.inputFormat = ['js'];
exports.outputFormat = 'js';

exports.renderFile = (file, options) => {
  const code = fs.readFileSync(path.resolve(file), 'utf8');
  const result = UglifyJS.minify(code, options);

  return result.code;
};
