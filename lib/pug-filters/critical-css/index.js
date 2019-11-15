const transformer = require('jstransformer');
const scss = transformer(require('./jstransformer-scss'));

module.exports = (file, opts = {}) => {
  const scssOpts = {
    ...opts,
  };

  return scss.renderFile(file, scssOpts).body;
};
