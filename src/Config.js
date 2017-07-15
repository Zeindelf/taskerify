var p = require('path');
var gutils = require('gulp-util');

var production = gutils.env.production || process.env.NODE_ENV === 'production';

var config = {
    tasks: [],
    production: production,
    srcPath: 'src/assets',
    distPath: 'dist/assets',
    appPath: 'app',
    viewPath: 'resources/views',
    sourcemaps: ! gutils.env.production,
    cleanDirs: ['dist'],
    batchOptions: {
        // https://github.com/floatdrop/gulp-batch#batchoptions-callback-errorhandler
        limit: undefined,
        timeout: 1000
    },

    images: {
        folder: 'images',
        outputFolder: 'images',
        minCompress: 60,
        maxCompress: 70,
        quality: '70-80',
        optimizationLevel: 5
    },

    svgSprite: {
        folder: 'svg',
        outputFolder: 'svg',
        pluginOptions: {
            mode: {
                symbol: {
                    dest: '.',
                    sprite: 'sprite.svg'
                }
            }
        }
    },

    css: {
        folder: 'css',
        outputFolder: 'css',
        autoprefix: {
            enabled: true,

            // https://www.npmjs.com/package/gulp-autoprefixer#api
            options:  {
                browsers: [
                    'last 7 versions',
                    'Explorer >= 10',
                    'Safari >= 3.1',
                    'Android >= 2.1',
                    'iOS >= 3.2',
                    'BlackBerry >= 7',
                    'Firefox >= 21',
                    'Chrome >= 20',
                ],
                cascade: false
            }
        },
        cssnano: {
            // http://cssnano.co/options
            pluginOptions: {
                safe: true
            }
        },
        sass: {
            folder: 'scss',

            // https://github.com/sass/node-sass#options
            pluginOptions: {
                outputStyle: production
                    ? 'compressed'
                    : 'nested',
                precision: 10
            }
        },
    },

    js: {
        folder: 'js',
        outputFolder: 'js',
        babel: {
            // https://www.npmjs.com/package/gulp-babel#babel-options
            options: {
                presets: ['es2015', 'react']
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            }
        },
        browserify: {
            // https://www.npmjs.com/package/browserify#usage
            options: {
                cache: {},
                packageCache: {}
            },

            plugins: [],

            externals: [],

            transformers: [
                {
                    name: 'babelify',

                    // https://www.npmjs.com/package/gulp-babel#babel-options
                    options: {
                        presets: ['es2015', 'react']
                    }
                },

                {
                    name: 'partialify',

                    // https://www.npmjs.com/package/partialify
                    options: {}
                }
            ],

            watchify: {
                enabled: false,

                // https://www.npmjs.com/package/watchify#usage
                options: {}
            }
        },
    },

    json: {
        folder: 'json',
        outputFolder: 'json'
    },

    views: {
        folder: 'views',
        outputFolder: 'html'
    },

    versioning: {
        buildFolder: 'dist'
    },

    browserSync: {
        // http://www.browsersync.io/docs/options/
        proxy: 'localhost',
        reloadOnRestart : true,
        notify: true
    }

};

/**
 * Fetch a config item, using a string dot-notation.
 *
 * @param  {string} path
 * @return {string}
 */
config.get = function(path) {
    var basePath;
    var current = config;

    var segments = path.split('.');

    if ( segments[0] == 'src' || segments[0] == 'dist' ) {
        basePath = config[segments.shift() + 'Path'];
    }

    segments.forEach(function(segment) {
        current = current[segment];
    });

    return p.join(basePath, current);
};

module.exports = config;
