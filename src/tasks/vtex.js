'use strict';

var _ = require('underscore');
var gutils = require('gulp-util');
var Taskerify = require('./../index');
var browserSync = require('browser-sync').create();

Taskerify.extend('vtex', function (accountName, customOptions = {}) {
  const vtexConfig = {
    open: false,
    https: true,
    host: `${accountName}.vtexlocal.com.br`,
    startPath: '/admin/login/',
    proxy: `https://${accountName}.vtexcommercestable.com.br`,
    serveStatic: [{
      route: '/arquivos',
      dir: './dist/arquivos',
    }],
  };

  const options = _.extend({}, {
    injectChanges: true,
    files: [
      'dist/arquivos/*.css',
      'dist/arquivos/*.js',
    ],
    watchOptions: {
      usePolling: true
    },
    snippetOptions: {
      rule: {
        match: /(<\/body>|<\/pre>)/i,
        fn: function fn(snippet, match) {
          return snippet + match;
        }
      }
    }
  }, customOptions, vtexConfig);

  if (gutils.env._.indexOf('watch') > -1) {
    browserSync.init(options);
  }

  new Taskerify.Task('vtex', function () {}).watch();
});
