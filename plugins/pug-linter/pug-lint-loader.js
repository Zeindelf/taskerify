/* eslint-disable */
const PugLint = require('pug-lint');
const configFile = require('pug-lint/lib/config-file');
const webpackUtil = require('loader-utils');

const linter = new PugLint();

module.exports = function (content) {
  this.cacheable();

  let errors = [];
  const opts = webpackUtil.getOptions(this);
  const config = configFile.load(this.rootContent);
  const reporter = configFile.getReporter('puglint-stylish');

  linter.configure(config);
  errors = errors.concat(linter.checkPath(opts.file));

  if (errors.length) reporter.writer(errors);

  return content;
};
