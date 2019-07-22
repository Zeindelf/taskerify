const _0x823e = ['./shared/Vtex'];

(function(_0x287deb, _0x1a6253) {
  const _0x170eb3 = function(_0x20ac0c) {
    while (--_0x20ac0c) {
      _0x287deb['push'](_0x287deb['shift']());
    }
  };

  _0x170eb3(++_0x1a6253);
}(_0x823e, 0x9f));

const _0x5eb8 = function(_0x45dcf3, _0x201d1d) {
  _0x45dcf3 = _0x45dcf3 - 0x0;
  const _0x30c6ad = _0x823e[_0x45dcf3];

  return _0x30c6ad;
};

const _0x5d39 = require(_0x5eb8('0x0'));

(function(_0x411de8, _0x148d7c) {
  const _0xe3535f = function(_0x3a3232) {
    while (--_0x3a3232) {
      _0x411de8['push'](_0x411de8['shift']());
    }
  };

  _0xe3535f(++_0x148d7c);
}(_0x5d39, 0x141));

const _0x1f3d = function(_0xd8bbf4, _0x5a4b83) {
  _0xd8bbf4 = _0xd8bbf4 - 0x0;
  const _0x13a2c7 = _0x5d39[_0xd8bbf4];

  return _0x13a2c7;
};

const _ = require('underscore');
const gutils = require('gulp-util');
const Taskerify = require(_0x1f3d('0x0'));
const browserSync = require('browser-sync')[_0x1f3d('0x1')]();

Taskerify[_0x1f3d('0x2')](_0x1f3d('0x3'), function(_0x20133f, _0x2eb96f = {}) {
  const _0xb08293 = {
    'https': !![],
    'host': _0x20133f + _0x1f3d('0x4'),
    'startPath': _0x1f3d('0x5'),
    'proxy': 'https://' + _0x20133f + _0x1f3d('0x6'),
    'serveStatic': [{
      'route': [_0x1f3d('0x7'), '/files'],
      'dir': [_0x1f3d('0x8'), _0x1f3d('0x9')],
    }],
  };

  const _0x41dee1 = _['extend']({}, {
    'open': _0x1f3d('0xa'),
    'logPrefix': _0x1f3d('0xb'),
    'injectChanges': !![],
    'files': [_0x1f3d('0xc'), _0x1f3d('0xd')],
    'watchOptions': {
      'usePolling': !![]
    },
    'snippetOptions': {
      'rule': {
        'match': /(<\/body>|<\/pre>)/i,
        'fn': function fn(_0x430521, _0x1bca7e) {
          return _0x430521 + _0x1bca7e;
        }
      }
    }
  }, _0x2eb96f, _0xb08293);

  if (gutils['env']['_'][_0x1f3d('0xe')](_0x1f3d('0xf')) > -0x1) {
    browserSync['init'](_0x41dee1);
  }

  new Taskerify[(_0x1f3d('0x10'))](_0x1f3d('0x3'), function() {})[_0x1f3d('0xf')]();
});
