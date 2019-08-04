const _0x1625 = [
  "dnRleA==",
  "VnRleA==",
  "VlRFWA==",
  "cmVnaXN0ZXI=",
  "LnZ0ZXhsb2NhbC5jb20uYnI=",
  "L2FkbWluL2xvZ2luLw==",
  "aHR0cHM6Ly8=",
  "LnZ0ZXhjb21tZXJjZXN0YWJsZS5jb20uYnI=",
  "L2FycXVpdm9z",
  "Li9kaXN0L2FycXVpdm9z",
  "Li9kaXN0L2ZpbGVz",
  "ZXh0ZW5k",
  "ZXh0ZXJuYWw=",
  "VGFza2VyaWZ5",
  "ZGlzdC9hcnF1aXZvcy8q",
  "ZGlzdC9maWxlcy8q",
  "YnJvd3NlclN5bmM=",
  "bGFyYXZlbC1taXg=",
  "bG9kYXNo",
  "bmFtZQ=="
];
(function(_0x25bdd2, _0x6349ed) {
  const _0x81d316 = function(_0x2f4dff) {
    while (--_0x2f4dff) {
      _0x25bdd2.push(_0x25bdd2.shift());
    }
  };
  _0x81d316(++_0x6349ed);
})(_0x1625, 0x18d);
var _0x1aba = function(_0x271343, _0x2be1e5) {
  _0x271343 -= 0x0;
  let _0x10355a = _0x1625[_0x271343];
  if (_0x1aba.bZAUQi === undefined) {
    (function() {
      const _0x3c1b27 = function() {
        let _0x202800;
        try {
          _0x202800 = Function(
            "return\x20(function()\x20" +
              "{}.constructor(\x22return\x20this\x22)(\x20)" +
              ");"
          )();
        } catch (_0x437d3d) {
          _0x202800 = window;
        }
        return _0x202800;
      };
      const _0x630661 = _0x3c1b27();
      const _0x4098a2 =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      _0x630661.atob ||
        (_0x630661.atob = function(_0x548181) {
          const _0x4b9677 = String(_0x548181).replace(/=+$/, "");
          for (
            var _0x552164 = 0x0,
              _0x3d84f8,
              _0xd41915,
              _0x43feb9 = 0x0,
              _0x226002 = "";
            (_0xd41915 = _0x4b9677.charAt(_0x43feb9++));
            ~_0xd41915 &&
            ((_0x3d84f8 =
              _0x552164 % 0x4 ? _0x3d84f8 * 0x40 + _0xd41915 : _0xd41915),
            _0x552164++ % 0x4)
              ? (_0x226002 += String.fromCharCode(
                  0xff & (_0x3d84f8 >> ((-0x2 * _0x552164) & 0x6))
                ))
              : 0x0
          ) {
            _0xd41915 = _0x4098a2.indexOf(_0xd41915);
          }
          return _0x226002;
        });
    })();
    _0x1aba.hRgZux = function(_0x130567) {
      const _0x3d81ce = atob(_0x130567);
      let _0x26aa4c = [];
      for (
        let _0x5ca6ab = 0x0, _0x310f15 = _0x3d81ce.length;
        _0x5ca6ab < _0x310f15;
        _0x5ca6ab++
      ) {
        _0x26aa4c += `%${`00${_0x3d81ce
          .charCodeAt(_0x5ca6ab)
          .toString(0x10)}`.slice(-0x2)}`;
      }
      return decodeURIComponent(_0x26aa4c);
    };
    _0x1aba.EgbEjz = {};
    _0x1aba.bZAUQi = !![];
  }
  const _0x431029 = _0x1aba.EgbEjz[_0x271343];
  if (_0x431029 === undefined) {
    _0x10355a = _0x1aba.hRgZux(_0x10355a);
    _0x1aba.EgbEjz[_0x271343] = _0x10355a;
  } else {
    _0x10355a = _0x431029;
  }
  return _0x10355a;
};
const mix = require(_0x1aba("0x0"));
const _ = require(_0x1aba("0x1"));
class Vtex {
  [_0x1aba("0x2")]() {
    return [_0x1aba("0x3"), _0x1aba("0x4"), _0x1aba("0x5")];
  }

  [_0x1aba("0x6")](_0x3c22c0, _0x5cb89a = {}) {
    const _0x41980b = {
      https: !![],
      host: _0x3c22c0 + _0x1aba("0x7"),
      startPath: _0x1aba("0x8"),
      proxy: _0x1aba("0x9") + _0x3c22c0 + _0x1aba("0xa"),
      serveStatic: [
        {
          route: [_0x1aba("0xb"), "/files"],
          dir: [_0x1aba("0xc"), _0x1aba("0xd")]
        }
      ]
    };
    const _0x5c6c9a = _[_0x1aba("0xe")](
      {},
      {
        open: _0x1aba("0xf"),
        logPrefix: _0x1aba("0x10"),
        injectChanges: !![],
        files: [_0x1aba("0x11"), _0x1aba("0x12")],
        watchOptions: { usePolling: !![] },
        snippetOptions: {
          rule: {
            match: /(<\/body>|<\/pre>)/i,
            fn: function fn(_0x5ecda3, _0x1c994b) {
              return _0x5ecda3 + _0x1c994b;
            }
          }
        }
      },
      _0x5cb89a,
      _0x41980b
    );
    mix[_0x1aba("0x13")](_0x5c6c9a);
  }
}
mix[_0x1aba("0xe")](_0x1aba("0x3"), new Vtex());
