
import Taskerify from './../src/index';

Taskerify.config.sourcemaps = false;         // Disable .map files
Taskerify.config.distPath   = './test-dist'; // Dist Path
Taskerify.config.srcPath    = './test-src';  // Src Path

// ImageMin configs
Taskerify.config.images.minCompress       = 60;      // {int} Default value
Taskerify.config.images.maxCompress       = 70;      // {int} Default value
Taskerify.config.images.optimizationLevel = 5;       // {int} Default value
Taskerify.config.images.quality           = '70-80'; // {string} Default value

Taskerify( mix => {
    const DIST  = Taskerify.config.distPath;
    const SRC   = Taskerify.config.srcPath;
    const files = ['app', 'main'];

    // JSON Include Partial Files (Especially for Shopify's dev)
    mix.jsonInclude(`${SRC}/json/index.json`) // Compiled at: ./Taskerify.config.distPath/json/index.json
        .jsonInclude(`${SRC}/json-rename/index.json`, `${DIST}/json-rename/renamed-file.json`);

    // ESLint activated
    mix.eslint();

    // Copy Task
    mix.copy(`${SRC}/*.html`, `${DIST}/`);

    // Image Sprites Task
    mix.spriteIMG({
        src: `${SRC}/img/sprite-img`,       // {string} Source Images
        imgName: 'sprite-img.png',          // {string} Sprite Name generator
        cssName: '_sprite-img.scss',        // {string} SASS File with Sprite Variables
        imgPath: './../img/sprite-img.png', // {string} Path to use in CSS referring to image location
        imgOutput: `${SRC}/img`,            // {string} Path to save sprite
    });

    // SVG Sprites Task
    mix.spriteSVG(`${SRC}/img/sprite-svg`, `${DIST}/assets/img`);

    // Image Compress (General Images | Sprite Image)
    mix.imagemin(`${SRC}/images`, `${DIST}/assets/img/compressed`)
        .imagemin(`${SRC}/img/sprite-img.png`, `${DIST}/assets/img`)
        .clean(`${SRC}/img/sprite-img.png`);

    // CSS | JS Taskes for common files
    files.map( file => {
        mix.sass(`${SRC}/scss/${file}.scss`, `${DIST}/assets/css`);
        mix.browserify(`${SRC}/js/${file}.js`, `${DIST}/assets/js`);
    });
});
