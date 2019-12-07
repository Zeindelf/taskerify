const transformer = require('jstransformer');
const uglify = transformer(require('./jstransformer-uglify'));

module.exports = (src, opts = {}) => {
  const options = Object.assign({}, opts);

  if (typeof src === 'string') {
    return uglify.renderFile(src, options).body;
  }

  const content = src.map((file) => uglify.renderFile(file, options).body);
  return content.join('');
};
