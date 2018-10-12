
import Taskerify from '../src/index';

Taskerify.config.sourcemaps      = false;                // Disable .map files
Taskerify.config.srcPath         = './test-src/assets';  // Src Path
Taskerify.config.distPath        = './test-dist/assets'; // Dist Path
Taskerify.config.srcViewsPath    = './test-src';         // Views Src Path
Taskerify.config.distViewsPath   = './test-dist';        // Compiled Views Dist Path (HTML)

// ImageMin configs
Taskerify.config.images.minCompress       = 60;      // {int} Default value
Taskerify.config.images.maxCompress       = 70;      // {int} Default value
Taskerify.config.images.optimizationLevel = 5;       // {int} Default value
Taskerify.config.images.quality           = '70-80'; // {string} Default valuenm

Taskerify( mix => {
    const SRC           = Taskerify.config.srcPath;
    const DIST          = Taskerify.config.distPath;
    const SRC_VIEWS     = Taskerify.config.srcViewsPath + '/views';
    const DIST_VIEWS    = Taskerify.config.distViewsPath;
    const files         = ['app', 'main'];

    // CSS Critical Rendering Path
    mix.sass(`${SRC}/scss/critical-css.scss`, `${DIST}/css`);
    mix.criticalCss(
        `${DIST}/css/critical-css.css`, // Compiled CSS File (.css)
        `${SRC_VIEWS}/partials`,        // Folder to receive a file with inline CSS
        'critical-css.html'             // Name of a file with inline CSS (with extension name)
    );

    // Linters
    mix.eslint();
    mix.stylelint();

    // PugJS Template
    mix.pug(); // Default path: Taskerify.config.srcViewsPath (Same as partialifyHtml)

    // SVG to Iconfonts (custom configs)
    mix.iconfont({
        /** Plugin options - Default Values */
        // formats            : ['eot', 'ttf', 'woff', 'woff2'],
        // appendCodepoints   : true,
        // prependUnicode     : false,
        // normalize          : true,
        // fontHeight         : 1001,
        // centerHorizontally : true,

        /** Fonts / CSS options */
        // iconsPath       : `${SRC}/icons/`,                            // Default Value: /src/assets/icons/                           { .svg icons folder }
        sassPath        : `${SRC}/scss/custom/`,                      // Default Value: /src/assets/sass/                            { folder to create iconfont SASS file }
        fontPath        : '../fonts/',                                // Default Value: /dist/assets/fonts/                          { path to CSS }
        // outputFontPath  : `${SRC}/fonts/`,                            // Default Value: /dist/assets/fonts/                          { path to save fonts files }
        className       : 'custom-iconfont',                          // Default Value: 'iconfont'                                   { fonts class name }
        iconFontName    : 'custom-name',                              // Default Value: 'iconfont'                                   { font family name }
        template        : `${SRC}/storage/custom-template.scss`,      // Default Value: .scss/.css templates with all icons classes  { .scss/.css templates }
        sassFileName    : '_custom-file',                             // Default Value: _iconfont.scss                               { .scss file name }
        customExtension : '.custom',                                  // Default Value: false                                        { fonts file extension }
        // hash            : Math.random().toString(36).substring(6),    // Default value                                              { string for cached fonts }
    });

    // JSON and HTML Include Partial Files (Especially for Shopify's dev)
    mix.partialifyJson(`${SRC}/json/index.json`)                                                  // Compiled at: ./Taskerify.config.distPath/json/index.json
        .partialifyJson(`${SRC}/json-rename/index.json`, `${DIST}/json-rename/json-renamed.json`) // Compiled at: ./Taskerify.config.distPath/json-rename/json-rename.json
        .partialifyHtml(`${SRC_VIEWS}/index.html`)                                                // Compiled at: ./Taskerify.config.distViewsPath/html/index.html
        .partialifyHtml(`${SRC_VIEWS}/index.html`, `${DIST_VIEWS}/html/renamed-file.html`);       // Compiled at: ./Taskerify.config.distViewsPath/html/html-renamed.json

    // Copy Task
    mix.copy(`${SRC}/copy/*.txt`, `${DIST}/copy`);

    // Image Sprites Task
    mix.spriteImg({
        src: `${SRC}/img/sprite-img`,       // {string} Source Images
        cssOutput: `${SRC}/scss/vendor`,    // {string} Dir for SASS sprite file
        imgName: 'sprite-img.png',          // {string} Sprite Name generator
        cssName: '_sprite-img.scss',        // {string} SASS File with Sprite Variables
        imgPath: '../img/sprite-img.png', // {string} Path to use in CSS referring to image location
        imgOutput: `${SRC}/img`,            // {string} Path to save sprite
    });

    // SVG Sprites Task
    mix.spriteSvg(`${SRC}/img/sprite-svg`, `${DIST}/img`);

    // Image Compress (General Images | Sprite Image)
    mix.imagemin(`${SRC}/images`, `${DIST}/img/compressed`)
        .imagemin(`${SRC}/img/sprite-img.png`, `${DIST}/img`)
        .clean(`${SRC}/img/sprite-img.png`);

    // CSS | JS Taskes for common files
    files.map( file => {
        mix.sass(`${SRC}/scss/${file}.scss`, `${DIST}/css`);
        mix.browserify(`${SRC}/js/${file}.js`, `${DIST}/js`);
    });
});
