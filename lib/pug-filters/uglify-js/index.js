const transformer = require('jstransformer');
const uglifyJs = transformer(require('jstransformer-uglify-js'));

/** https://github.com/mishoo/UglifyJS2#compress-options */
module.exports = (str, opts = {}) => {
  const uglifyOpts = {
    ...opts,
  };

  return uglifyJs.render(str, uglifyOpts).body;
};
