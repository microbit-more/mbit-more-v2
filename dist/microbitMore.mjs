var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;

if (typeof global$1.setTimeout === 'function') {
  cachedSetTimeout = setTimeout;
}

if (typeof global$1.clearTimeout === 'function') {
  cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

function nextTick(fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
} // v8 likes predictible objects

function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues

var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error('process.binding is not supported');
}
function cwd() {
  return '/';
}
function chdir(dir) {
  throw new Error('process.chdir is not supported');
}
function umask() {
  return 0;
} // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

var performance = global$1.performance || {};

var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
  return new Date().getTime();
}; // generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime


function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);

  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];

    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }

  return [seconds, nanoseconds];
}
var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}
var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

var emptyObject = {};

{
  Object.freeze(emptyObject);
}

var emptyObject_1 = emptyObject;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}
/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */


var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);

emptyFunction.thatReturnsThis = function () {
  return this;
};

emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

var q = "function" === typeof Symbol && Symbol["for"],
    r = q ? Symbol["for"]("react.element") : 60103,
    t = q ? Symbol["for"]("react.call") : 60104,
    u = q ? Symbol["for"]("react.return") : 60105,
    v = q ? Symbol["for"]("react.portal") : 60106,
    w = q ? Symbol["for"]("react.fragment") : 60107,
    x = "function" === typeof Symbol && Symbol.iterator;

function y(a) {
  for (var b = arguments.length - 1, e = "Minified React error #" + a + "; visit http://facebook.github.io/react/docs/error-decoder.html?invariant\x3d" + a, c = 0; c < b; c++) {
    e += "\x26args[]\x3d" + encodeURIComponent(arguments[c + 1]);
  }

  b = Error(e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.");
  b.name = "Invariant Violation";
  b.framesToPop = 1;
  throw b;
}

var z = {
  isMounted: function isMounted() {
    return !1;
  },
  enqueueForceUpdate: function enqueueForceUpdate() {},
  enqueueReplaceState: function enqueueReplaceState() {},
  enqueueSetState: function enqueueSetState() {}
};

function A(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = emptyObject_1;
  this.updater = e || z;
}

A.prototype.isReactComponent = {};

A.prototype.setState = function (a, b) {
  "object" !== _typeof(a) && "function" !== typeof a && null != a ? y("85") : void 0;
  this.updater.enqueueSetState(this, a, b, "setState");
};

A.prototype.forceUpdate = function (a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};

function B(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = emptyObject_1;
  this.updater = e || z;
}

function C() {}

C.prototype = A.prototype;
var D = B.prototype = new C();
D.constructor = B;
objectAssign(D, A.prototype);
D.isPureReactComponent = !0;

function E(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = emptyObject_1;
  this.updater = e || z;
}

var F = E.prototype = new C();
F.constructor = E;
objectAssign(F, A.prototype);
F.unstable_isAsyncReactComponent = !0;

F.render = function () {
  return this.props.children;
};

var G = {
  current: null
},
    H = Object.prototype.hasOwnProperty,
    I = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
};

function J(a, b, e) {
  var c,
      d = {},
      g = null,
      k = null;
  if (null != b) for (c in void 0 !== b.ref && (k = b.ref), void 0 !== b.key && (g = "" + b.key), b) {
    H.call(b, c) && !I.hasOwnProperty(c) && (d[c] = b[c]);
  }
  var f = arguments.length - 2;
  if (1 === f) d.children = e;else if (1 < f) {
    for (var h = Array(f), l = 0; l < f; l++) {
      h[l] = arguments[l + 2];
    }

    d.children = h;
  }
  if (a && a.defaultProps) for (c in f = a.defaultProps, f) {
    void 0 === d[c] && (d[c] = f[c]);
  }
  return {
    $$typeof: r,
    type: a,
    key: g,
    ref: k,
    props: d,
    _owner: G.current
  };
}

function K(a) {
  return "object" === _typeof(a) && null !== a && a.$$typeof === r;
}

function escape(a) {
  var b = {
    "\x3d": "\x3d0",
    ":": "\x3d2"
  };
  return "$" + ("" + a).replace(/[=:]/g, function (a) {
    return b[a];
  });
}

var L = /\/+/g,
    M = [];

function N(a, b, e, c) {
  if (M.length) {
    var d = M.pop();
    d.result = a;
    d.keyPrefix = b;
    d.func = e;
    d.context = c;
    d.count = 0;
    return d;
  }

  return {
    result: a,
    keyPrefix: b,
    func: e,
    context: c,
    count: 0
  };
}

function O(a) {
  a.result = null;
  a.keyPrefix = null;
  a.func = null;
  a.context = null;
  a.count = 0;
  10 > M.length && M.push(a);
}

function P(a, b, e, c) {
  var d = _typeof(a);

  if ("undefined" === d || "boolean" === d) a = null;
  var g = !1;
  if (null === a) g = !0;else switch (d) {
    case "string":
    case "number":
      g = !0;
      break;

    case "object":
      switch (a.$$typeof) {
        case r:
        case t:
        case u:
        case v:
          g = !0;
      }

  }
  if (g) return e(c, a, "" === b ? "." + Q(a, 0) : b), 1;
  g = 0;
  b = "" === b ? "." : b + ":";
  if (Array.isArray(a)) for (var k = 0; k < a.length; k++) {
    d = a[k];
    var f = b + Q(d, k);
    g += P(d, f, e, c);
  } else if (null === a || "undefined" === typeof a ? f = null : (f = x && a[x] || a["@@iterator"], f = "function" === typeof f ? f : null), "function" === typeof f) for (a = f.call(a), k = 0; !(d = a.next()).done;) {
    d = d.value, f = b + Q(d, k++), g += P(d, f, e, c);
  } else "object" === d && (e = "" + a, y("31", "[object Object]" === e ? "object with keys {" + Object.keys(a).join(", ") + "}" : e, ""));
  return g;
}

function Q(a, b) {
  return "object" === _typeof(a) && null !== a && null != a.key ? escape(a.key) : b.toString(36);
}

function R(a, b) {
  a.func.call(a.context, b, a.count++);
}

function S(a, b, e) {
  var c = a.result,
      d = a.keyPrefix;
  a = a.func.call(a.context, b, a.count++);
  Array.isArray(a) ? T(a, c, e, emptyFunction_1.thatReturnsArgument) : null != a && (K(a) && (b = d + (!a.key || b && b.key === a.key ? "" : ("" + a.key).replace(L, "$\x26/") + "/") + e, a = {
    $$typeof: r,
    type: a.type,
    key: b,
    ref: a.ref,
    props: a.props,
    _owner: a._owner
  }), c.push(a));
}

function T(a, b, e, c, d) {
  var g = "";
  null != e && (g = ("" + e).replace(L, "$\x26/") + "/");
  b = N(b, g, c, d);
  null == a || P(a, "", S, b);
  O(b);
}

var U = {
  Children: {
    map: function map(a, b, e) {
      if (null == a) return a;
      var c = [];
      T(a, c, null, b, e);
      return c;
    },
    forEach: function forEach(a, b, e) {
      if (null == a) return a;
      b = N(null, null, b, e);
      null == a || P(a, "", R, b);
      O(b);
    },
    count: function count(a) {
      return null == a ? 0 : P(a, "", emptyFunction_1.thatReturnsNull, null);
    },
    toArray: function toArray(a) {
      var b = [];
      T(a, b, null, emptyFunction_1.thatReturnsArgument);
      return b;
    },
    only: function only(a) {
      K(a) ? void 0 : y("143");
      return a;
    }
  },
  Component: A,
  PureComponent: B,
  unstable_AsyncComponent: E,
  Fragment: w,
  createElement: J,
  cloneElement: function cloneElement(a, b, e) {
    var c = objectAssign({}, a.props),
        d = a.key,
        g = a.ref,
        k = a._owner;

    if (null != b) {
      void 0 !== b.ref && (g = b.ref, k = G.current);
      void 0 !== b.key && (d = "" + b.key);
      if (a.type && a.type.defaultProps) var f = a.type.defaultProps;

      for (h in b) {
        H.call(b, h) && !I.hasOwnProperty(h) && (c[h] = void 0 === b[h] && void 0 !== f ? f[h] : b[h]);
      }
    }

    var h = arguments.length - 2;
    if (1 === h) c.children = e;else if (1 < h) {
      f = Array(h);

      for (var l = 0; l < h; l++) {
        f[l] = arguments[l + 2];
      }

      c.children = f;
    }
    return {
      $$typeof: r,
      type: a.type,
      key: d,
      ref: g,
      props: c,
      _owner: k
    };
  },
  createFactory: function createFactory(a) {
    var b = J.bind(null, a);
    b.type = a;
    return b;
  },
  isValidElement: K,
  version: "16.2.0",
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: G,
    assign: objectAssign
  }
},
    V = Object.freeze({
  default: U
}),
    W = V && U || V;
var react_production_min = W["default"] ? W["default"] : W;

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */


var validateFormat = function validateFormat(format) {};

{
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame

    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */


var warning = emptyFunction_1;

{
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning$1 = function printWarning() {};

{
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning$1 = function printWarning(text) {
    var message = 'Warning: ' + text;

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}
/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */


function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + _typeof(typeSpecs[typeSpecName]) + '`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }

        if (error && !(error instanceof Error)) {
          printWarning$1((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + _typeof(error) + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
        }

        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;
          var stack = getStack ? getStack() : '';
          printWarning$1('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
        }
      }
    }
  }
}
/**
 * Resets warning cache when testing.
 *
 * @private
 */


checkPropTypes.resetWarningCache = function () {
  {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var react_development = createCommonjsModule(function (module) {

  {
    (function () {

      var _assign = objectAssign;
      var emptyObject = emptyObject_1;
      var invariant = invariant_1;
      var warning = warning_1;
      var emptyFunction = emptyFunction_1;
      var checkPropTypes = checkPropTypes_1; // TODO: this is special because it gets imported during build.

      var ReactVersion = '16.2.0'; // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
      // nor polyfill, then a plain number is used for performance.

      var hasSymbol = typeof Symbol === 'function' && Symbol['for'];
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
      var REACT_CALL_TYPE = hasSymbol ? Symbol['for']('react.call') : 0xeac8;
      var REACT_RETURN_TYPE = hasSymbol ? Symbol['for']('react.return') : 0xeac9;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;
      var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator';

      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable === 'undefined') {
          return null;
        }

        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

        if (typeof maybeIterator === 'function') {
          return maybeIterator;
        }

        return null;
      }
      /**
       * WARNING: DO NOT manually require this module.
       * This is a replacement for `invariant(...)` used by the error code system
       * and will _only_ be required by the corresponding babel pass.
       * It always throws.
       */

      /**
       * Forked from fbjs/warning:
       * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
       *
       * Only change is we use console.warn instead of console.error,
       * and do nothing when 'console' is not supported.
       * This really simplifies the code.
       * ---
       * Similar to invariant but only logs a warning if the condition is not met.
       * This can be used to log issues in development environments in critical
       * paths. Removing the logging code for production environments will keep the
       * same logic and follow the same code paths.
       */


      var lowPriorityWarning = function lowPriorityWarning() {};

      {
        var printWarning = function printWarning(format) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });

          if (typeof console !== 'undefined') {
            console.warn(message);
          }

          try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
          } catch (x) {}
        };

        lowPriorityWarning = function lowPriorityWarning(condition, format) {
          if (format === undefined) {
            throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
          }

          if (!condition) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }

            printWarning.apply(undefined, [format].concat(args));
          }
        };
      }
      var lowPriorityWarning$1 = lowPriorityWarning;
      var didWarnStateUpdateForUnmountedComponent = {};

      function warnNoop(publicInstance, callerName) {
        {
          var constructor = publicInstance.constructor;
          var componentName = constructor && (constructor.displayName || constructor.name) || 'ReactClass';
          var warningKey = componentName + '.' + callerName;

          if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
            return;
          }

          warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);
          didWarnStateUpdateForUnmountedComponent[warningKey] = true;
        }
      }
      /**
       * This is the abstract API for an update queue.
       */


      var ReactNoopUpdateQueue = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function isMounted(publicInstance) {
          return false;
        },

        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function enqueueForceUpdate(publicInstance, callback, callerName) {
          warnNoop(publicInstance, 'forceUpdate');
        },

        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState, callback, callerName) {
          warnNoop(publicInstance, 'replaceState');
        },

        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function enqueueSetState(publicInstance, partialState, callback, callerName) {
          warnNoop(publicInstance, 'setState');
        }
      };
      /**
       * Base class helpers for the updating state of a component.
       */

      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
        // renderer.

        this.updater = updater || ReactNoopUpdateQueue;
      }

      Component.prototype.isReactComponent = {};
      /**
       * Sets a subset of the state. Always use this to mutate
       * state. You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * There is no guarantee that calls to `setState` will run synchronously,
       * as they may eventually be batched together.  You can provide an optional
       * callback that will be executed when the call to setState is actually
       * completed.
       *
       * When a function is provided to setState, it will be called at some point in
       * the future (not synchronously). It will be called with the up to date
       * component arguments (state, props, context). These values can be different
       * from this.* because your function may be called after receiveProps but before
       * shouldComponentUpdate, and this new state, props, and context will not yet be
       * assigned to this.
       *
       * @param {object|function} partialState Next partial state or function to
       *        produce next partial state to be merged with current state.
       * @param {?function} callback Called after state is updated.
       * @final
       * @protected
       */

      Component.prototype.setState = function (partialState, callback) {
        !(_typeof(partialState) === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
        this.updater.enqueueSetState(this, partialState, callback, 'setState');
      };
      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {?function} callback Called after update is complete.
       * @final
       * @protected
       */


      Component.prototype.forceUpdate = function (callback) {
        this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
      };
      /**
       * Deprecated APIs. These APIs used to exist on classic React classes but since
       * we would like to deprecate them, we're not going to move them over to this
       * modern base class. Instead, we define a getter that warns if it's accessed.
       */


      {
        var deprecatedAPIs = {
          isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
          replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
        };

        var defineDeprecationWarning = function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function get() {
              lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
              return undefined;
            }
          });
        };

        for (var fnName in deprecatedAPIs) {
          if (deprecatedAPIs.hasOwnProperty(fnName)) {
            defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
          }
        }
      }
      /**
       * Base class helpers for the updating state of a component.
       */

      function PureComponent(props, context, updater) {
        // Duplicated from Component.
        this.props = props;
        this.context = context;
        this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
        // renderer.

        this.updater = updater || ReactNoopUpdateQueue;
      }

      function ComponentDummy() {}

      ComponentDummy.prototype = Component.prototype;
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
      pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

      _assign(pureComponentPrototype, Component.prototype);

      pureComponentPrototype.isPureReactComponent = true;

      function AsyncComponent(props, context, updater) {
        // Duplicated from Component.
        this.props = props;
        this.context = context;
        this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
        // renderer.

        this.updater = updater || ReactNoopUpdateQueue;
      }

      var asyncComponentPrototype = AsyncComponent.prototype = new ComponentDummy();
      asyncComponentPrototype.constructor = AsyncComponent; // Avoid an extra prototype jump for these methods.

      _assign(asyncComponentPrototype, Component.prototype);

      asyncComponentPrototype.unstable_isAsyncReactComponent = true;

      asyncComponentPrototype.render = function () {
        return this.props.children;
      };
      /**
       * Keeps track of the current owner.
       *
       * The current owner is the component who should own any components that are
       * currently being constructed.
       */


      var ReactCurrentOwner = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      };
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown;
      var specialPropRefWarningShown;

      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, 'ref')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== undefined;
      }

      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, 'key')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== undefined;
      }

      function defineKeyPropWarningGetter(props, displayName) {
        var warnAboutAccessingKey = function warnAboutAccessingKey() {
          if (!specialPropKeyWarningShown) {
            specialPropKeyWarningShown = true;
            warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
          }
        };

        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, 'key', {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }

      function defineRefPropWarningGetter(props, displayName) {
        var warnAboutAccessingRef = function warnAboutAccessingRef() {
          if (!specialPropRefWarningShown) {
            specialPropRefWarningShown = true;
            warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
          }
        };

        warnAboutAccessingRef.isReactWarning = true;
        Object.defineProperty(props, 'ref', {
          get: warnAboutAccessingRef,
          configurable: true
        });
      }
      /**
       * Factory method to create a new React element. This no longer adheres to
       * the class pattern, so do not use new to call it. Also, no instanceof check
       * will work. Instead test $$typeof field against Symbol.for('react.element') to check
       * if something is a React Element.
       *
       * @param {*} type
       * @param {*} key
       * @param {string|object} ref
       * @param {*} self A *temporary* helper to detect places where `this` is
       * different from the `owner` when React.createElement is called, so that we
       * can warn. We want to get rid of owner and replace string `ref`s with arrow
       * functions, and as long as `this` and owner are the same, there will be no
       * change in behavior.
       * @param {*} source An annotation object (added by a transpiler or otherwise)
       * indicating filename, line number, and/or other information.
       * @param {*} owner
       * @param {*} props
       * @internal
       */


      var ReactElement = function ReactElement(type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allow us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          // The validation flag is currently mutative. We put it on
          // an external backing store so that we can freeze the whole object.
          // This can be replaced with a WeakMap once they are implemented in
          // commonly used development environments.
          element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
          // the validation flag non-enumerable (where possible, which should
          // include every environment we run tests in), so the test framework
          // ignores it.

          Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          }); // self and source are DEV only properties.

          Object.defineProperty(element, '_self', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          }); // Two elements created in two different places should be considered
          // equal for testing purposes and therefore we hide it from enumeration.

          Object.defineProperty(element, '_source', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });

          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      /**
       * Create and return a new ReactElement of the given type.
       * See https://reactjs.org/docs/react-api.html#createelement
       */


      function createElement(type, config, children) {
        var propName; // Reserved names are extracted

        var props = {};
        var key = null;
        var ref = null;
        var self = null;
        var source = null;

        if (config != null) {
          if (hasValidRef(config)) {
            ref = config.ref;
          }

          if (hasValidKey(config)) {
            key = '' + config.key;
          }

          self = config.__self === undefined ? null : config.__self;
          source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
        } // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.


        var childrenLength = arguments.length - 2;

        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);

          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }

          {
            if (Object.freeze) {
              Object.freeze(childArray);
            }
          }
          props.children = childArray;
        } // Resolve default props


        if (type && type.defaultProps) {
          var defaultProps = type.defaultProps;

          for (propName in defaultProps) {
            if (props[propName] === undefined) {
              props[propName] = defaultProps[propName];
            }
          }
        }

        {
          if (key || ref) {
            if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
              var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }

              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
      }
      /**
       * Return a function that produces ReactElements of a given type.
       * See https://reactjs.org/docs/react-api.html#createfactory
       */


      function cloneAndReplaceKey(oldElement, newKey) {
        var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
        return newElement;
      }
      /**
       * Clone and return a new ReactElement using element as the starting point.
       * See https://reactjs.org/docs/react-api.html#cloneelement
       */


      function cloneElement(element, config, children) {
        var propName; // Original props are copied

        var props = _assign({}, element.props); // Reserved names are extracted


        var key = element.key;
        var ref = element.ref; // Self is preserved since the owner is preserved.

        var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
        // transpiler, and the original source is probably a better indicator of the
        // true owner.

        var source = element._source; // Owner will be preserved, unless ref is overridden

        var owner = element._owner;

        if (config != null) {
          if (hasValidRef(config)) {
            // Silently steal the ref from the parent.
            ref = config.ref;
            owner = ReactCurrentOwner.current;
          }

          if (hasValidKey(config)) {
            key = '' + config.key;
          } // Remaining properties override existing props


          var defaultProps;

          if (element.type && element.type.defaultProps) {
            defaultProps = element.type.defaultProps;
          }

          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              if (config[propName] === undefined && defaultProps !== undefined) {
                // Resolve default props
                props[propName] = defaultProps[propName];
              } else {
                props[propName] = config[propName];
              }
            }
          }
        } // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.


        var childrenLength = arguments.length - 2;

        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);

          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }

          props.children = childArray;
        }

        return ReactElement(element.type, key, ref, self, source, owner, props);
      }
      /**
       * Verifies the object is a ReactElement.
       * See https://reactjs.org/docs/react-api.html#isvalidelement
       * @param {?object} object
       * @return {boolean} True if `object` is a valid component.
       * @final
       */


      function isValidElement(object) {
        return _typeof(object) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }

      var ReactDebugCurrentFrame = {};
      {
        // Component that is being worked on
        ReactDebugCurrentFrame.getCurrentStack = null;

        ReactDebugCurrentFrame.getStackAddendum = function () {
          var impl = ReactDebugCurrentFrame.getCurrentStack;

          if (impl) {
            return impl();
          }

          return null;
        };
      }
      var SEPARATOR = '.';
      var SUBSEPARATOR = ':';
      /**
       * Escape and wrap key so it is safe to use as a reactid
       *
       * @param {string} key to be escaped.
       * @return {string} the escaped key.
       */

      function escape(key) {
        var escapeRegex = /[=:]/g;
        var escaperLookup = {
          '=': '=0',
          ':': '=2'
        };
        var escapedString = ('' + key).replace(escapeRegex, function (match) {
          return escaperLookup[match];
        });
        return '$' + escapedString;
      }
      /**
       * TODO: Test that a single child and an array with one item have the same key
       * pattern.
       */


      var didWarnAboutMaps = false;
      var userProvidedKeyEscapeRegex = /\/+/g;

      function escapeUserProvidedKey(text) {
        return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
      }

      var POOL_SIZE = 10;
      var traverseContextPool = [];

      function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
        if (traverseContextPool.length) {
          var traverseContext = traverseContextPool.pop();
          traverseContext.result = mapResult;
          traverseContext.keyPrefix = keyPrefix;
          traverseContext.func = mapFunction;
          traverseContext.context = mapContext;
          traverseContext.count = 0;
          return traverseContext;
        } else {
          return {
            result: mapResult,
            keyPrefix: keyPrefix,
            func: mapFunction,
            context: mapContext,
            count: 0
          };
        }
      }

      function releaseTraverseContext(traverseContext) {
        traverseContext.result = null;
        traverseContext.keyPrefix = null;
        traverseContext.func = null;
        traverseContext.context = null;
        traverseContext.count = 0;

        if (traverseContextPool.length < POOL_SIZE) {
          traverseContextPool.push(traverseContext);
        }
      }
      /**
       * @param {?*} children Children tree container.
       * @param {!string} nameSoFar Name of the key path so far.
       * @param {!function} callback Callback to invoke with each child found.
       * @param {?*} traverseContext Used to pass information throughout the traversal
       * process.
       * @return {!number} The number of children in this subtree.
       */


      function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
        var type = _typeof(children);

        if (type === 'undefined' || type === 'boolean') {
          // All of the above are perceived as null.
          children = null;
        }

        var invokeCallback = false;

        if (children === null) {
          invokeCallback = true;
        } else {
          switch (type) {
            case 'string':
            case 'number':
              invokeCallback = true;
              break;

            case 'object':
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_CALL_TYPE:
                case REACT_RETURN_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
              }

          }
        }

        if (invokeCallback) {
          callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
          // so that it's consistent if the number of children grows.
          nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
          return 1;
        }

        var child;
        var nextName;
        var subtreeCount = 0; // Count of children found in the current subtree.

        var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

        if (Array.isArray(children)) {
          for (var i = 0; i < children.length; i++) {
            child = children[i];
            nextName = nextNamePrefix + getComponentKey(child, i);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        } else {
          var iteratorFn = getIteratorFn(children);

          if (typeof iteratorFn === 'function') {
            {
              // Warn about using Maps as children
              if (iteratorFn === children.entries) {
                warning(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', ReactDebugCurrentFrame.getStackAddendum());
                didWarnAboutMaps = true;
              }
            }
            var iterator = iteratorFn.call(children);
            var step;
            var ii = 0;

            while (!(step = iterator.next()).done) {
              child = step.value;
              nextName = nextNamePrefix + getComponentKey(child, ii++);
              subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
            }
          } else if (type === 'object') {
            var addendum = '';
            {
              addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
            }
            var childrenString = '' + children;
            invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
          }
        }

        return subtreeCount;
      }
      /**
       * Traverses children that are typically specified as `props.children`, but
       * might also be specified through attributes:
       *
       * - `traverseAllChildren(this.props.children, ...)`
       * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
       *
       * The `traverseContext` is an optional argument that is passed through the
       * entire traversal. It can be used to store accumulations or anything else that
       * the callback might find relevant.
       *
       * @param {?*} children Children tree object.
       * @param {!function} callback To invoke upon traversing each child.
       * @param {?*} traverseContext Context for traversal.
       * @return {!number} The number of children in this subtree.
       */


      function traverseAllChildren(children, callback, traverseContext) {
        if (children == null) {
          return 0;
        }

        return traverseAllChildrenImpl(children, '', callback, traverseContext);
      }
      /**
       * Generate a key string that identifies a component within a set.
       *
       * @param {*} component A component that could contain a manual key.
       * @param {number} index Index that is used if a manual key is not provided.
       * @return {string}
       */


      function getComponentKey(component, index) {
        // Do some typechecking here since we call this blindly. We want to ensure
        // that we don't block potential future ES APIs.
        if (_typeof(component) === 'object' && component !== null && component.key != null) {
          // Explicit key
          return escape(component.key);
        } // Implicit key determined by the index in the set


        return index.toString(36);
      }

      function forEachSingleChild(bookKeeping, child, name) {
        var func = bookKeeping.func,
            context = bookKeeping.context;
        func.call(context, child, bookKeeping.count++);
      }
      /**
       * Iterates through children that are typically specified as `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#react.children.foreach
       *
       * The provided forEachFunc(child, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} forEachFunc
       * @param {*} forEachContext Context for forEachContext.
       */


      function forEachChildren(children, forEachFunc, forEachContext) {
        if (children == null) {
          return children;
        }

        var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
        traverseAllChildren(children, forEachSingleChild, traverseContext);
        releaseTraverseContext(traverseContext);
      }

      function mapSingleChildIntoContext(bookKeeping, child, childKey) {
        var result = bookKeeping.result,
            keyPrefix = bookKeeping.keyPrefix,
            func = bookKeeping.func,
            context = bookKeeping.context;
        var mappedChild = func.call(context, child, bookKeeping.count++);

        if (Array.isArray(mappedChild)) {
          mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
        } else if (mappedChild != null) {
          if (isValidElement(mappedChild)) {
            mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
          }

          result.push(mappedChild);
        }
      }

      function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
        var escapedPrefix = '';

        if (prefix != null) {
          escapedPrefix = escapeUserProvidedKey(prefix) + '/';
        }

        var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
        traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
        releaseTraverseContext(traverseContext);
      }
      /**
       * Maps children that are typically specified as `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#react.children.map
       *
       * The provided mapFunction(child, key, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} func The map function.
       * @param {*} context Context for mapFunction.
       * @return {object} Object containing the ordered map of results.
       */


      function mapChildren(children, func, context) {
        if (children == null) {
          return children;
        }

        var result = [];
        mapIntoWithKeyPrefixInternal(children, result, null, func, context);
        return result;
      }
      /**
       * Count the number of children that are typically specified as
       * `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#react.children.count
       *
       * @param {?*} children Children tree container.
       * @return {number} The number of children.
       */


      function countChildren(children, context) {
        return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
      }
      /**
       * Flatten a children object (typically specified as `props.children`) and
       * return an array with appropriately re-keyed children.
       *
       * See https://reactjs.org/docs/react-api.html#react.children.toarray
       */


      function toArray(children) {
        var result = [];
        mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
        return result;
      }
      /**
       * Returns the first child in a collection of children and verifies that there
       * is only one child in the collection.
       *
       * See https://reactjs.org/docs/react-api.html#react.children.only
       *
       * The current implementation of this function assumes that a single child gets
       * passed without a wrapper, but the purpose of this helper function is to
       * abstract away the particular structure of children.
       *
       * @param {?object} children Child collection structure.
       * @return {ReactElement} The first and only `ReactElement` contained in the
       * structure.
       */


      function onlyChild(children) {
        !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
        return children;
      }

      var describeComponentFrame = function describeComponentFrame(name, source, ownerName) {
        return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
      };

      function getComponentName(fiber) {
        var type = fiber.type;

        if (typeof type === 'string') {
          return type;
        }

        if (typeof type === 'function') {
          return type.displayName || type.name;
        }

        return null;
      }
      /**
       * ReactElementValidator provides a wrapper around a element factory
       * which validates the props passed to the element. This is intended to be
       * used only in DEV and could be replaced by a static type checker for languages
       * that support it.
       */


      {
        var currentlyValidatingElement = null;
        var propTypesMisspellWarningShown = false;

        var getDisplayName = function getDisplayName(element) {
          if (element == null) {
            return '#empty';
          } else if (typeof element === 'string' || typeof element === 'number') {
            return '#text';
          } else if (typeof element.type === 'string') {
            return element.type;
          } else if (element.type === REACT_FRAGMENT_TYPE) {
            return 'React.Fragment';
          } else {
            return element.type.displayName || element.type.name || 'Unknown';
          }
        };

        var getStackAddendum = function getStackAddendum() {
          var stack = '';

          if (currentlyValidatingElement) {
            var name = getDisplayName(currentlyValidatingElement);
            var owner = currentlyValidatingElement._owner;
            stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner));
          }

          stack += ReactDebugCurrentFrame.getStackAddendum() || '';
          return stack;
        };

        var VALID_FRAGMENT_PROPS = new Map([['children', true], ['key', true]]);
      }

      function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
          var name = getComponentName(ReactCurrentOwner.current);

          if (name) {
            return '\n\nCheck the render method of `' + name + '`.';
          }
        }

        return '';
      }

      function getSourceInfoErrorAddendum(elementProps) {
        if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
          var source = elementProps.__source;
          var fileName = source.fileName.replace(/^.*[\\\/]/, '');
          var lineNumber = source.lineNumber;
          return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
        }

        return '';
      }
      /**
       * Warn if there's no key explicitly set on dynamic arrays of children or
       * object keys are not valid. This allows us to keep track of children between
       * updates.
       */


      var ownerHasKeyUseWarning = {};

      function getCurrentComponentErrorInfo(parentType) {
        var info = getDeclarationErrorAddendum();

        if (!info) {
          var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

          if (parentName) {
            info = '\n\nCheck the top-level render call using <' + parentName + '>.';
          }
        }

        return info;
      }
      /**
       * Warn if the element doesn't have an explicit key assigned to it.
       * This element is in an array. The array could grow and shrink or be
       * reordered. All children that haven't already been validated are required to
       * have a "key" property assigned to it. Error statuses are cached so a warning
       * will only be shown once.
       *
       * @internal
       * @param {ReactElement} element Element that requires a key.
       * @param {*} parentType element's parent's type.
       */


      function validateExplicitKey(element, parentType) {
        if (!element._store || element._store.validated || element.key != null) {
          return;
        }

        element._store.validated = true;
        var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

        if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
          return;
        }

        ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
        // property, it may be the creator of the child that's responsible for
        // assigning it a key.

        var childOwner = '';

        if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
          // Give the component that originally created this child.
          childOwner = ' It was passed a child from ' + getComponentName(element._owner) + '.';
        }

        currentlyValidatingElement = element;
        {
          warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getStackAddendum());
        }
        currentlyValidatingElement = null;
      }
      /**
       * Ensure that every element either is passed in a static location, in an
       * array with an explicit keys property defined, or in an object literal
       * with valid key property.
       *
       * @internal
       * @param {ReactNode} node Statically passed child of any type.
       * @param {*} parentType node's parent's type.
       */


      function validateChildKeys(node, parentType) {
        if (_typeof(node) !== 'object') {
          return;
        }

        if (Array.isArray(node)) {
          for (var i = 0; i < node.length; i++) {
            var child = node[i];

            if (isValidElement(child)) {
              validateExplicitKey(child, parentType);
            }
          }
        } else if (isValidElement(node)) {
          // This element was passed in a valid location.
          if (node._store) {
            node._store.validated = true;
          }
        } else if (node) {
          var iteratorFn = getIteratorFn(node);

          if (typeof iteratorFn === 'function') {
            // Entry iterators used to provide implicit keys,
            // but now we print a separate warning for them later.
            if (iteratorFn !== node.entries) {
              var iterator = iteratorFn.call(node);
              var step;

              while (!(step = iterator.next()).done) {
                if (isValidElement(step.value)) {
                  validateExplicitKey(step.value, parentType);
                }
              }
            }
          }
        }
      }
      /**
       * Given an element, validate that its props follow the propTypes definition,
       * provided by the type.
       *
       * @param {ReactElement} element
       */


      function validatePropTypes(element) {
        var componentClass = element.type;

        if (typeof componentClass !== 'function') {
          return;
        }

        var name = componentClass.displayName || componentClass.name;
        var propTypes = componentClass.propTypes;

        if (propTypes) {
          currentlyValidatingElement = element;
          checkPropTypes(propTypes, element.props, 'prop', name, getStackAddendum);
          currentlyValidatingElement = null;
        } else if (componentClass.PropTypes !== undefined && !propTypesMisspellWarningShown) {
          propTypesMisspellWarningShown = true;
          warning(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
        }

        if (typeof componentClass.getDefaultProps === 'function') {
          warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
        }
      }
      /**
       * Given a fragment, validate that it can only be provided with fragment props
       * @param {ReactElement} fragment
       */


      function validateFragmentProps(fragment) {
        currentlyValidatingElement = fragment;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(fragment.props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (!VALID_FRAGMENT_PROPS.has(key)) {
              warning(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.%s', key, getStackAddendum());
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (fragment.ref !== null) {
          warning(false, 'Invalid attribute `ref` supplied to `React.Fragment`.%s', getStackAddendum());
        }

        currentlyValidatingElement = null;
      }

      function createElementWithValidation(type, props, children) {
        var validType = typeof type === 'string' || typeof type === 'function' || _typeof(type) === 'symbol' || typeof type === 'number'; // We warn in this case but don't throw. We expect the element creation to
        // succeed and there will likely be errors in render.

        if (!validType) {
          var info = '';

          if (type === undefined || _typeof(type) === 'object' && type !== null && Object.keys(type).length === 0) {
            info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
          }

          var sourceInfo = getSourceInfoErrorAddendum(props);

          if (sourceInfo) {
            info += sourceInfo;
          } else {
            info += getDeclarationErrorAddendum();
          }

          info += getStackAddendum() || '';
          warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : _typeof(type), info);
        }

        var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
        // TODO: Drop this when these are no longer allowed as the type argument.

        if (element == null) {
          return element;
        } // Skip key warning if the type isn't valid since our key validation logic
        // doesn't expect a non-string/function type and can throw confusing errors.
        // We don't want exception behavior to differ between dev and prod.
        // (Rendering will throw with a helpful message and as soon as the type is
        // fixed, the key warnings will appear.)


        if (validType) {
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], type);
          }
        }

        if (_typeof(type) === 'symbol' && type === REACT_FRAGMENT_TYPE) {
          validateFragmentProps(element);
        } else {
          validatePropTypes(element);
        }

        return element;
      }

      function createFactoryWithValidation(type) {
        var validatedFactory = createElementWithValidation.bind(null, type); // Legacy hook TODO: Warn if this is accessed

        validatedFactory.type = type;
        {
          Object.defineProperty(validatedFactory, 'type', {
            enumerable: false,
            get: function get() {
              lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
              Object.defineProperty(this, 'type', {
                value: type
              });
              return type;
            }
          });
        }
        return validatedFactory;
      }

      function cloneElementWithValidation(element, props, children) {
        var newElement = cloneElement.apply(this, arguments);

        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], newElement.type);
        }

        validatePropTypes(newElement);
        return newElement;
      }

      var React = {
        Children: {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray: toArray,
          only: onlyChild
        },
        Component: Component,
        PureComponent: PureComponent,
        unstable_AsyncComponent: AsyncComponent,
        Fragment: REACT_FRAGMENT_TYPE,
        createElement: createElementWithValidation,
        cloneElement: cloneElementWithValidation,
        createFactory: createFactoryWithValidation,
        isValidElement: isValidElement,
        version: ReactVersion,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
          ReactCurrentOwner: ReactCurrentOwner,
          // Used by renderers to avoid bundling object-assign twice in UMD bundles:
          assign: _assign
        }
      };
      {
        _assign(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
          // These should not be included in production.
          ReactDebugCurrentFrame: ReactDebugCurrentFrame,
          // Shim for React DOM 16.0.0 which still destructured (but not used) this.
          // TODO: remove in React 17.0.
          ReactComponentTreeHook: {}
        });
      }
      var React$2 = Object.freeze({
        default: React
      });
      var React$3 = React$2 && React || React$2; // TODO: decide on the top-level export form.
      // This is hacky but makes it work with both Rollup and Jest.

      var react = React$3['default'] ? React$3['default'] : React$3;
      module.exports = react;
    })();
  }
});

var react = createCommonjsModule(function (module) {

  {
    module.exports = react_development;
  }
});

var allLocaleData = {};

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

var extend_1 = extend;
var hop = Object.prototype.hasOwnProperty;

function extend(obj) {
  var sources = Array.prototype.slice.call(arguments, 1),
      i,
      len,
      source,
      key;

  for (i = 0, len = sources.length; i < len; i += 1) {
    source = sources[i];

    if (!source) {
      continue;
    }

    for (key in source) {
      if (hop.call(source, key)) {
        obj[key] = source[key];
      }
    }
  }

  return obj;
}

var hop_1 = hop;
var utils = {
  extend: extend_1,
  hop: hop_1
};

var es5 = createCommonjsModule(function (module, exports) {
  // Copyright 2013 Andy Earnshaw, MIT License

  var realDefineProp = function () {
    try {
      return !!Object.defineProperty({}, 'a', {});
    } catch (e) {
      return false;
    }
  }();
  var defineProperty = realDefineProp ? Object.defineProperty : function (obj, name, desc) {
    if ('get' in desc && obj.__defineGetter__) {
      obj.__defineGetter__(name, desc.get);
    } else if (!utils.hop.call(obj, name) || 'value' in desc) {
      obj[name] = desc.value;
    }
  };

  var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}

    F.prototype = proto;
    obj = new F();

    for (k in props) {
      if (utils.hop.call(props, k)) {
        defineProperty(obj, k, props[k]);
      }
    }

    return obj;
  };

  exports.defineProperty = defineProperty, exports.objCreate = objCreate;
});

var compiler = createCommonjsModule(function (module, exports) {

  exports["default"] = Compiler;

  function Compiler(locales, formats, pluralFn) {
    this.locales = locales;
    this.formats = formats;
    this.pluralFn = pluralFn;
  }

  Compiler.prototype.compile = function (ast) {
    this.pluralStack = [];
    this.currentPlural = null;
    this.pluralNumberFormat = null;
    return this.compileMessage(ast);
  };

  Compiler.prototype.compileMessage = function (ast) {
    if (!(ast && ast.type === 'messageFormatPattern')) {
      throw new Error('Message AST is not of type: "messageFormatPattern"');
    }

    var elements = ast.elements,
        pattern = [];
    var i, len, element;

    for (i = 0, len = elements.length; i < len; i += 1) {
      element = elements[i];

      switch (element.type) {
        case 'messageTextElement':
          pattern.push(this.compileMessageText(element));
          break;

        case 'argumentElement':
          pattern.push(this.compileArgument(element));
          break;

        default:
          throw new Error('Message element does not have a valid type');
      }
    }

    return pattern;
  };

  Compiler.prototype.compileMessageText = function (element) {
    // When this `element` is part of plural sub-pattern and its value contains
    // an unescaped '#', use a `PluralOffsetString` helper to properly output
    // the number with the correct offset in the string.
    if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
      // Create a cache a NumberFormat instance that can be reused for any
      // PluralOffsetString instance in this message.
      if (!this.pluralNumberFormat) {
        this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
      }

      return new PluralOffsetString(this.currentPlural.id, this.currentPlural.format.offset, this.pluralNumberFormat, element.value);
    } // Unescape the escaped '#'s in the message text.


    return element.value.replace(/\\#/g, '#');
  };

  Compiler.prototype.compileArgument = function (element) {
    var format = element.format;

    if (!format) {
      return new StringFormat(element.id);
    }

    var formats = this.formats,
        locales = this.locales,
        pluralFn = this.pluralFn,
        options;

    switch (format.type) {
      case 'numberFormat':
        options = formats.number[format.style];
        return {
          id: element.id,
          format: new Intl.NumberFormat(locales, options).format
        };

      case 'dateFormat':
        options = formats.date[format.style];
        return {
          id: element.id,
          format: new Intl.DateTimeFormat(locales, options).format
        };

      case 'timeFormat':
        options = formats.time[format.style];
        return {
          id: element.id,
          format: new Intl.DateTimeFormat(locales, options).format
        };

      case 'pluralFormat':
        options = this.compileOptions(element);
        return new PluralFormat(element.id, format.ordinal, format.offset, options, pluralFn);

      case 'selectFormat':
        options = this.compileOptions(element);
        return new SelectFormat(element.id, options);

      default:
        throw new Error('Message element does not have a valid format type');
    }
  };

  Compiler.prototype.compileOptions = function (element) {
    var format = element.format,
        options = format.options,
        optionsHash = {}; // Save the current plural element, if any, then set it to a new value when
    // compiling the options sub-patterns. This conforms the spec's algorithm
    // for handling `"#"` syntax in message text.

    this.pluralStack.push(this.currentPlural);
    this.currentPlural = format.type === 'pluralFormat' ? element : null;
    var i, len, option;

    for (i = 0, len = options.length; i < len; i += 1) {
      option = options[i]; // Compile the sub-pattern and save it under the options's selector.

      optionsHash[option.selector] = this.compileMessage(option.value);
    } // Pop the plural stack to put back the original current plural value.


    this.currentPlural = this.pluralStack.pop();
    return optionsHash;
  }; // -- Compiler Helper Classes --------------------------------------------------


  function StringFormat(id) {
    this.id = id;
  }

  StringFormat.prototype.format = function (value) {
    if (!value && typeof value !== 'number') {
      return '';
    }

    return typeof value === 'string' ? value : String(value);
  };

  function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
    this.id = id;
    this.useOrdinal = useOrdinal;
    this.offset = offset;
    this.options = options;
    this.pluralFn = pluralFn;
  }

  PluralFormat.prototype.getOption = function (value) {
    var options = this.options;
    var option = options['=' + value] || options[this.pluralFn(value - this.offset, this.useOrdinal)];
    return option || options.other;
  };

  function PluralOffsetString(id, offset, numberFormat, string) {
    this.id = id;
    this.offset = offset;
    this.numberFormat = numberFormat;
    this.string = string;
  }

  PluralOffsetString.prototype.format = function (value) {
    var number = this.numberFormat.format(value - this.offset);
    return this.string.replace(/(^|[^\\])#/g, '$1' + number).replace(/\\#/g, '#');
  };

  function SelectFormat(id, options) {
    this.id = id;
    this.options = options;
  }

  SelectFormat.prototype.getOption = function (value) {
    var options = this.options;
    return options[value] || options.other;
  };
});

var parser = createCommonjsModule(function (module, exports) {

  exports["default"] = function () {
    /*
     * Generated by PEG.js 0.9.0.
     *
     * http://pegjs.org/
     */

    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }

      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = "SyntaxError";

      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }

    peg$subclass(peg$SyntaxError, Error);

    function peg$parse(input) {
      var options = arguments.length > 1 ? arguments[1] : {},
          peg$FAILED = {},
          peg$startRuleFunctions = {
        start: peg$parsestart
      },
          peg$startRuleFunction = peg$parsestart,
          peg$c0 = function peg$c0(elements) {
        return {
          type: 'messageFormatPattern',
          elements: elements,
          location: location()
        };
      },
          peg$c1 = function peg$c1(text) {
        var string = '',
            i,
            j,
            outerLen,
            inner,
            innerLen;

        for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
          inner = text[i];

          for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
            string += inner[j];
          }
        }

        return string;
      },
          peg$c2 = function peg$c2(messageText) {
        return {
          type: 'messageTextElement',
          value: messageText,
          location: location()
        };
      },
          peg$c3 = /^[^ \t\n\r,.+={}#]/,
          peg$c4 = {
        type: "class",
        value: "[^ \\t\\n\\r,.+={}#]",
        description: "[^ \\t\\n\\r,.+={}#]"
      },
          peg$c5 = "{",
          peg$c6 = {
        type: "literal",
        value: "{",
        description: "\"{\""
      },
          peg$c7 = ",",
          peg$c8 = {
        type: "literal",
        value: ",",
        description: "\",\""
      },
          peg$c9 = "}",
          peg$c10 = {
        type: "literal",
        value: "}",
        description: "\"}\""
      },
          peg$c11 = function peg$c11(id, format) {
        return {
          type: 'argumentElement',
          id: id,
          format: format && format[2],
          location: location()
        };
      },
          peg$c12 = "number",
          peg$c13 = {
        type: "literal",
        value: "number",
        description: "\"number\""
      },
          peg$c14 = "date",
          peg$c15 = {
        type: "literal",
        value: "date",
        description: "\"date\""
      },
          peg$c16 = "time",
          peg$c17 = {
        type: "literal",
        value: "time",
        description: "\"time\""
      },
          peg$c18 = function peg$c18(type, style) {
        return {
          type: type + 'Format',
          style: style && style[2],
          location: location()
        };
      },
          peg$c19 = "plural",
          peg$c20 = {
        type: "literal",
        value: "plural",
        description: "\"plural\""
      },
          peg$c21 = function peg$c21(pluralStyle) {
        return {
          type: pluralStyle.type,
          ordinal: false,
          offset: pluralStyle.offset || 0,
          options: pluralStyle.options,
          location: location()
        };
      },
          peg$c22 = "selectordinal",
          peg$c23 = {
        type: "literal",
        value: "selectordinal",
        description: "\"selectordinal\""
      },
          peg$c24 = function peg$c24(pluralStyle) {
        return {
          type: pluralStyle.type,
          ordinal: true,
          offset: pluralStyle.offset || 0,
          options: pluralStyle.options,
          location: location()
        };
      },
          peg$c25 = "select",
          peg$c26 = {
        type: "literal",
        value: "select",
        description: "\"select\""
      },
          peg$c27 = function peg$c27(options) {
        return {
          type: 'selectFormat',
          options: options,
          location: location()
        };
      },
          peg$c28 = "=",
          peg$c29 = {
        type: "literal",
        value: "=",
        description: "\"=\""
      },
          peg$c30 = function peg$c30(selector, pattern) {
        return {
          type: 'optionalFormatPattern',
          selector: selector,
          value: pattern,
          location: location()
        };
      },
          peg$c31 = "offset:",
          peg$c32 = {
        type: "literal",
        value: "offset:",
        description: "\"offset:\""
      },
          peg$c33 = function peg$c33(number) {
        return number;
      },
          peg$c34 = function peg$c34(offset, options) {
        return {
          type: 'pluralFormat',
          offset: offset,
          options: options,
          location: location()
        };
      },
          peg$c35 = {
        type: "other",
        description: "whitespace"
      },
          peg$c36 = /^[ \t\n\r]/,
          peg$c37 = {
        type: "class",
        value: "[ \\t\\n\\r]",
        description: "[ \\t\\n\\r]"
      },
          peg$c38 = {
        type: "other",
        description: "optionalWhitespace"
      },
          peg$c39 = /^[0-9]/,
          peg$c40 = {
        type: "class",
        value: "[0-9]",
        description: "[0-9]"
      },
          peg$c41 = /^[0-9a-f]/i,
          peg$c42 = {
        type: "class",
        value: "[0-9a-f]i",
        description: "[0-9a-f]i"
      },
          peg$c43 = "0",
          peg$c44 = {
        type: "literal",
        value: "0",
        description: "\"0\""
      },
          peg$c45 = /^[1-9]/,
          peg$c46 = {
        type: "class",
        value: "[1-9]",
        description: "[1-9]"
      },
          peg$c47 = function peg$c47(digits) {
        return parseInt(digits, 10);
      },
          peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
          peg$c49 = {
        type: "class",
        value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]",
        description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]"
      },
          peg$c50 = "\\\\",
          peg$c51 = {
        type: "literal",
        value: "\\\\",
        description: "\"\\\\\\\\\""
      },
          peg$c52 = function peg$c52() {
        return '\\';
      },
          peg$c53 = "\\#",
          peg$c54 = {
        type: "literal",
        value: "\\#",
        description: "\"\\\\#\""
      },
          peg$c55 = function peg$c55() {
        return '\\#';
      },
          peg$c56 = "\\{",
          peg$c57 = {
        type: "literal",
        value: "\\{",
        description: "\"\\\\{\""
      },
          peg$c58 = function peg$c58() {
        return "{";
      },
          peg$c59 = "\\}",
          peg$c60 = {
        type: "literal",
        value: "\\}",
        description: "\"\\\\}\""
      },
          peg$c61 = function peg$c61() {
        return "}";
      },
          peg$c62 = "\\u",
          peg$c63 = {
        type: "literal",
        value: "\\u",
        description: "\"\\\\u\""
      },
          peg$c64 = function peg$c64(digits) {
        return String.fromCharCode(parseInt(digits, 16));
      },
          peg$c65 = function peg$c65(chars) {
        return chars.join('');
      },
          peg$currPos = 0,
          peg$savedPos = 0,
          peg$posDetailsCache = [{
        line: 1,
        column: 1,
        seenCR: false
      }],
          peg$maxFailPos = 0,
          peg$maxFailExpected = [],
          peg$silentFails = 0,
          peg$result;

      if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }

        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }

      function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
      }

      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos],
            p,
            ch;

        if (details) {
          return details;
        } else {
          p = pos - 1;

          while (!peg$posDetailsCache[p]) {
            p--;
          }

          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column,
            seenCR: details.seenCR
          };

          while (p < pos) {
            ch = input.charAt(p);

            if (ch === "\n") {
              if (!details.seenCR) {
                details.line++;
              }

              details.column = 1;
              details.seenCR = false;
            } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
              details.line++;
              details.column = 1;
              details.seenCR = true;
            } else {
              details.column++;
              details.seenCR = false;
            }

            p++;
          }

          peg$posDetailsCache[pos] = details;
          return details;
        }
      }

      function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos),
            endPosDetails = peg$computePosDetails(endPos);
        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
      }

      function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }

        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }

        peg$maxFailExpected.push(expected);
      }

      function peg$buildException(message, expected, found, location) {
        function cleanupExpected(expected) {
          var i = 1;
          expected.sort(function (a, b) {
            if (a.description < b.description) {
              return -1;
            } else if (a.description > b.description) {
              return 1;
            } else {
              return 0;
            }
          });

          while (i < expected.length) {
            if (expected[i - 1] === expected[i]) {
              expected.splice(i, 1);
            } else {
              i++;
            }
          }
        }

        function buildMessage(expected, found) {
          function stringEscape(s) {
            function hex(ch) {
              return ch.charCodeAt(0).toString(16).toUpperCase();
            }

            return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
              return '\\x0' + hex(ch);
            }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
              return '\\x' + hex(ch);
            }).replace(/[\u0100-\u0FFF]/g, function (ch) {
              return "\\u0" + hex(ch);
            }).replace(/[\u1000-\uFFFF]/g, function (ch) {
              return "\\u" + hex(ch);
            });
          }

          var expectedDescs = new Array(expected.length),
              expectedDesc,
              foundDesc,
              i;

          for (i = 0; i < expected.length; i++) {
            expectedDescs[i] = expected[i].description;
          }

          expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected.length - 1] : expectedDescs[0];
          foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";
          return "Expected " + expectedDesc + " but " + foundDesc + " found.";
        }

        if (expected !== null) {
          cleanupExpected(expected);
        }

        return new peg$SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, location);
      }

      function peg$parsestart() {
        var s0;
        s0 = peg$parsemessageFormatPattern();
        return s0;
      }

      function peg$parsemessageFormatPattern() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsemessageFormatElement();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsemessageFormatElement();
        }

        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parsemessageFormatElement() {
        var s0;
        s0 = peg$parsemessageTextElement();

        if (s0 === peg$FAILED) {
          s0 = peg$parseargumentElement();
        }

        return s0;
      }

      function peg$parsemessageText() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$parse_();

        if (s3 !== peg$FAILED) {
          s4 = peg$parsechars();

          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();

            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            s3 = peg$parse_();

            if (s3 !== peg$FAILED) {
              s4 = peg$parsechars();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();

                if (s5 !== peg$FAILED) {
                  s3 = [s3, s4, s5];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c1(s1);
        }

        s0 = s1;

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsews();

          if (s1 !== peg$FAILED) {
            s0 = input.substring(s0, peg$currPos);
          } else {
            s0 = s1;
          }
        }

        return s0;
      }

      function peg$parsemessageTextElement() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parsemessageText();

        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parseargument() {
        var s0, s1, s2;
        s0 = peg$parsenumber();

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = [];

          if (peg$c3.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c4);
            }
          }

          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);

              if (peg$c3.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c4);
                }
              }
            }
          } else {
            s1 = peg$FAILED;
          }

          if (s1 !== peg$FAILED) {
            s0 = input.substring(s0, peg$currPos);
          } else {
            s0 = s1;
          }
        }

        return s0;
      }

      function peg$parseargumentElement() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();

          if (s2 !== peg$FAILED) {
            s3 = peg$parseargument();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();

              if (s4 !== peg$FAILED) {
                s5 = peg$currPos;

                if (input.charCodeAt(peg$currPos) === 44) {
                  s6 = peg$c7;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c8);
                  }
                }

                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();

                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseelementFormat();

                    if (s8 !== peg$FAILED) {
                      s6 = [s6, s7, s8];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }

                if (s5 === peg$FAILED) {
                  s5 = null;
                }

                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();

                  if (s6 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s7 = peg$c9;
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;

                      if (peg$silentFails === 0) {
                        peg$fail(peg$c10);
                      }
                    }

                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c11(s3, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseelementFormat() {
        var s0;
        s0 = peg$parsesimpleFormat();

        if (s0 === peg$FAILED) {
          s0 = peg$parsepluralFormat();

          if (s0 === peg$FAILED) {
            s0 = peg$parseselectOrdinalFormat();

            if (s0 === peg$FAILED) {
              s0 = peg$parseselectFormat();
            }
          }
        }

        return s0;
      }

      function peg$parsesimpleFormat() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 6) === peg$c12) {
          s1 = peg$c12;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c13);
          }
        }

        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c14) {
            s1 = peg$c14;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c15);
            }
          }

          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c16) {
              s1 = peg$c16;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c17);
              }
            }
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();

          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;

            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c7;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }

            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();

              if (s5 !== peg$FAILED) {
                s6 = peg$parsechars();

                if (s6 !== peg$FAILED) {
                  s4 = [s4, s5, s6];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c18(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsepluralFormat() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 6) === peg$c19) {
          s1 = peg$c19;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c20);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c7;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();

              if (s4 !== peg$FAILED) {
                s5 = peg$parsepluralStyle();

                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c21(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseselectOrdinalFormat() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 13) === peg$c22) {
          s1 = peg$c22;
          peg$currPos += 13;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c23);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c7;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();

              if (s4 !== peg$FAILED) {
                s5 = peg$parsepluralStyle();

                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c24(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseselectFormat() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 6) === peg$c25) {
          s1 = peg$c25;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c26);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c7;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();

              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseoptionalFormatPattern();

                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parseoptionalFormatPattern();
                  }
                } else {
                  s5 = peg$FAILED;
                }

                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c27(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseselector() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c28;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c29);
          }
        }

        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();

          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$parsechars();
        }

        return s0;
      }

      function peg$parseoptionalFormatPattern() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parse_();

        if (s1 !== peg$FAILED) {
          s2 = peg$parseselector();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_();

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 123) {
                s4 = peg$c5;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c6);
                }
              }

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsemessageFormatPattern();

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_();

                    if (s7 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s8 = peg$c9;
                        peg$currPos++;
                      } else {
                        s8 = peg$FAILED;

                        if (peg$silentFails === 0) {
                          peg$fail(peg$c10);
                        }
                      }

                      if (s8 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c30(s2, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseoffset() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 7) === peg$c31) {
          s1 = peg$c31;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c32);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();

          if (s2 !== peg$FAILED) {
            s3 = peg$parsenumber();

            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c33(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsepluralStyle() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parseoffset();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseoptionalFormatPattern();

            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseoptionalFormatPattern();
              }
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c34(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsews() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];

        if (peg$c36.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c37);
          }
        }

        if (s1 !== peg$FAILED) {
          while (s1 !== peg$FAILED) {
            s0.push(s1);

            if (peg$c36.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c37);
              }
            }
          }
        } else {
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c35);
          }
        }

        return s0;
      }

      function peg$parse_() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsews();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsews();
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c38);
          }
        }

        return s0;
      }

      function peg$parsedigit() {
        var s0;

        if (peg$c39.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c40);
          }
        }

        return s0;
      }

      function peg$parsehexDigit() {
        var s0;

        if (peg$c41.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c42);
          }
        }

        return s0;
      }

      function peg$parsenumber() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 48) {
          s1 = peg$c43;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c44);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = peg$currPos;
          s2 = peg$currPos;

          if (peg$c45.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c46);
            }
          }

          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsedigit();

            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsedigit();
            }

            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = input.substring(s1, peg$currPos);
          } else {
            s1 = s2;
          }
        }

        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c47(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parsechar() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        if (peg$c48.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c49);
          }
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;

          if (input.substr(peg$currPos, 2) === peg$c50) {
            s1 = peg$c50;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c51);
            }
          }

          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c52();
          }

          s0 = s1;

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;

            if (input.substr(peg$currPos, 2) === peg$c53) {
              s1 = peg$c53;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c54);
              }
            }

            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c55();
            }

            s0 = s1;

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;

              if (input.substr(peg$currPos, 2) === peg$c56) {
                s1 = peg$c56;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c57);
                }
              }

              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c58();
              }

              s0 = s1;

              if (s0 === peg$FAILED) {
                s0 = peg$currPos;

                if (input.substr(peg$currPos, 2) === peg$c59) {
                  s1 = peg$c59;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c60);
                  }
                }

                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c61();
                }

                s0 = s1;

                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;

                  if (input.substr(peg$currPos, 2) === peg$c62) {
                    s1 = peg$c62;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c63);
                    }
                  }

                  if (s1 !== peg$FAILED) {
                    s2 = peg$currPos;
                    s3 = peg$currPos;
                    s4 = peg$parsehexDigit();

                    if (s4 !== peg$FAILED) {
                      s5 = peg$parsehexDigit();

                      if (s5 !== peg$FAILED) {
                        s6 = peg$parsehexDigit();

                        if (s6 !== peg$FAILED) {
                          s7 = peg$parsehexDigit();

                          if (s7 !== peg$FAILED) {
                            s4 = [s4, s5, s6, s7];
                            s3 = s4;
                          } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }

                    if (s3 !== peg$FAILED) {
                      s2 = input.substring(s2, peg$currPos);
                    } else {
                      s2 = s3;
                    }

                    if (s2 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c64(s2);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                }
              }
            }
          }
        }

        return s0;
      }

      function peg$parsechars() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsechar();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsechar();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c65(s1);
        }

        s0 = s1;
        return s0;
      }

      peg$result = peg$startRuleFunction();

      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail({
            type: "end",
            description: "end of input"
          });
        }

        throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
      }
    }

    return {
      SyntaxError: peg$SyntaxError,
      parse: peg$parse
    };
  }();
});

var intlMessageformatParser = createCommonjsModule(function (module, exports) {

  exports = module.exports = parser['default'];
  exports['default'] = exports;
});

var core = createCommonjsModule(function (module, exports) {

  exports["default"] = MessageFormat; // -- MessageFormat --------------------------------------------------------

  function MessageFormat(message, locales, formats) {
    // Parse string messages into an AST.
    var ast = typeof message === 'string' ? MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
      throw new TypeError('A message must be provided as a String or AST.');
    } // Creates a new object with the specified `formats` merged with the default
    // formats.


    formats = this._mergeFormats(MessageFormat.formats, formats); // Defined first because it's used to build the format pattern.

    es5.defineProperty(this, '_locale', {
      value: this._resolveLocale(locales)
    }); // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.

    var pluralFn = this._findPluralRuleFunction(this._locale);

    var pattern = this._compilePattern(ast, locales, formats, pluralFn); // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.


    var messageFormat = this;

    this.format = function (values) {
      try {
        return messageFormat._format(pattern, values);
      } catch (e) {
        if (e.variableId) {
          throw new Error('The intl string context variable \'' + e.variableId + '\'' + ' was not provided to the string \'' + message + '\'');
        } else {
          throw e;
        }
      }
    };
  } // Default format options used as the prototype of the `formats` provided to the
  // constructor. These are used when constructing the internal Intl.NumberFormat
  // and Intl.DateTimeFormat instances.


  es5.defineProperty(MessageFormat, 'formats', {
    enumerable: true,
    value: {
      number: {
        'currency': {
          style: 'currency'
        },
        'percent': {
          style: 'percent'
        }
      },
      date: {
        'short': {
          month: 'numeric',
          day: 'numeric',
          year: '2-digit'
        },
        'medium': {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        },
        'long': {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        },
        'full': {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }
      },
      time: {
        'short': {
          hour: 'numeric',
          minute: 'numeric'
        },
        'medium': {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        },
        'long': {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short'
        },
        'full': {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short'
        }
      }
    }
  }); // Define internal private properties for dealing with locale data.

  es5.defineProperty(MessageFormat, '__localeData__', {
    value: es5.objCreate(null)
  });
  es5.defineProperty(MessageFormat, '__addLocaleData', {
    value: function value(data) {
      if (!(data && data.locale)) {
        throw new Error('Locale data provided to IntlMessageFormat is missing a ' + '`locale` property');
      }

      MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
    }
  }); // Defines `__parse()` static method as an exposed private.

  es5.defineProperty(MessageFormat, '__parse', {
    value: intlMessageformatParser["default"].parse
  }); // Define public `defaultLocale` property which defaults to English, but can be
  // set by the developer.

  es5.defineProperty(MessageFormat, 'defaultLocale', {
    enumerable: true,
    writable: true,
    value: undefined
  });

  MessageFormat.prototype.resolvedOptions = function () {
    // TODO: Provide anything else?
    return {
      locale: this._locale
    };
  };

  MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
    var compiler$1 = new compiler["default"](locales, formats, pluralFn);
    return compiler$1.compile(ast);
  };

  MessageFormat.prototype._findPluralRuleFunction = function (locale) {
    var localeData = MessageFormat.__localeData__;
    var data = localeData[locale.toLowerCase()]; // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find a `pluralRuleFunction` to return.

    while (data) {
      if (data.pluralRuleFunction) {
        return data.pluralRuleFunction;
      }

      data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error('Locale data added to IntlMessageFormat is missing a ' + '`pluralRuleFunction` for :' + locale);
  };

  MessageFormat.prototype._format = function (pattern, values) {
    var result = '',
        i,
        len,
        part,
        id,
        value,
        err;

    for (i = 0, len = pattern.length; i < len; i += 1) {
      part = pattern[i]; // Exist early for string parts.

      if (typeof part === 'string') {
        result += part;
        continue;
      }

      id = part.id; // Enforce that all required values are provided by the caller.

      if (!(values && utils.hop.call(values, id))) {
        err = new Error('A value must be provided for: ' + id);
        err.variableId = id;
        throw err;
      }

      value = values[id]; // Recursively format plural and select parts' option — which can be a
      // nested pattern structure. The choosing of the option to use is
      // abstracted-by and delegated-to the part helper object.

      if (part.options) {
        result += this._format(part.getOption(value), values);
      } else {
        result += part.format(value);
      }
    }

    return result;
  };

  MessageFormat.prototype._mergeFormats = function (defaults, formats) {
    var mergedFormats = {},
        type,
        mergedType;

    for (type in defaults) {
      if (!utils.hop.call(defaults, type)) {
        continue;
      }

      mergedFormats[type] = mergedType = es5.objCreate(defaults[type]);

      if (formats && utils.hop.call(formats, type)) {
        utils.extend(mergedType, formats[type]);
      }
    }

    return mergedFormats;
  };

  MessageFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
      locales = [locales];
    } // Create a copy of the array so we can push on the default locale.


    locales = (locales || []).concat(MessageFormat.defaultLocale);
    var localeData = MessageFormat.__localeData__;
    var i, len, localeParts, data; // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.

    for (i = 0, len = locales.length; i < len; i += 1) {
      localeParts = locales[i].toLowerCase().split('-');

      while (localeParts.length) {
        data = localeData[localeParts.join('-')];

        if (data) {
          // Return the normalized locale string; e.g., we return "en-US",
          // instead of "en-us".
          return data.locale;
        }

        localeParts.pop();
      }
    }

    var defaultLocale = locales.pop();
    throw new Error('No locale data has been added to IntlMessageFormat for: ' + locales.join(', ') + ', or the default locale: ' + defaultLocale);
  };
});

var en = createCommonjsModule(function (module, exports) {

  exports["default"] = {
    "locale": "en",
    "pluralRuleFunction": function pluralRuleFunction(n, ord) {
      var s = String(n).split("."),
          v0 = !s[1],
          t0 = Number(s[0]) == n,
          n10 = t0 && s[0].slice(-1),
          n100 = t0 && s[0].slice(-2);
      if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";
      return n == 1 && v0 ? "one" : "other";
    }
  };
});

var main = createCommonjsModule(function (module, exports) {

  core["default"].__addLocaleData(en["default"]);

  core["default"].defaultLocale = 'en';
  exports["default"] = core["default"];
});

var intlMessageformat = createCommonjsModule(function (module, exports) {

  var IntlMessageFormat = main['default']; // Add all locale data to `IntlMessageFormat`. This module will be ignored when
  // bundling for the browser with Browserify/Webpack.
  // Re-export `IntlMessageFormat` as the CommonJS default exports with all the
  // locale data registered, and with English set as the default locale. Define
  // the `default` prop for use with other compiled ES6 Modules.

  exports = module.exports = IntlMessageFormat;
  exports['default'] = exports;
});

var diff = createCommonjsModule(function (module, exports) {
  /*
  Copyright (c) 2014, Yahoo! Inc. All rights reserved.
  Copyrights licensed under the New BSD License.
  See the accompanying LICENSE file for terms.
  */

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* jslint esnext: true */

  var round = Math.round;

  function daysToYears(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return days * 400 / 146097;
  } // Thanks to date-fns
  // https://github.com/date-fns/date-fns
  // MIT © Sasha Koss


  var MILLISECONDS_IN_MINUTE = 60000;
  var MILLISECONDS_IN_DAY = 86400000;

  function startOfDay(dirtyDate) {
    var date = new Date(dirtyDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
    var startOfDayLeft = startOfDay(dirtyDateLeft);
    var startOfDayRight = startOfDay(dirtyDateRight);
    var timestampLeft = startOfDayLeft.getTime() - startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
    var timestampRight = startOfDayRight.getTime() - startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE; // Round the number of days to the nearest integer
    // because the number of milliseconds in a day is not constant
    // (e.g. it's different in the day of the daylight saving time clock shift)

    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
  }

  function default_1(from, to) {
    // Convert to ms timestamps.
    from = +from;
    to = +to;
    var millisecond = round(to - from),
        second = round(millisecond / 1000),
        minute = round(second / 60),
        hour = round(minute / 60); // We expect a more precision in rounding when dealing with
    // days as it feels wrong when something happended 13 hours ago and
    // is regarded as "yesterday" even if the time was this morning.

    var day = differenceInCalendarDays(to, from);
    var week = round(day / 7);
    var rawYears = daysToYears(day),
        month = round(rawYears * 12),
        year = round(rawYears);
    return {
      millisecond: millisecond,
      second: second,
      'second-short': second,
      minute: minute,
      'minute-short': minute,
      hour: hour,
      'hour-short': hour,
      day: day,
      'day-short': day,
      week: week,
      'week-short': week,
      month: month,
      'month-short': month,
      year: year,
      'year-short': year
    };
  }

  exports.default = default_1;
});

var es5$1 = createCommonjsModule(function (module, exports) {
  /*
  Copyright (c) 2014, Yahoo! Inc. All rights reserved.
  Copyrights licensed under the New BSD License.
  See the accompanying LICENSE file for terms.
  */

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* jslint esnext: true */
  // Purposely using the same implementation as the Intl.js `Intl` polyfill.
  // Copyright 2013 Andy Earnshaw, MIT License

  var hop = Object.prototype.hasOwnProperty;
  var toString = Object.prototype.toString;

  var realDefineProp = function () {
    try {
      return !!Object.defineProperty({}, 'a', {});
    } catch (e) {
      return false;
    }
  }();
  var defineProperty = realDefineProp ? Object.defineProperty : function (obj, name, desc) {
    if ('get' in desc && obj.__defineGetter__) {
      obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
      obj[name] = desc.value;
    }
  };
  exports.defineProperty = defineProperty;

  var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}

    F.prototype = proto;
    obj = new F();

    for (k in props) {
      if (hop.call(props, k)) {
        defineProperty(obj, k, props[k]);
      }
    }

    return obj;
  };

  exports.objCreate = objCreate;

  var arrIndexOf = Array.prototype.indexOf || function (search, fromIndex) {
    /*jshint validthis:true */
    var arr = this;

    if (!arr.length) {
      return -1;
    }

    for (var i = fromIndex || 0, max = arr.length; i < max; i++) {
      if (arr[i] === search) {
        return i;
      }
    }

    return -1;
  };

  exports.arrIndexOf = arrIndexOf;

  var isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
  };

  exports.isArray = isArray;

  var dateNow = Date.now || function () {
    return new Date().getTime();
  };

  exports.dateNow = dateNow;
});

var core$1 = createCommonjsModule(function (module, exports) {
  /*
  Copyright (c) 2014, Yahoo! Inc. All rights reserved.
  Copyrights licensed under the New BSD License.
  See the accompanying LICENSE file for terms.
  */

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* jslint esnext: true */

  exports.default = RelativeFormat; // -----------------------------------------------------------------------------

  var FIELDS = ['second', 'second-short', 'minute', 'minute-short', 'hour', 'hour-short', 'day', 'day-short', 'month', 'month-short', 'year', 'year-short'];
  var STYLES = ['best fit', 'numeric']; // -- RelativeFormat -----------------------------------------------------------

  function RelativeFormat(locales, options) {
    options = options || {}; // Make a copy of `locales` if it's an array, so that it doesn't change
    // since it's used lazily.

    if (es5$1.isArray(locales)) {
      locales = locales.concat();
    }

    es5$1.defineProperty(this, '_locale', {
      value: this._resolveLocale(locales)
    });
    es5$1.defineProperty(this, '_options', {
      value: {
        style: this._resolveStyle(options.style),
        units: this._isValidUnits(options.units) && options.units
      }
    });
    es5$1.defineProperty(this, '_locales', {
      value: locales
    });
    es5$1.defineProperty(this, '_fields', {
      value: this._findFields(this._locale)
    });
    es5$1.defineProperty(this, '_messages', {
      value: es5$1.objCreate(null)
    }); // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.

    var relativeFormat = this;

    this.format = function format(date, options) {
      return relativeFormat._format(date, options);
    };
  } // Define internal private properties for dealing with locale data.


  es5$1.defineProperty(RelativeFormat, '__localeData__', {
    value: es5$1.objCreate(null)
  });
  es5$1.defineProperty(RelativeFormat, '__addLocaleData', {
    value: function value() {
      for (var i = 0; i < arguments.length; i++) {
        var datum = arguments[i];

        if (!(datum && datum.locale)) {
          throw new Error('Locale data provided to IntlRelativeFormat is missing a ' + '`locale` property value');
        }

        RelativeFormat.__localeData__[datum.locale.toLowerCase()] = datum; // Add data to IntlMessageFormat.

        intlMessageformat.default.__addLocaleData(datum);
      }
    }
  }); // Define public `defaultLocale` property which can be set by the developer, or
  // it will be set when the first RelativeFormat instance is created by
  // leveraging the resolved locale from `Intl`.

  es5$1.defineProperty(RelativeFormat, 'defaultLocale', {
    enumerable: true,
    writable: true,
    value: undefined
  }); // Define public `thresholds` property which can be set by the developer, and
  // defaults to relative time thresholds from moment.js.

  es5$1.defineProperty(RelativeFormat, 'thresholds', {
    enumerable: true,
    value: {
      second: 45,
      'second-short': 45,
      minute: 45,
      'minute-short': 45,
      hour: 22,
      'hour-short': 22,
      day: 26,
      'day-short': 26,
      month: 11,
      'month-short': 11 // months to year

    }
  });

  RelativeFormat.prototype.resolvedOptions = function () {
    return {
      locale: this._locale,
      style: this._options.style,
      units: this._options.units
    };
  };

  RelativeFormat.prototype._compileMessage = function (units) {
    // `this._locales` is the original set of locales the user specified to the
    // constructor, while `this._locale` is the resolved root locale.
    var locales = this._locales;
    var resolvedLocale = this._locale;
    var field = this._fields[units];
    var relativeTime = field.relativeTime;
    var future = '';
    var past = '';
    var i;

    for (i in relativeTime.future) {
      if (relativeTime.future.hasOwnProperty(i)) {
        future += ' ' + i + ' {' + relativeTime.future[i].replace('{0}', '#') + '}';
      }
    }

    for (i in relativeTime.past) {
      if (relativeTime.past.hasOwnProperty(i)) {
        past += ' ' + i + ' {' + relativeTime.past[i].replace('{0}', '#') + '}';
      }
    }

    var message = '{when, select, future {{0, plural, ' + future + '}}' + 'past {{0, plural, ' + past + '}}}'; // Create the synthetic IntlMessageFormat instance using the original
    // locales value specified by the user when constructing the the parent
    // IntlRelativeFormat instance.

    return new intlMessageformat.default(message, locales);
  };

  RelativeFormat.prototype._getMessage = function (units) {
    var messages = this._messages; // Create a new synthetic message based on the locale data from CLDR.

    if (!messages[units]) {
      messages[units] = this._compileMessage(units);
    }

    return messages[units];
  };

  RelativeFormat.prototype._getRelativeUnits = function (diff, units) {
    var field = this._fields[units];

    if (field.relative) {
      return field.relative[diff];
    }
  };

  RelativeFormat.prototype._findFields = function (locale) {
    var localeData = RelativeFormat.__localeData__;
    var data = localeData[locale.toLowerCase()]; // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find `fields` to return.

    while (data) {
      if (data.fields) {
        return data.fields;
      }

      data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error('Locale data added to IntlRelativeFormat is missing `fields` for :' + locale);
  };

  RelativeFormat.prototype._format = function (date, options) {
    var now = options && options.now !== undefined ? options.now : es5$1.dateNow();

    if (date === undefined) {
      date = now;
    } // Determine if the `date` and optional `now` values are valid, and throw a
    // similar error to what `Intl.DateTimeFormat#format()` would throw.


    if (!isFinite(now)) {
      throw new RangeError('The `now` option provided to IntlRelativeFormat#format() is not ' + 'in valid range.');
    }

    if (!isFinite(date)) {
      throw new RangeError('The date value provided to IntlRelativeFormat#format() is not ' + 'in valid range.');
    }

    var diffReport = diff.default(now, date);

    var units = this._options.units || this._selectUnits(diffReport);

    var diffInUnits = diffReport[units];

    if (this._options.style !== 'numeric') {
      var relativeUnits = this._getRelativeUnits(diffInUnits, units);

      if (relativeUnits) {
        return relativeUnits;
      }
    }

    return this._getMessage(units).format({
      '0': Math.abs(diffInUnits),
      when: diffInUnits < 0 ? 'past' : 'future'
    });
  };

  RelativeFormat.prototype._isValidUnits = function (units) {
    if (!units || es5$1.arrIndexOf.call(FIELDS, units) >= 0) {
      return true;
    }

    if (typeof units === 'string') {
      var suggestion = /s$/.test(units) && units.substr(0, units.length - 1);

      if (suggestion && es5$1.arrIndexOf.call(FIELDS, suggestion) >= 0) {
        throw new Error('"' + units + '" is not a valid IntlRelativeFormat `units` ' + 'value, did you mean: ' + suggestion);
      }
    }

    throw new Error('"' + units + '" is not a valid IntlRelativeFormat `units` value, it ' + 'must be one of: "' + FIELDS.join('", "') + '"');
  };

  RelativeFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
      locales = [locales];
    } // Create a copy of the array so we can push on the default locale.


    locales = (locales || []).concat(RelativeFormat.defaultLocale);
    var localeData = RelativeFormat.__localeData__;
    var i, len, localeParts, data; // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.

    for (i = 0, len = locales.length; i < len; i += 1) {
      localeParts = locales[i].toLowerCase().split('-');

      while (localeParts.length) {
        data = localeData[localeParts.join('-')];

        if (data) {
          // Return the normalized locale string; e.g., we return "en-US",
          // instead of "en-us".
          return data.locale;
        }

        localeParts.pop();
      }
    }

    var defaultLocale = locales.pop();
    throw new Error('No locale data has been added to IntlRelativeFormat for: ' + locales.join(', ') + ', or the default locale: ' + defaultLocale);
  };

  RelativeFormat.prototype._resolveStyle = function (style) {
    // Default to "best fit" style.
    if (!style) {
      return STYLES[0];
    }

    if (es5$1.arrIndexOf.call(STYLES, style) >= 0) {
      return style;
    }

    throw new Error('"' + style + '" is not a valid IntlRelativeFormat `style` value, it ' + 'must be one of: "' + STYLES.join('", "') + '"');
  };

  RelativeFormat.prototype._selectUnits = function (diffReport) {
    var i, l, units;
    var fields = FIELDS.filter(function (field) {
      return field.indexOf('-short') < 1;
    });

    for (i = 0, l = fields.length; i < l; i += 1) {
      units = fields[i];

      if (Math.abs(diffReport[units]) < RelativeFormat.thresholds[units]) {
        break;
      }
    }

    return units;
  };
});

var en$1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /* @generated */

  exports.default = {
    "locale": "en",
    "pluralRuleFunction": function pluralRuleFunction(n, ord) {
      var s = String(n).split('.'),
          v0 = !s[1],
          t0 = Number(s[0]) == n,
          n10 = t0 && s[0].slice(-1),
          n100 = t0 && s[0].slice(-2);
      if (ord) return n10 == 1 && n100 != 11 ? 'one' : n10 == 2 && n100 != 12 ? 'two' : n10 == 3 && n100 != 13 ? 'few' : 'other';
      return n == 1 && v0 ? 'one' : 'other';
    },
    "fields": {
      "year": {
        "displayName": "year",
        "relative": {
          "0": "this year",
          "1": "next year",
          "-1": "last year"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} year",
            "other": "in {0} years"
          },
          "past": {
            "one": "{0} year ago",
            "other": "{0} years ago"
          }
        }
      },
      "year-short": {
        "displayName": "yr.",
        "relative": {
          "0": "this yr.",
          "1": "next yr.",
          "-1": "last yr."
        },
        "relativeTime": {
          "future": {
            "one": "in {0} yr.",
            "other": "in {0} yr."
          },
          "past": {
            "one": "{0} yr. ago",
            "other": "{0} yr. ago"
          }
        }
      },
      "month": {
        "displayName": "month",
        "relative": {
          "0": "this month",
          "1": "next month",
          "-1": "last month"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} month",
            "other": "in {0} months"
          },
          "past": {
            "one": "{0} month ago",
            "other": "{0} months ago"
          }
        }
      },
      "month-short": {
        "displayName": "mo.",
        "relative": {
          "0": "this mo.",
          "1": "next mo.",
          "-1": "last mo."
        },
        "relativeTime": {
          "future": {
            "one": "in {0} mo.",
            "other": "in {0} mo."
          },
          "past": {
            "one": "{0} mo. ago",
            "other": "{0} mo. ago"
          }
        }
      },
      "week": {
        "displayName": "week",
        "relativePeriod": "the week of {0}",
        "relative": {
          "0": "this week",
          "1": "next week",
          "-1": "last week"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} week",
            "other": "in {0} weeks"
          },
          "past": {
            "one": "{0} week ago",
            "other": "{0} weeks ago"
          }
        }
      },
      "week-short": {
        "displayName": "wk.",
        "relativePeriod": "the week of {0}",
        "relative": {
          "0": "this wk.",
          "1": "next wk.",
          "-1": "last wk."
        },
        "relativeTime": {
          "future": {
            "one": "in {0} wk.",
            "other": "in {0} wk."
          },
          "past": {
            "one": "{0} wk. ago",
            "other": "{0} wk. ago"
          }
        }
      },
      "day": {
        "displayName": "day",
        "relative": {
          "0": "today",
          "1": "tomorrow",
          "-1": "yesterday"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} day",
            "other": "in {0} days"
          },
          "past": {
            "one": "{0} day ago",
            "other": "{0} days ago"
          }
        }
      },
      "day-short": {
        "displayName": "day",
        "relative": {
          "0": "today",
          "1": "tomorrow",
          "-1": "yesterday"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} day",
            "other": "in {0} days"
          },
          "past": {
            "one": "{0} day ago",
            "other": "{0} days ago"
          }
        }
      },
      "hour": {
        "displayName": "hour",
        "relative": {
          "0": "this hour"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} hour",
            "other": "in {0} hours"
          },
          "past": {
            "one": "{0} hour ago",
            "other": "{0} hours ago"
          }
        }
      },
      "hour-short": {
        "displayName": "hr.",
        "relative": {
          "0": "this hour"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} hr.",
            "other": "in {0} hr."
          },
          "past": {
            "one": "{0} hr. ago",
            "other": "{0} hr. ago"
          }
        }
      },
      "minute": {
        "displayName": "minute",
        "relative": {
          "0": "this minute"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} minute",
            "other": "in {0} minutes"
          },
          "past": {
            "one": "{0} minute ago",
            "other": "{0} minutes ago"
          }
        }
      },
      "minute-short": {
        "displayName": "min.",
        "relative": {
          "0": "this minute"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} min.",
            "other": "in {0} min."
          },
          "past": {
            "one": "{0} min. ago",
            "other": "{0} min. ago"
          }
        }
      },
      "second": {
        "displayName": "second",
        "relative": {
          "0": "now"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} second",
            "other": "in {0} seconds"
          },
          "past": {
            "one": "{0} second ago",
            "other": "{0} seconds ago"
          }
        }
      },
      "second-short": {
        "displayName": "sec.",
        "relative": {
          "0": "now"
        },
        "relativeTime": {
          "future": {
            "one": "in {0} sec.",
            "other": "in {0} sec."
          },
          "past": {
            "one": "{0} sec. ago",
            "other": "{0} sec. ago"
          }
        }
      }
    }
  };
});

var main$1 = createCommonjsModule(function (module, exports) {
  /* jslint esnext: true */

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  core$1.default.__addLocaleData(en$1.default);

  core$1.default.defaultLocale = 'en';
  exports.default = core$1.default;
});

var intlRelativeformat = createCommonjsModule(function (module, exports) {

  var IntlRelativeFormat = main$1['default']; // Add all locale data to `IntlRelativeFormat`. This module will be ignored when
  // bundling for the browser with Browserify/Webpack.
  // Re-export `IntlRelativeFormat` as the CommonJS default exports with all the
  // locale data registered, and with English set as the default locale. Define
  // the `default` prop for use with other compiled ES6 Modules.

  exports = module.exports = IntlRelativeFormat;
  exports['default'] = exports;
});

var reactIs_production_min = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  var b = "function" === typeof Symbol && Symbol.for,
      c = b ? Symbol.for("react.element") : 60103,
      d = b ? Symbol.for("react.portal") : 60106,
      e = b ? Symbol.for("react.fragment") : 60107,
      f = b ? Symbol.for("react.strict_mode") : 60108,
      g = b ? Symbol.for("react.profiler") : 60114,
      h = b ? Symbol.for("react.provider") : 60109,
      k = b ? Symbol.for("react.context") : 60110,
      l = b ? Symbol.for("react.async_mode") : 60111,
      m = b ? Symbol.for("react.concurrent_mode") : 60111,
      n = b ? Symbol.for("react.forward_ref") : 60112,
      p = b ? Symbol.for("react.suspense") : 60113,
      q = b ? Symbol.for("react.suspense_list") : 60120,
      r = b ? Symbol.for("react.memo") : 60115,
      t = b ? Symbol.for("react.lazy") : 60116,
      v = b ? Symbol.for("react.fundamental") : 60117,
      w = b ? Symbol.for("react.responder") : 60118,
      x = b ? Symbol.for("react.scope") : 60119;

  function y(a) {
    if ("object" === _typeof(a) && null !== a) {
      var u = a.$$typeof;

      switch (u) {
        case c:
          switch (a = a.type, a) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
              return a;

            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case n:
                case h:
                  return a;

                default:
                  return u;
              }

          }

        case t:
        case r:
        case d:
          return u;
      }
    }
  }

  function z(a) {
    return y(a) === m;
  }

  exports.typeOf = y;
  exports.AsyncMode = l;
  exports.ConcurrentMode = m;
  exports.ContextConsumer = k;
  exports.ContextProvider = h;
  exports.Element = c;
  exports.ForwardRef = n;
  exports.Fragment = e;
  exports.Lazy = t;
  exports.Memo = r;
  exports.Portal = d;
  exports.Profiler = g;
  exports.StrictMode = f;
  exports.Suspense = p;

  exports.isValidElementType = function (a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === _typeof(a) && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === v || a.$$typeof === w || a.$$typeof === x);
  };

  exports.isAsyncMode = function (a) {
    return z(a) || y(a) === l;
  };

  exports.isConcurrentMode = z;

  exports.isContextConsumer = function (a) {
    return y(a) === k;
  };

  exports.isContextProvider = function (a) {
    return y(a) === h;
  };

  exports.isElement = function (a) {
    return "object" === _typeof(a) && null !== a && a.$$typeof === c;
  };

  exports.isForwardRef = function (a) {
    return y(a) === n;
  };

  exports.isFragment = function (a) {
    return y(a) === e;
  };

  exports.isLazy = function (a) {
    return y(a) === t;
  };

  exports.isMemo = function (a) {
    return y(a) === r;
  };

  exports.isPortal = function (a) {
    return y(a) === d;
  };

  exports.isProfiler = function (a) {
    return y(a) === g;
  };

  exports.isStrictMode = function (a) {
    return y(a) === f;
  };

  exports.isSuspense = function (a) {
    return y(a) === p;
  };
});

var reactIs_development = createCommonjsModule(function (module, exports) {

  {
    (function () {

      Object.defineProperty(exports, '__esModule', {
        value: true
      }); // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
      // nor polyfill, then a plain number is used for performance.

      var hasSymbol = typeof Symbol === 'function' && Symbol.for;
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
      // (unstable) APIs that have been removed. Can we remove the symbols?

      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

      function isValidElementType(type) {
        return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || _typeof(type) === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
      }
      /**
       * Forked from fbjs/warning:
       * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
       *
       * Only change is we use console.warn instead of console.error,
       * and do nothing when 'console' is not supported.
       * This really simplifies the code.
       * ---
       * Similar to invariant but only logs a warning if the condition is not met.
       * This can be used to log issues in development environments in critical
       * paths. Removing the logging code for production environments will keep the
       * same logic and follow the same code paths.
       */


      var lowPriorityWarningWithoutStack = function lowPriorityWarningWithoutStack() {};

      {
        var printWarning = function printWarning(format) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });

          if (typeof console !== 'undefined') {
            console.warn(message);
          }

          try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
          } catch (x) {}
        };

        lowPriorityWarningWithoutStack = function lowPriorityWarningWithoutStack(condition, format) {
          if (format === undefined) {
            throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
          }

          if (!condition) {
            for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }

            printWarning.apply(void 0, [format].concat(args));
          }
        };
      }
      var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

      function typeOf(object) {
        if (_typeof(object) === 'object' && object !== null) {
          var $$typeof = object.$$typeof;

          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;

              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;

                default:
                  var $$typeofType = type && type.$$typeof;

                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;

                    default:
                      return $$typeof;
                  }

              }

            case REACT_LAZY_TYPE:
            case REACT_MEMO_TYPE:
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }

        return undefined;
      } // AsyncMode is deprecated along with isAsyncMode


      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            lowPriorityWarningWithoutStack$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }

      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }

      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }

      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }

      function isElement(object) {
        return _typeof(object) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }

      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }

      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }

      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }

      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }

      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }

      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }

      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }

      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }

      exports.typeOf = typeOf;
      exports.AsyncMode = AsyncMode;
      exports.ConcurrentMode = ConcurrentMode;
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.isValidElementType = isValidElementType;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
    })();
  }
});

var reactIs = createCommonjsModule(function (module) {

  {
    module.exports = reactIs_development;
  }
});

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);

var printWarning$2 = function printWarning() {};

{
  printWarning$2 = function printWarning(text) {
    var message = 'Warning: ' + text;

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function factoryWithTypeCheckers(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */

  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);

    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }
  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */


  var ANONYMOUS = '<<anonymous>>'; // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.

  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),
    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };
  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */

  /*eslint-disable no-self-compare*/

  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */


  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  } // Make `instanceof Error` still work for returned errors.


  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }

    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
          err.name = 'Invariant Violation';
          throw err;
        } else if ( typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;

          if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            printWarning$2('You are manually calling a React.PropTypes validation ' + 'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.');
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }

      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }

          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }

        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }

      var propValue = props[propName];

      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }

      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);

        if (error instanceof Error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      {
        if (arguments.length > 1) {
          printWarning$2('Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' + 'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).');
        } else {
          printWarning$2('Invalid argument supplied to oneOf, expected an array.');
        }
      }

      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);

        if (type === 'symbol') {
          return String(value);
        }

        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }

      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }

      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);

          if (error instanceof Error) {
            return error;
          }
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       printWarning$2('Invalid argument supplied to oneOfType, expected an instance of array.') ;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];

      if (typeof checker !== 'function') {
        printWarning$2('Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.');
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];

        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }

      for (var key in shapeTypes) {
        var checker = shapeTypes[key];

        if (!checker) {
          continue;
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      } // We need to check all keys in case some are required but missing from
      // props.


      var allKeys = objectAssign({}, props[propName], shapeTypes);

      for (var key in allKeys) {
        var checker = shapeTypes[key];

        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (_typeof(propValue)) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;

      case 'boolean':
        return !propValue;

      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }

        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);

        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;

          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;

              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;

      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    } // falsy value can't be a Symbol


    if (!propValue) {
      return false;
    } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    } // Fallback for non-spec compliant Symbols which are polyfilled.


    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  } // Equivalent of `typeof` but with special handling for array and regexp.


  function getPropType(propValue) {
    var propType = _typeof(propValue);

    if (Array.isArray(propValue)) {
      return 'array';
    }

    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }

    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }

    return propType;
  } // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.


  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }

    var propType = getPropType(propValue);

    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }

    return propType;
  } // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"


  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);

    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;

      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;

      default:
        return type;
    }
  } // Returns class name of the object, if any.


  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }

    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  {
    var ReactIs = reactIs; // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod

    var throwOnDirectAccess = true;
    module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
  }
});

var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */


var invariant$1 = function invariant(condition, format, a, b, c, d, e, f) {
  {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame

    throw error;
  }
};

var browser$1 = invariant$1;

function getCacheId(inputs) {
  return JSON.stringify(inputs.map(function (input) {
    return input && _typeof(input) === 'object' ? orderedProps(input) : input;
  }));
}

function orderedProps(obj) {
  return Object.keys(obj).sort().map(function (k) {
    var _a;

    return _a = {}, _a[k] = obj[k], _a;
  });
}

var memoizeFormatConstructor = function memoizeFormatConstructor(FormatConstructor, cache) {
  if (cache === void 0) {
    cache = {};
  }

  return function () {
    var _a;

    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var cacheId = getCacheId(args);
    var format = cacheId && cache[cacheId];

    if (!format) {
      format = new ((_a = FormatConstructor).bind.apply(_a, [void 0].concat(args)))();

      if (cacheId) {
        cache[cacheId] = format;
      }
    }

    return format;
  };
};

var defaultLocaleData = {
  "locale": "en",
  "pluralRuleFunction": function pluralRuleFunction(n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
    if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";
    return n == 1 && v0 ? "one" : "other";
  },
  "fields": {
    "year": {
      "displayName": "year",
      "relative": {
        "0": "this year",
        "1": "next year",
        "-1": "last year"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} year",
          "other": "in {0} years"
        },
        "past": {
          "one": "{0} year ago",
          "other": "{0} years ago"
        }
      }
    },
    "year-short": {
      "displayName": "yr.",
      "relative": {
        "0": "this yr.",
        "1": "next yr.",
        "-1": "last yr."
      },
      "relativeTime": {
        "future": {
          "one": "in {0} yr.",
          "other": "in {0} yr."
        },
        "past": {
          "one": "{0} yr. ago",
          "other": "{0} yr. ago"
        }
      }
    },
    "month": {
      "displayName": "month",
      "relative": {
        "0": "this month",
        "1": "next month",
        "-1": "last month"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} month",
          "other": "in {0} months"
        },
        "past": {
          "one": "{0} month ago",
          "other": "{0} months ago"
        }
      }
    },
    "month-short": {
      "displayName": "mo.",
      "relative": {
        "0": "this mo.",
        "1": "next mo.",
        "-1": "last mo."
      },
      "relativeTime": {
        "future": {
          "one": "in {0} mo.",
          "other": "in {0} mo."
        },
        "past": {
          "one": "{0} mo. ago",
          "other": "{0} mo. ago"
        }
      }
    },
    "day": {
      "displayName": "day",
      "relative": {
        "0": "today",
        "1": "tomorrow",
        "-1": "yesterday"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} day",
          "other": "in {0} days"
        },
        "past": {
          "one": "{0} day ago",
          "other": "{0} days ago"
        }
      }
    },
    "day-short": {
      "displayName": "day",
      "relative": {
        "0": "today",
        "1": "tomorrow",
        "-1": "yesterday"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} day",
          "other": "in {0} days"
        },
        "past": {
          "one": "{0} day ago",
          "other": "{0} days ago"
        }
      }
    },
    "hour": {
      "displayName": "hour",
      "relative": {
        "0": "this hour"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} hour",
          "other": "in {0} hours"
        },
        "past": {
          "one": "{0} hour ago",
          "other": "{0} hours ago"
        }
      }
    },
    "hour-short": {
      "displayName": "hr.",
      "relative": {
        "0": "this hour"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} hr.",
          "other": "in {0} hr."
        },
        "past": {
          "one": "{0} hr. ago",
          "other": "{0} hr. ago"
        }
      }
    },
    "minute": {
      "displayName": "minute",
      "relative": {
        "0": "this minute"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} minute",
          "other": "in {0} minutes"
        },
        "past": {
          "one": "{0} minute ago",
          "other": "{0} minutes ago"
        }
      }
    },
    "minute-short": {
      "displayName": "min.",
      "relative": {
        "0": "this minute"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} min.",
          "other": "in {0} min."
        },
        "past": {
          "one": "{0} min. ago",
          "other": "{0} min. ago"
        }
      }
    },
    "second": {
      "displayName": "second",
      "relative": {
        "0": "now"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} second",
          "other": "in {0} seconds"
        },
        "past": {
          "one": "{0} second ago",
          "other": "{0} seconds ago"
        }
      }
    },
    "second-short": {
      "displayName": "sec.",
      "relative": {
        "0": "now"
      },
      "relativeTime": {
        "future": {
          "one": "in {0} sec.",
          "other": "in {0} sec."
        },
        "past": {
          "one": "{0} sec. ago",
          "other": "{0} sec. ago"
        }
      }
    }
  }
};
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

function addLocaleData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var locales = Array.isArray(data) ? data : [data];
  locales.forEach(function (localeData) {
    if (localeData && localeData.locale) {
      intlMessageformat.__addLocaleData(localeData);

      intlRelativeformat.__addLocaleData(localeData);
    }
  });
}

function hasLocaleData(locale) {
  var localeParts = (locale || '').split('-');

  while (localeParts.length > 0) {
    if (hasIMFAndIRFLocaleData(localeParts.join('-'))) {
      return true;
    }

    localeParts.pop();
  }

  return false;
}

function hasIMFAndIRFLocaleData(locale) {
  var normalizedLocale = locale && locale.toLowerCase();
  return !!(intlMessageformat.__localeData__[normalizedLocale] && intlRelativeformat.__localeData__[normalizedLocale]);
}

var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
};

var classCallCheck = function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + _typeof(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function objectWithoutProperties(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (_typeof(call) === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return Array.from(arr);
  }
};
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


var bool = propTypes.bool;
var number = propTypes.number;
var string = propTypes.string;
var func = propTypes.func;
var object = propTypes.object;
var oneOf = propTypes.oneOf;
var shape = propTypes.shape;
var any = propTypes.any;
var oneOfType = propTypes.oneOfType;
var localeMatcher = oneOf(['best fit', 'lookup']);
var narrowShortLong = oneOf(['narrow', 'short', 'long']);
var numeric2digit = oneOf(['numeric', '2-digit']);
var funcReq = func.isRequired;
var intlConfigPropTypes = {
  locale: string,
  timeZone: string,
  formats: object,
  messages: object,
  textComponent: any,
  defaultLocale: string,
  defaultFormats: object,
  onError: func
};
var intlFormatPropTypes = {
  formatDate: funcReq,
  formatTime: funcReq,
  formatRelative: funcReq,
  formatNumber: funcReq,
  formatPlural: funcReq,
  formatMessage: funcReq,
  formatHTMLMessage: funcReq
};
var intlShape = shape(_extends({}, intlConfigPropTypes, intlFormatPropTypes, {
  formatters: object,
  now: funcReq
}));
var messageDescriptorPropTypes = {
  id: string.isRequired,
  description: oneOfType([string, object]),
  defaultMessage: string
};
var dateTimeFormatPropTypes = {
  localeMatcher: localeMatcher,
  formatMatcher: oneOf(['basic', 'best fit']),
  timeZone: string,
  hour12: bool,
  weekday: narrowShortLong,
  era: narrowShortLong,
  year: numeric2digit,
  month: oneOf(['numeric', '2-digit', 'narrow', 'short', 'long']),
  day: numeric2digit,
  hour: numeric2digit,
  minute: numeric2digit,
  second: numeric2digit,
  timeZoneName: oneOf(['short', 'long'])
};
var numberFormatPropTypes = {
  localeMatcher: localeMatcher,
  style: oneOf(['decimal', 'currency', 'percent']),
  currency: string,
  currencyDisplay: oneOf(['symbol', 'code', 'name']),
  useGrouping: bool,
  minimumIntegerDigits: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
  minimumSignificantDigits: number,
  maximumSignificantDigits: number
};
var relativeFormatPropTypes = {
  style: oneOf(['best fit', 'numeric']),
  units: oneOf(['second', 'minute', 'hour', 'day', 'month', 'year', 'second-short', 'minute-short', 'hour-short', 'day-short', 'month-short', 'year-short'])
};
var pluralFormatPropTypes = {
  style: oneOf(['cardinal', 'ordinal'])
};
/*
HTML escaping and shallow-equals implementations are the same as React's
(on purpose.) Therefore, it has the following Copyright and Licensing:

Copyright 2013-2014, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the LICENSE
file in the root directory of React's source tree.
*/

var intlConfigPropNames = Object.keys(intlConfigPropTypes);
var ESCAPED_CHARS = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;'
};
var UNSAFE_CHARS_REGEX = /[&><"']/g;

function escape$1(str) {
  return ('' + str).replace(UNSAFE_CHARS_REGEX, function (match) {
    return ESCAPED_CHARS[match];
  });
}

function filterProps(props, whitelist) {
  var defaults$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return whitelist.reduce(function (filtered, name) {
    if (props.hasOwnProperty(name)) {
      filtered[name] = props[name];
    } else if (defaults$$1.hasOwnProperty(name)) {
      filtered[name] = defaults$$1[name];
    }

    return filtered;
  }, {});
}

function invariantIntlContext() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      intl = _ref.intl;

  browser$1(intl, '[React Intl] Could not find required `intl` object. ' + '<IntlProvider> needs to exist in the component ancestry.');
}

function shallowEquals(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof$1(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof$1(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  } // Test for A's keys different from B.


  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shouldIntlComponentUpdate(_ref2, nextProps, nextState) {
  var props = _ref2.props,
      state = _ref2.state,
      _ref2$context = _ref2.context,
      context = _ref2$context === undefined ? {} : _ref2$context;
  var nextContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _context$intl = context.intl,
      intl = _context$intl === undefined ? {} : _context$intl;
  var _nextContext$intl = nextContext.intl,
      nextIntl = _nextContext$intl === undefined ? {} : _nextContext$intl;
  return !shallowEquals(nextProps, props) || !shallowEquals(nextState, state) || !(nextIntl === intl || shallowEquals(filterProps(nextIntl, intlConfigPropNames), filterProps(intl, intlConfigPropNames)));
}

function createError(message, exception) {
  var eMsg = exception ? '\n' + exception : '';
  return '[React Intl] ' + message + eMsg;
}

function defaultErrorHandler(error) {
  {
    console.error(error);
  }
}
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
// This is a "hack" until a proper `intl-pluralformat` package is created.


function resolveLocale(locales) {
  // IntlMessageFormat#_resolveLocale() does not depend on `this`.
  return intlMessageformat.prototype._resolveLocale(locales);
}

function findPluralFunction(locale) {
  // IntlMessageFormat#_findPluralFunction() does not depend on `this`.
  return intlMessageformat.prototype._findPluralRuleFunction(locale);
}

var IntlPluralFormat = function IntlPluralFormat(locales) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  classCallCheck(this, IntlPluralFormat);
  var useOrdinal = options.style === 'ordinal';
  var pluralFn = findPluralFunction(resolveLocale(locales));

  this.format = function (value) {
    return pluralFn(value, useOrdinal);
  };
};
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


var DATE_TIME_FORMAT_OPTIONS = Object.keys(dateTimeFormatPropTypes);
var NUMBER_FORMAT_OPTIONS = Object.keys(numberFormatPropTypes);
var RELATIVE_FORMAT_OPTIONS = Object.keys(relativeFormatPropTypes);
var PLURAL_FORMAT_OPTIONS = Object.keys(pluralFormatPropTypes);
var RELATIVE_FORMAT_THRESHOLDS = {
  second: 60,
  // seconds to minute
  minute: 60,
  // minutes to hour
  hour: 24,
  // hours to day
  day: 30,
  // days to month
  month: 12
};

function updateRelativeFormatThresholds(newThresholds) {
  var thresholds = intlRelativeformat.thresholds;
  thresholds.second = newThresholds.second;
  thresholds.minute = newThresholds.minute;
  thresholds.hour = newThresholds.hour;
  thresholds.day = newThresholds.day;
  thresholds.month = newThresholds.month;
  thresholds['second-short'] = newThresholds['second-short'];
  thresholds['minute-short'] = newThresholds['minute-short'];
  thresholds['hour-short'] = newThresholds['hour-short'];
  thresholds['day-short'] = newThresholds['day-short'];
  thresholds['month-short'] = newThresholds['month-short'];
}

function getNamedFormat(formats, type, name, onError) {
  var format = formats && formats[type] && formats[type][name];

  if (format) {
    return format;
  }

  onError(createError('No ' + type + ' format named: ' + name));
}

function formatDate(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats,
      timeZone = config.timeZone;
  var format = options.format;
  var onError = config.onError || defaultErrorHandler;
  var date = new Date(value);

  var defaults$$1 = _extends({}, timeZone && {
    timeZone: timeZone
  }, format && getNamedFormat(formats, 'date', format, onError));

  var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

  try {
    return state.getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    onError(createError('Error formatting date.', e));
  }

  return String(date);
}

function formatTime(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats,
      timeZone = config.timeZone;
  var format = options.format;
  var onError = config.onError || defaultErrorHandler;
  var date = new Date(value);

  var defaults$$1 = _extends({}, timeZone && {
    timeZone: timeZone
  }, format && getNamedFormat(formats, 'time', format, onError));

  var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

  if (!filteredOptions.hour && !filteredOptions.minute && !filteredOptions.second) {
    // Add default formatting options if hour, minute, or second isn't defined.
    filteredOptions = _extends({}, filteredOptions, {
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  try {
    return state.getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    onError(createError('Error formatting time.', e));
  }

  return String(date);
}

function formatRelative(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;
  var onError = config.onError || defaultErrorHandler;
  var date = new Date(value);
  var now = new Date(options.now);
  var defaults$$1 = format && getNamedFormat(formats, 'relative', format, onError);
  var filteredOptions = filterProps(options, RELATIVE_FORMAT_OPTIONS, defaults$$1); // Capture the current threshold values, then temporarily override them with
  // specific values just for this render.

  var oldThresholds = _extends({}, intlRelativeformat.thresholds);

  updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

  try {
    return state.getRelativeFormat(locale, filteredOptions).format(date, {
      now: isFinite(now) ? now : state.now()
    });
  } catch (e) {
    onError(createError('Error formatting relative time.', e));
  } finally {
    updateRelativeFormatThresholds(oldThresholds);
  }

  return String(date);
}

function formatNumber(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;
  var onError = config.onError || defaultErrorHandler;
  var defaults$$1 = format && getNamedFormat(formats, 'number', format, onError);
  var filteredOptions = filterProps(options, NUMBER_FORMAT_OPTIONS, defaults$$1);

  try {
    return state.getNumberFormat(locale, filteredOptions).format(value);
  } catch (e) {
    onError(createError('Error formatting number.', e));
  }

  return String(value);
}

function formatPlural(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale;
  var filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);
  var onError = config.onError || defaultErrorHandler;

  try {
    return state.getPluralFormat(locale, filteredOptions).format(value);
  } catch (e) {
    onError(createError('Error formatting plural.', e));
  }

  return 'other';
}

function formatMessage(config, state) {
  var messageDescriptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var values = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats,
      messages = config.messages,
      defaultLocale = config.defaultLocale,
      defaultFormats = config.defaultFormats;
  var id = messageDescriptor.id,
      defaultMessage = messageDescriptor.defaultMessage; // Produce a better error if the user calls `intl.formatMessage(element)`

  {
    browser$1(! /*#__PURE__*/react.isValidElement(config), '[React Intl] Don\'t pass React elements to ' + 'formatMessage(), pass `.props`.');
  } // `id` is a required field of a Message Descriptor.


  browser$1(id, '[React Intl] An `id` must be provided to format a message.');
  var message = messages && messages[id];
  var hasValues = Object.keys(values).length > 0; // Avoid expensive message formatting for simple messages without values. In
  // development messages will always be formatted in case of missing values.

  if (!hasValues && process.env.NODE_ENV === 'production') {
    return message || defaultMessage || id;
  }

  var formattedMessage = void 0;
  var onError = config.onError || defaultErrorHandler;

  if (message) {
    try {
      var formatter = state.getMessageFormat(message, locale, formats);
      formattedMessage = formatter.format(values);
    } catch (e) {
      onError(createError('Error formatting message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : ''), e));
    }
  } else {
    // This prevents warnings from littering the console in development
    // when no `messages` are passed into the <IntlProvider> for the
    // default locale, and a default message is in the source.
    if (!defaultMessage || locale && locale.toLowerCase() !== defaultLocale.toLowerCase()) {
      onError(createError('Missing message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : '')));
    }
  }

  if (!formattedMessage && defaultMessage) {
    try {
      var _formatter = state.getMessageFormat(defaultMessage, defaultLocale, defaultFormats);

      formattedMessage = _formatter.format(values);
    } catch (e) {
      onError(createError('Error formatting the default message for: "' + id + '"', e));
    }
  }

  if (!formattedMessage) {
    onError(createError('Cannot format message: "' + id + '", ' + ('using message ' + (message || defaultMessage ? 'source' : 'id') + ' as fallback.')));
  }

  return formattedMessage || message || defaultMessage || id;
}

function formatHTMLMessage(config, state, messageDescriptor) {
  var rawValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {}; // Process all the values before they are used when formatting the ICU
  // Message string. Since the formatted message might be injected via
  // `innerHTML`, all String-based values need to be HTML-escaped.

  var escapedValues = Object.keys(rawValues).reduce(function (escaped, name) {
    var value = rawValues[name];
    escaped[name] = typeof value === 'string' ? escape$1(value) : value;
    return escaped;
  }, {});
  return formatMessage(config, state, messageDescriptor, escapedValues);
}

var format = Object.freeze({
  formatDate: formatDate,
  formatTime: formatTime,
  formatRelative: formatRelative,
  formatNumber: formatNumber,
  formatPlural: formatPlural,
  formatMessage: formatMessage,
  formatHTMLMessage: formatHTMLMessage
});
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var intlConfigPropNames$1 = Object.keys(intlConfigPropTypes);
var intlFormatPropNames = Object.keys(intlFormatPropTypes); // These are not a static property on the `IntlProvider` class so the intl
// config values can be inherited from an <IntlProvider> ancestor.

var defaultProps = {
  formats: {},
  messages: {},
  timeZone: null,
  textComponent: 'span',
  defaultLocale: 'en',
  defaultFormats: {},
  onError: defaultErrorHandler
};

var IntlProvider = function (_Component) {
  inherits(IntlProvider, _Component);

  function IntlProvider(props) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, IntlProvider);

    var _this = possibleConstructorReturn(this, (IntlProvider.__proto__ || Object.getPrototypeOf(IntlProvider)).call(this, props, context));

    browser$1(typeof Intl !== 'undefined', '[React Intl] The `Intl` APIs must be available in the runtime, ' + 'and do not appear to be built-in. An `Intl` polyfill should be loaded.\n' + 'See: http://formatjs.io/guides/runtime-environments/');
    var intlContext = context.intl; // Used to stabilize time when performing an initial rendering so that
    // all relative times use the same reference "now" time.

    var initialNow = void 0;

    if (isFinite(props.initialNow)) {
      initialNow = Number(props.initialNow);
    } else {
      // When an `initialNow` isn't provided via `props`, look to see an
      // <IntlProvider> exists in the ancestry and call its `now()`
      // function to propagate its value for "now".
      initialNow = intlContext ? intlContext.now() : Date.now();
    } // Creating `Intl*` formatters is expensive. If there's a parent
    // `<IntlProvider>`, then its formatters will be used. Otherwise, this
    // memoize the `Intl*` constructors and cache them for the lifecycle of
    // this IntlProvider instance.


    var _ref = intlContext || {},
        _ref$formatters = _ref.formatters,
        formatters = _ref$formatters === undefined ? {
      getDateTimeFormat: memoizeFormatConstructor(Intl.DateTimeFormat),
      getNumberFormat: memoizeFormatConstructor(Intl.NumberFormat),
      getMessageFormat: memoizeFormatConstructor(intlMessageformat),
      getRelativeFormat: memoizeFormatConstructor(intlRelativeformat),
      getPluralFormat: memoizeFormatConstructor(IntlPluralFormat)
    } : _ref$formatters;

    _this.state = _extends({}, formatters, {
      // Wrapper to provide stable "now" time for initial render.
      now: function now() {
        return _this._didDisplay ? Date.now() : initialNow;
      }
    });
    return _this;
  }

  createClass(IntlProvider, [{
    key: 'getConfig',
    value: function getConfig() {
      var intlContext = this.context.intl; // Build a whitelisted config object from `props`, defaults, and
      // `context.intl`, if an <IntlProvider> exists in the ancestry.

      var config = filterProps(this.props, intlConfigPropNames$1, intlContext); // Apply default props. This must be applied last after the props have
      // been resolved and inherited from any <IntlProvider> in the ancestry.
      // This matches how React resolves `defaultProps`.

      for (var propName in defaultProps) {
        if (config[propName] === undefined) {
          config[propName] = defaultProps[propName];
        }
      }

      if (!hasLocaleData(config.locale)) {
        var _config = config,
            locale = _config.locale,
            defaultLocale = _config.defaultLocale,
            defaultFormats = _config.defaultFormats,
            onError = _config.onError;
        onError(createError('Missing locale data for locale: "' + locale + '". ' + ('Using default locale: "' + defaultLocale + '" as fallback.'))); // Since there's no registered locale data for `locale`, this will
        // fallback to the `defaultLocale` to make sure things can render.
        // The `messages` are overridden to the `defaultProps` empty object
        // to maintain referential equality across re-renders. It's assumed
        // each <FormattedMessage> contains a `defaultMessage` prop.

        config = _extends({}, config, {
          locale: defaultLocale,
          formats: defaultFormats,
          messages: defaultProps.messages
        });
      }

      return config;
    }
  }, {
    key: 'getBoundFormatFns',
    value: function getBoundFormatFns(config, state) {
      return intlFormatPropNames.reduce(function (boundFormatFns, name) {
        boundFormatFns[name] = format[name].bind(null, config, state);
        return boundFormatFns;
      }, {});
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      var config = this.getConfig(); // Bind intl factories and current config to the format functions.

      var boundFormatFns = this.getBoundFormatFns(config, this.state);
      var _state = this.state,
          now = _state.now,
          formatters = objectWithoutProperties(_state, ['now']);
      return {
        intl: _extends({}, config, boundFormatFns, {
          formatters: formatters,
          now: now
        })
      };
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._didDisplay = true;
    }
  }, {
    key: 'render',
    value: function render() {
      return react.Children.only(this.props.children);
    }
  }]);
  return IntlProvider;
}(react.Component);

IntlProvider.displayName = 'IntlProvider';
IntlProvider.contextTypes = {
  intl: intlShape
};
IntlProvider.childContextTypes = {
  intl: intlShape.isRequired
};
 IntlProvider.propTypes = _extends({}, intlConfigPropTypes, {
  children: propTypes.element.isRequired,
  initialNow: propTypes.any
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedDate = function (_Component) {
  inherits(FormattedDate, _Component);

  function FormattedDate(props, context) {
    classCallCheck(this, FormattedDate);

    var _this = possibleConstructorReturn(this, (FormattedDate.__proto__ || Object.getPrototypeOf(FormattedDate)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedDate, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatDate = _context$intl.formatDate,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;
      var formattedDate = formatDate(value, this.props);

      if (typeof children === 'function') {
        return children(formattedDate);
      }

      return /*#__PURE__*/react.createElement(Text, null, formattedDate);
    }
  }]);
  return FormattedDate;
}(react.Component);

FormattedDate.displayName = 'FormattedDate';
FormattedDate.contextTypes = {
  intl: intlShape
};
 FormattedDate.propTypes = _extends({}, dateTimeFormatPropTypes, {
  value: propTypes.any.isRequired,
  format: propTypes.string,
  children: propTypes.func
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedTime = function (_Component) {
  inherits(FormattedTime, _Component);

  function FormattedTime(props, context) {
    classCallCheck(this, FormattedTime);

    var _this = possibleConstructorReturn(this, (FormattedTime.__proto__ || Object.getPrototypeOf(FormattedTime)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedTime, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatTime = _context$intl.formatTime,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;
      var formattedTime = formatTime(value, this.props);

      if (typeof children === 'function') {
        return children(formattedTime);
      }

      return /*#__PURE__*/react.createElement(Text, null, formattedTime);
    }
  }]);
  return FormattedTime;
}(react.Component);

FormattedTime.displayName = 'FormattedTime';
FormattedTime.contextTypes = {
  intl: intlShape
};
 FormattedTime.propTypes = _extends({}, dateTimeFormatPropTypes, {
  value: propTypes.any.isRequired,
  format: propTypes.string,
  children: propTypes.func
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var SECOND = 1000;
var MINUTE = 1000 * 60;
var HOUR = 1000 * 60 * 60;
var DAY = 1000 * 60 * 60 * 24; // The maximum timer delay value is a 32-bit signed integer.
// See: https://mdn.io/setTimeout

var MAX_TIMER_DELAY = 2147483647;

function selectUnits(delta) {
  var absDelta = Math.abs(delta);

  if (absDelta < MINUTE) {
    return 'second';
  }

  if (absDelta < HOUR) {
    return 'minute';
  }

  if (absDelta < DAY) {
    return 'hour';
  } // The maximum scheduled delay will be measured in days since the maximum
  // timer delay is less than the number of milliseconds in 25 days.


  return 'day';
}

function getUnitDelay(units) {
  switch (units) {
    case 'second':
      return SECOND;

    case 'minute':
      return MINUTE;

    case 'hour':
      return HOUR;

    case 'day':
      return DAY;

    default:
      return MAX_TIMER_DELAY;
  }
}

function isSameDate(a, b) {
  if (a === b) {
    return true;
  }

  var aTime = new Date(a).getTime();
  var bTime = new Date(b).getTime();
  return isFinite(aTime) && isFinite(bTime) && aTime === bTime;
}

var FormattedRelative = function (_Component) {
  inherits(FormattedRelative, _Component);

  function FormattedRelative(props, context) {
    classCallCheck(this, FormattedRelative);

    var _this = possibleConstructorReturn(this, (FormattedRelative.__proto__ || Object.getPrototypeOf(FormattedRelative)).call(this, props, context));

    invariantIntlContext(context);
    var now = isFinite(props.initialNow) ? Number(props.initialNow) : context.intl.now(); // `now` is stored as state so that `render()` remains a function of
    // props + state, instead of accessing `Date.now()` inside `render()`.

    _this.state = {
      now: now
    };
    return _this;
  }

  createClass(FormattedRelative, [{
    key: 'scheduleNextUpdate',
    value: function scheduleNextUpdate(props, state) {
      var _this2 = this; // Cancel and pending update because we're scheduling a new update.


      clearTimeout(this._timer);
      var value = props.value,
          units = props.units,
          updateInterval = props.updateInterval;
      var time = new Date(value).getTime(); // If the `updateInterval` is falsy, including `0` or we don't have a
      // valid date, then auto updates have been turned off, so we bail and
      // skip scheduling an update.

      if (!updateInterval || !isFinite(time)) {
        return;
      }

      var delta = time - state.now;
      var unitDelay = getUnitDelay(units || selectUnits(delta));
      var unitRemainder = Math.abs(delta % unitDelay); // We want the largest possible timer delay which will still display
      // accurate information while reducing unnecessary re-renders. The delay
      // should be until the next "interesting" moment, like a tick from
      // "1 minute ago" to "2 minutes ago" when the delta is 120,000ms.

      var delay = delta < 0 ? Math.max(updateInterval, unitDelay - unitRemainder) : Math.max(updateInterval, unitRemainder);
      this._timer = setTimeout(function () {
        _this2.setState({
          now: _this2.context.intl.now()
        });
      }, delay);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.scheduleNextUpdate(this.props, this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var nextValue = _ref.value; // When the `props.value` date changes, `state.now` needs to be updated,
      // and the next update can be rescheduled.

      if (!isSameDate(nextValue, this.props.value)) {
        this.setState({
          now: this.context.intl.now()
        });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      this.scheduleNextUpdate(nextProps, nextState);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this._timer);
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatRelative = _context$intl.formatRelative,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;
      var formattedRelative = formatRelative(value, _extends({}, this.props, this.state));

      if (typeof children === 'function') {
        return children(formattedRelative);
      }

      return /*#__PURE__*/react.createElement(Text, null, formattedRelative);
    }
  }]);
  return FormattedRelative;
}(react.Component);

FormattedRelative.displayName = 'FormattedRelative';
FormattedRelative.contextTypes = {
  intl: intlShape
};
FormattedRelative.defaultProps = {
  updateInterval: 1000 * 10
};
 FormattedRelative.propTypes = _extends({}, relativeFormatPropTypes, {
  value: propTypes.any.isRequired,
  format: propTypes.string,
  updateInterval: propTypes.number,
  initialNow: propTypes.any,
  children: propTypes.func
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedNumber = function (_Component) {
  inherits(FormattedNumber, _Component);

  function FormattedNumber(props, context) {
    classCallCheck(this, FormattedNumber);

    var _this = possibleConstructorReturn(this, (FormattedNumber.__proto__ || Object.getPrototypeOf(FormattedNumber)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedNumber, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatNumber = _context$intl.formatNumber,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;
      var formattedNumber = formatNumber(value, this.props);

      if (typeof children === 'function') {
        return children(formattedNumber);
      }

      return /*#__PURE__*/react.createElement(Text, null, formattedNumber);
    }
  }]);
  return FormattedNumber;
}(react.Component);

FormattedNumber.displayName = 'FormattedNumber';
FormattedNumber.contextTypes = {
  intl: intlShape
};
 FormattedNumber.propTypes = _extends({}, numberFormatPropTypes, {
  value: propTypes.any.isRequired,
  format: propTypes.string,
  children: propTypes.func
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedPlural = function (_Component) {
  inherits(FormattedPlural, _Component);

  function FormattedPlural(props, context) {
    classCallCheck(this, FormattedPlural);

    var _this = possibleConstructorReturn(this, (FormattedPlural.__proto__ || Object.getPrototypeOf(FormattedPlural)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedPlural, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatPlural = _context$intl.formatPlural,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          other = _props.other,
          children = _props.children;
      var pluralCategory = formatPlural(value, this.props);
      var formattedPlural = this.props[pluralCategory] || other;

      if (typeof children === 'function') {
        return children(formattedPlural);
      }

      return /*#__PURE__*/react.createElement(Text, null, formattedPlural);
    }
  }]);
  return FormattedPlural;
}(react.Component);

FormattedPlural.displayName = 'FormattedPlural';
FormattedPlural.contextTypes = {
  intl: intlShape
};
FormattedPlural.defaultProps = {
  style: 'cardinal'
};
 FormattedPlural.propTypes = _extends({}, pluralFormatPropTypes, {
  value: propTypes.any.isRequired,
  other: propTypes.node.isRequired,
  zero: propTypes.node,
  one: propTypes.node,
  two: propTypes.node,
  few: propTypes.node,
  many: propTypes.node,
  children: propTypes.func
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var defaultFormatMessage = function defaultFormatMessage(descriptor, values) {
  {
    console.error('[React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry. Using default message as fallback.');
  }

  return formatMessage({}, {
    getMessageFormat: memoizeFormatConstructor(intlMessageformat)
  }, descriptor, values);
};

var FormattedMessage = function (_Component) {
  inherits(FormattedMessage, _Component);

  function FormattedMessage(props, context) {
    classCallCheck(this, FormattedMessage);

    var _this = possibleConstructorReturn(this, (FormattedMessage.__proto__ || Object.getPrototypeOf(FormattedMessage)).call(this, props, context));

    if (!props.defaultMessage) {
      invariantIntlContext(context);
    }

    return _this;
  }

  createClass(FormattedMessage, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var values = this.props.values;
      var nextValues = nextProps.values;

      if (!shallowEquals(nextValues, values)) {
        return true;
      } // Since `values` has already been checked, we know they're not
      // different, so the current `values` are carried over so the shallow
      // equals comparison on the other props isn't affected by the `values`.


      var nextPropsToCheck = _extends({}, nextProps, {
        values: values
      });

      for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        next[_key - 1] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _ref = this.context.intl || {},
          _ref$formatMessage = _ref.formatMessage,
          formatMessage$$1 = _ref$formatMessage === undefined ? defaultFormatMessage : _ref$formatMessage,
          _ref$textComponent = _ref.textComponent,
          Text = _ref$textComponent === undefined ? 'span' : _ref$textComponent;

      var _props = this.props,
          id = _props.id,
          description = _props.description,
          defaultMessage = _props.defaultMessage,
          values = _props.values,
          _props$tagName = _props.tagName,
          Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
          children = _props.children;
      var tokenDelimiter = void 0;
      var tokenizedValues = void 0;
      var elements = void 0;
      var hasValues = values && Object.keys(values).length > 0;

      if (hasValues) {
        // Creates a token with a random UID that should not be guessable or
        // conflict with other parts of the `message` string.
        var uid = Math.floor(Math.random() * 0x10000000000).toString(16);

        var generateToken = function () {
          var counter = 0;
          return function () {
            return 'ELEMENT-' + uid + '-' + (counter += 1);
          };
        }(); // Splitting with a delimiter to support IE8. When using a regex
        // with a capture group IE8 does not include the capture group in
        // the resulting array.


        tokenDelimiter = '@__' + uid + '__@';
        tokenizedValues = {};
        elements = {}; // Iterates over the `props` to keep track of any React Element
        // values so they can be represented by the `token` as a placeholder
        // when the `message` is formatted. This allows the formatted
        // message to then be broken-up into parts with references to the
        // React Elements inserted back in.

        Object.keys(values).forEach(function (name) {
          var value = values[name];

          if ( /*#__PURE__*/react.isValidElement(value)) {
            var token = generateToken();
            tokenizedValues[name] = tokenDelimiter + token + tokenDelimiter;
            elements[token] = value;
          } else {
            tokenizedValues[name] = value;
          }
        });
      }

      var descriptor = {
        id: id,
        description: description,
        defaultMessage: defaultMessage
      };
      var formattedMessage = formatMessage$$1(descriptor, tokenizedValues || values);
      var nodes = void 0;
      var hasElements = elements && Object.keys(elements).length > 0;

      if (hasElements) {
        // Split the message into parts so the React Element values captured
        // above can be inserted back into the rendered message. This
        // approach allows messages to render with React Elements while
        // keeping React's virtual diffing working properly.
        nodes = formattedMessage.split(tokenDelimiter).filter(function (part) {
          return !!part;
        }).map(function (part) {
          return elements[part] || part;
        });
      } else {
        nodes = [formattedMessage];
      }

      if (typeof children === 'function') {
        return children.apply(undefined, toConsumableArray(nodes));
      } // Needs to use `createElement()` instead of JSX, otherwise React will
      // warn about a missing `key` prop with rich-text message formatting.


      return react.createElement.apply(undefined, [Component$$1, null].concat(toConsumableArray(nodes)));
    }
  }]);
  return FormattedMessage;
}(react.Component);

FormattedMessage.displayName = 'FormattedMessage';
FormattedMessage.contextTypes = {
  intl: intlShape
};
FormattedMessage.defaultProps = {
  values: {}
};
 FormattedMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
  values: propTypes.object,
  tagName: propTypes.oneOfType([propTypes.string, propTypes.element]),
  children: propTypes.func
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedHTMLMessage = function (_Component) {
  inherits(FormattedHTMLMessage, _Component);

  function FormattedHTMLMessage(props, context) {
    classCallCheck(this, FormattedHTMLMessage);

    var _this = possibleConstructorReturn(this, (FormattedHTMLMessage.__proto__ || Object.getPrototypeOf(FormattedHTMLMessage)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedHTMLMessage, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var values = this.props.values;
      var nextValues = nextProps.values;

      if (!shallowEquals(nextValues, values)) {
        return true;
      } // Since `values` has already been checked, we know they're not
      // different, so the current `values` are carried over so the shallow
      // equals comparison on the other props isn't affected by the `values`.


      var nextPropsToCheck = _extends({}, nextProps, {
        values: values
      });

      for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        next[_key - 1] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatHTMLMessage = _context$intl.formatHTMLMessage,
          Text = _context$intl.textComponent;
      var _props = this.props,
          id = _props.id,
          description = _props.description,
          defaultMessage = _props.defaultMessage,
          rawValues = _props.values,
          _props$tagName = _props.tagName,
          Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
          children = _props.children;
      var descriptor = {
        id: id,
        description: description,
        defaultMessage: defaultMessage
      };
      var formattedHTMLMessage = formatHTMLMessage(descriptor, rawValues);

      if (typeof children === 'function') {
        return children(formattedHTMLMessage);
      } // Since the message presumably has HTML in it, we need to set
      // `innerHTML` in order for it to be rendered and not escaped by React.
      // To be safe, all string prop values were escaped when formatting the
      // message. It is assumed that the message is not UGC, and came from the
      // developer making it more like a template.
      //
      // Note: There's a perf impact of using this component since there's no
      // way for React to do its virtual DOM diffing.


      var html = {
        __html: formattedHTMLMessage
      };
      return /*#__PURE__*/react.createElement(Component$$1, {
        dangerouslySetInnerHTML: html
      });
    }
  }]);
  return FormattedHTMLMessage;
}(react.Component);

FormattedHTMLMessage.displayName = 'FormattedHTMLMessage';
FormattedHTMLMessage.contextTypes = {
  intl: intlShape
};
FormattedHTMLMessage.defaultProps = {
  values: {}
};
 FormattedHTMLMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
  values: propTypes.object,
  tagName: propTypes.string,
  children: propTypes.func
}) ;
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

addLocaleData(defaultLocaleData);
/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

addLocaleData(allLocaleData);

const img = "data:image/png;base64,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";

const img$1 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg width='40px' height='40px' viewBox='0 0 40 40' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve' xmlns:serif='http://www.serif.com/' style='fill-rule:evenodd%3bclip-rule:evenodd%3bstroke-linecap:round%3bstroke-linejoin:round%3b'%3e%3cg id='microbit'%3e%3cpath id='Shape' d='M22.61%2c6.11L22.61%2c7L17.28%2c7L17.28%2c6.11L17.72%2c6.11L17.72%2c6.33L18.17%2c6.33L18.17%2c6.11L21.72%2c6.11L21.72%2c6.33L22.17%2c6.33L22.17%2c6.11L22.61%2c6.11Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3bstroke:%237c87a5%3bstroke-width:0.22px%3b'/%3e%3cuse id='Shape1' serif:id='Shape' xlink:href='%23_Image1' x='3.125' y='6.264' width='33.688px' height='27.477px' transform='matrix(0.990821%2c0%2c0%2c0.981319%2c0%2c0)'/%3e%3cpath id='Shape2' serif:id='Shape' d='M34.16%2c7L5.72%2c7C4.741%2c7 3.946%2c7.791 3.94%2c8.77L3.94%2c31C3.941%2c31.77 4.438%2c32.452 5.17%2c32.69C5.349%2c32.742 5.534%2c32.769 5.72%2c32.77L34.16%2c32.77C34.346%2c32.769 34.531%2c32.742 34.71%2c32.69C35.442%2c32.452 35.939%2c31.77 35.94%2c31L35.94%2c8.77C35.934%2c7.791 35.139%2c7 34.16%2c7ZM6.61%2c29.54C6.213%2c29.54 5.847%2c29.328 5.649%2c28.985C5.45%2c28.642 5.45%2c28.218 5.649%2c27.875C5.847%2c27.532 6.213%2c27.32 6.61%2c27.32C7.007%2c27.32 7.373%2c27.532 7.571%2c27.875C7.77%2c28.218 7.77%2c28.642 7.571%2c28.985C7.373%2c29.328 7.007%2c29.54 6.61%2c29.54ZM12.88%2c29.54C12.43%2c29.54 12.025%2c29.268 11.854%2c28.852C11.682%2c28.436 11.779%2c27.958 12.099%2c27.642C12.418%2c27.325 12.897%2c27.232 13.312%2c27.407C13.726%2c27.582 13.994%2c27.99 13.99%2c28.44C13.985%2c29.049 13.489%2c29.54 12.88%2c29.54ZM19.94%2c29.54C19.49%2c29.54 19.085%2c29.268 18.914%2c28.852C18.742%2c28.436 18.839%2c27.958 19.159%2c27.642C19.478%2c27.325 19.957%2c27.232 20.372%2c27.407C20.786%2c27.582 21.054%2c27.99 21.05%2c28.44C21.045%2c29.049 20.549%2c29.54 19.94%2c29.54ZM27%2c29.54C26.603%2c29.54 26.237%2c29.328 26.039%2c28.985C25.84%2c28.642 25.84%2c28.218 26.039%2c27.875C26.237%2c27.532 26.603%2c27.32 27%2c27.32C27.397%2c27.32 27.763%2c27.532 27.961%2c27.875C28.16%2c28.218 28.16%2c28.642 27.961%2c28.985C27.763%2c29.328 27.397%2c29.54 27%2c29.54ZM33.27%2c29.54C32.82%2c29.54 32.415%2c29.268 32.244%2c28.852C32.072%2c28.436 32.169%2c27.958 32.489%2c27.642C32.808%2c27.325 33.287%2c27.232 33.702%2c27.407C34.116%2c27.582 34.384%2c27.99 34.38%2c28.44C34.375%2c29.049 33.879%2c29.54 33.27%2c29.54Z' style='fill:%23414757%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape3' serif:id='Shape' d='M3.94%2c15L3.94%2c8.77C3.946%2c7.791 4.741%2c7 5.72%2c7L11.94%2c7L3.94%2c15Z' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape4' serif:id='Shape' d='M11.94%2c10.56L11.94%2c7L15.5%2c7L11.94%2c10.56Z' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape5' serif:id='Shape' d='M15.5%2c9.67L15.5%2c7L18.17%2c7L15.5%2c9.67Z' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape6' serif:id='Shape' d='M31.94%2c15.89L31.94%2c13.22L34.61%2c13.22L31.94%2c15.89Z' style='fill:%234c97ff%3bfill-rule:nonzero%3bstroke:%234c97ff%3bstroke-width:0.22px%3b'/%3e%3cpath id='Shape7' serif:id='Shape' d='M7.95%2c22.11L7.95%2c24.78L5.28%2c24.78L7.95%2c22.11Z' style='fill:%234c97ff%3bfill-rule:nonzero%3bstroke:%234c97ff%3bstroke-width:0.22px%3b'/%3e%3cpath id='Rectangle-path' d='M5.39%2c19C5.39%2c18.757 5.193%2c18.56 4.95%2c18.56L4.83%2c18.56C4.587%2c18.56 4.39%2c18.757 4.39%2c19L4.39%2c19.12C4.39%2c19.363 4.587%2c19.56 4.83%2c19.56L4.95%2c19.56C5.193%2c19.56 5.39%2c19.363 5.39%2c19.12L5.39%2c19Z' style='fill:white%3b'/%3e%3cpath id='Rectangle-path1' serif:id='Rectangle-path' d='M35.61%2c19C35.61%2c18.757 35.413%2c18.56 35.17%2c18.56L35.05%2c18.56C34.807%2c18.56 34.61%2c18.757 34.61%2c19L34.61%2c19.12C34.61%2c19.363 34.807%2c19.56 35.05%2c19.56L35.17%2c19.56C35.413%2c19.56 35.61%2c19.363 35.61%2c19.12L35.61%2c19Z' style='fill:white%3b'/%3e%3cpath id='Shape8' serif:id='Shape' d='M21.06%2c11.56C21.231%2c11.56 21.37%2c11.421 21.37%2c11.25C21.37%2c11.079 21.231%2c10.94 21.06%2c10.94C20.889%2c10.94 20.75%2c11.079 20.75%2c11.25C20.75%2c11.421 20.889%2c11.56 21.06%2c11.56' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape9' serif:id='Shape' d='M18.8%2c10.94C18.689%2c10.94 18.587%2c10.999 18.532%2c11.095C18.476%2c11.191 18.476%2c11.309 18.532%2c11.405C18.587%2c11.501 18.689%2c11.56 18.8%2c11.56C18.971%2c11.56 19.11%2c11.421 19.11%2c11.25C19.11%2c11.079 18.971%2c10.94 18.8%2c10.94' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape10' serif:id='Shape' d='M18.8%2c10.33C18.45%2c10.293 18.11%2c10.459 17.924%2c10.758C17.738%2c11.056 17.738%2c11.434 17.924%2c11.732C18.11%2c12.031 18.45%2c12.197 18.8%2c12.16L21.08%2c12.16C21.43%2c12.197 21.77%2c12.031 21.956%2c11.732C22.142%2c11.434 22.142%2c11.056 21.956%2c10.758C21.77%2c10.459 21.43%2c10.293 21.08%2c10.33L18.8%2c10.33M21.08%2c12.77L18.8%2c12.77C18.206%2c12.867 17.61%2c12.605 17.281%2c12.1C16.952%2c11.596 16.952%2c10.944 17.281%2c10.44C17.61%2c9.935 18.206%2c9.673 18.8%2c9.77L21.08%2c9.77C21.674%2c9.673 22.27%2c9.935 22.599%2c10.44C22.928%2c10.944 22.928%2c11.596 22.599%2c12.1C22.27%2c12.605 21.674%2c12.867 21.08%2c12.77' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cuse id='Rectangle-path2' serif:id='Rectangle-path' xlink:href='%23_Image2' x='5.938' y='18.388' width='5.33px' height='5.33px' transform='matrix(0.888333%2c0%2c0%2c0.888333%2c0%2c0)'/%3e%3cpath id='Rectangle-path3' serif:id='Rectangle-path' d='M10.16%2c17.22C10.16%2c16.977 9.963%2c16.78 9.72%2c16.78L6.16%2c16.78C5.917%2c16.78 5.72%2c16.977 5.72%2c17.22L5.72%2c20.78C5.72%2c21.023 5.917%2c21.22 6.16%2c21.22L9.72%2c21.22C9.963%2c21.22 10.16%2c21.023 10.16%2c20.78L10.16%2c17.22Z' style='fill:%23e6e7e8%3bstroke:%237c87a5%3bstroke-width:0.22px%3b'/%3e%3cuse id='Oval' xlink:href='%23_Image3' x='6.836' y='18.448' width='2.857px' height='2.857px' transform='matrix(0.952496%2c0%2c0%2c0.952496%2c0%2c0)'/%3e%3ccircle id='Oval1' serif:id='Oval' cx='7.94' cy='19' r='1' style='fill:%23414757%3bstroke:%23414757%3bstroke-width:0.22px%3bstroke-linecap:butt%3bstroke-linejoin:miter%3b'/%3e%3cuse id='Rectangle-path4' serif:id='Rectangle-path' xlink:href='%23_Image2' x='32.955' y='18.388' width='5.33px' height='5.33px' transform='matrix(0.888333%2c0%2c0%2c0.888333%2c0%2c0)'/%3e%3cpath id='Rectangle-path5' serif:id='Rectangle-path' d='M34.16%2c17.22C34.16%2c16.977 33.963%2c16.78 33.72%2c16.78L30.16%2c16.78C29.917%2c16.78 29.72%2c16.977 29.72%2c17.22L29.72%2c20.78C29.72%2c21.023 29.917%2c21.22 30.16%2c21.22L33.72%2c21.22C33.963%2c21.22 34.16%2c21.023 34.16%2c20.78L34.16%2c17.22Z' style='fill:%23e6e7e8%3bstroke:%237c87a5%3bstroke-width:0.22px%3b'/%3e%3cuse id='Oval2' serif:id='Oval' xlink:href='%23_Image3' x='32.033' y='18.448' width='2.857px' height='2.857px' transform='matrix(0.952496%2c0%2c0%2c0.952496%2c0%2c0)'/%3e%3ccircle id='Oval3' serif:id='Oval' cx='31.94' cy='19' r='1' style='fill:%23414757%3bstroke:%23414757%3bstroke-width:0.22px%3bstroke-linecap:butt%3bstroke-linejoin:miter%3b'/%3e%3cpath id='Rectangle-path6' serif:id='Rectangle-path' d='M15.61%2c14.82C15.61%2c14.798 15.592%2c14.78 15.57%2c14.78L14.65%2c14.78C14.628%2c14.78 14.61%2c14.798 14.61%2c14.82L14.61%2c15.74C14.61%2c15.762 14.628%2c15.78 14.65%2c15.78L15.57%2c15.78C15.592%2c15.78 15.61%2c15.762 15.61%2c15.74L15.61%2c14.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path7' serif:id='Rectangle-path' d='M15.61%2c15.48C15.61%2c15.458 15.592%2c15.44 15.57%2c15.44L14.65%2c15.44C14.628%2c15.44 14.61%2c15.458 14.61%2c15.48L14.61%2c16.4C14.61%2c16.422 14.628%2c16.44 14.65%2c16.44L15.57%2c16.44C15.592%2c16.44 15.61%2c16.422 15.61%2c16.4L15.61%2c15.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path8' serif:id='Rectangle-path' d='M15.61%2c15.04C15.61%2c15.018 15.592%2c15 15.57%2c15L14.65%2c15C14.628%2c15 14.61%2c15.018 14.61%2c15.04L14.61%2c15.96C14.61%2c15.982 14.628%2c16 14.65%2c16L15.57%2c16C15.592%2c16 15.61%2c15.982 15.61%2c15.96L15.61%2c15.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path9' serif:id='Rectangle-path' d='M18.17%2c14.82C18.17%2c14.798 18.152%2c14.78 18.13%2c14.78L17.21%2c14.78C17.188%2c14.78 17.17%2c14.798 17.17%2c14.82L17.17%2c15.74C17.17%2c15.762 17.188%2c15.78 17.21%2c15.78L18.13%2c15.78C18.152%2c15.78 18.17%2c15.762 18.17%2c15.74L18.17%2c14.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path10' serif:id='Rectangle-path' d='M18.17%2c15.48C18.17%2c15.458 18.152%2c15.44 18.13%2c15.44L17.21%2c15.44C17.188%2c15.44 17.17%2c15.458 17.17%2c15.48L17.17%2c16.4C17.17%2c16.422 17.188%2c16.44 17.21%2c16.44L18.13%2c16.44C18.152%2c16.44 18.17%2c16.422 18.17%2c16.4L18.17%2c15.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path11' serif:id='Rectangle-path' d='M18.17%2c15.04C18.17%2c15.018 18.152%2c15 18.13%2c15L17.21%2c15C17.188%2c15 17.17%2c15.018 17.17%2c15.04L17.17%2c15.96C17.17%2c15.982 17.188%2c16 17.21%2c16L18.13%2c16C18.152%2c16 18.17%2c15.982 18.17%2c15.96L18.17%2c15.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path12' serif:id='Rectangle-path' d='M20.72%2c14.82C20.72%2c14.798 20.702%2c14.78 20.68%2c14.78L19.76%2c14.78C19.738%2c14.78 19.72%2c14.798 19.72%2c14.82L19.72%2c15.74C19.72%2c15.762 19.738%2c15.78 19.76%2c15.78L20.68%2c15.78C20.702%2c15.78 20.72%2c15.762 20.72%2c15.74L20.72%2c14.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path13' serif:id='Rectangle-path' d='M20.72%2c15.48C20.72%2c15.458 20.702%2c15.44 20.68%2c15.44L19.76%2c15.44C19.738%2c15.44 19.72%2c15.458 19.72%2c15.48L19.72%2c16.4C19.72%2c16.422 19.738%2c16.44 19.76%2c16.44L20.68%2c16.44C20.702%2c16.44 20.72%2c16.422 20.72%2c16.4L20.72%2c15.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path14' serif:id='Rectangle-path' d='M20.72%2c15.04C20.72%2c15.018 20.702%2c15 20.68%2c15L19.76%2c15C19.738%2c15 19.72%2c15.018 19.72%2c15.04L19.72%2c15.96C19.72%2c15.982 19.738%2c16 19.76%2c16L20.68%2c16C20.702%2c16 20.72%2c15.982 20.72%2c15.96L20.72%2c15.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path15' serif:id='Rectangle-path' d='M23.28%2c14.82C23.28%2c14.798 23.262%2c14.78 23.24%2c14.78L22.32%2c14.78C22.298%2c14.78 22.28%2c14.798 22.28%2c14.82L22.28%2c15.74C22.28%2c15.762 22.298%2c15.78 22.32%2c15.78L23.24%2c15.78C23.262%2c15.78 23.28%2c15.762 23.28%2c15.74L23.28%2c14.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path16' serif:id='Rectangle-path' d='M23.28%2c15.48C23.28%2c15.458 23.262%2c15.44 23.24%2c15.44L22.32%2c15.44C22.298%2c15.44 22.28%2c15.458 22.28%2c15.48L22.28%2c16.4C22.28%2c16.422 22.298%2c16.44 22.32%2c16.44L23.24%2c16.44C23.262%2c16.44 23.28%2c16.422 23.28%2c16.4L23.28%2c15.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path17' serif:id='Rectangle-path' d='M23.28%2c15.04C23.28%2c15.018 23.262%2c15 23.24%2c15L22.32%2c15C22.298%2c15 22.28%2c15.018 22.28%2c15.04L22.28%2c15.96C22.28%2c15.982 22.298%2c16 22.32%2c16L23.24%2c16C23.262%2c16 23.28%2c15.982 23.28%2c15.96L23.28%2c15.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path18' serif:id='Rectangle-path' d='M25.83%2c14.82C25.83%2c14.798 25.812%2c14.78 25.79%2c14.78L24.87%2c14.78C24.848%2c14.78 24.83%2c14.798 24.83%2c14.82L24.83%2c15.74C24.83%2c15.762 24.848%2c15.78 24.87%2c15.78L25.79%2c15.78C25.812%2c15.78 25.83%2c15.762 25.83%2c15.74L25.83%2c14.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path19' serif:id='Rectangle-path' d='M25.83%2c15.48C25.83%2c15.458 25.812%2c15.44 25.79%2c15.44L24.87%2c15.44C24.848%2c15.44 24.83%2c15.458 24.83%2c15.48L24.83%2c16.4C24.83%2c16.422 24.848%2c16.44 24.87%2c16.44L25.79%2c16.44C25.812%2c16.44 25.83%2c16.422 25.83%2c16.4L25.83%2c15.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path20' serif:id='Rectangle-path' d='M25.83%2c15.04C25.83%2c15.018 25.812%2c15 25.79%2c15L24.87%2c15C24.848%2c15 24.83%2c15.018 24.83%2c15.04L24.83%2c15.96C24.83%2c15.982 24.848%2c16 24.87%2c16L25.79%2c16C25.812%2c16 25.83%2c15.982 25.83%2c15.96L25.83%2c15.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path21' serif:id='Rectangle-path' d='M15.61%2c17.32C15.61%2c17.298 15.592%2c17.28 15.57%2c17.28L14.65%2c17.28C14.628%2c17.28 14.61%2c17.298 14.61%2c17.32L14.61%2c18.24C14.61%2c18.262 14.628%2c18.28 14.65%2c18.28L15.57%2c18.28C15.592%2c18.28 15.61%2c18.262 15.61%2c18.24L15.61%2c17.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path22' serif:id='Rectangle-path' d='M15.61%2c17.98C15.61%2c17.958 15.592%2c17.94 15.57%2c17.94L14.65%2c17.94C14.628%2c17.94 14.61%2c17.958 14.61%2c17.98L14.61%2c18.9C14.61%2c18.922 14.628%2c18.94 14.65%2c18.94L15.57%2c18.94C15.592%2c18.94 15.61%2c18.922 15.61%2c18.9L15.61%2c17.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path23' serif:id='Rectangle-path' d='M15.61%2c17.54C15.61%2c17.518 15.592%2c17.5 15.57%2c17.5L14.65%2c17.5C14.628%2c17.5 14.61%2c17.518 14.61%2c17.54L14.61%2c18.46C14.61%2c18.482 14.628%2c18.5 14.65%2c18.5L15.57%2c18.5C15.592%2c18.5 15.61%2c18.482 15.61%2c18.46L15.61%2c17.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path24' serif:id='Rectangle-path' d='M18.17%2c17.32C18.17%2c17.298 18.152%2c17.28 18.13%2c17.28L17.21%2c17.28C17.188%2c17.28 17.17%2c17.298 17.17%2c17.32L17.17%2c18.24C17.17%2c18.262 17.188%2c18.28 17.21%2c18.28L18.13%2c18.28C18.152%2c18.28 18.17%2c18.262 18.17%2c18.24L18.17%2c17.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path25' serif:id='Rectangle-path' d='M18.17%2c17.98C18.17%2c17.958 18.152%2c17.94 18.13%2c17.94L17.21%2c17.94C17.188%2c17.94 17.17%2c17.958 17.17%2c17.98L17.17%2c18.9C17.17%2c18.922 17.188%2c18.94 17.21%2c18.94L18.13%2c18.94C18.152%2c18.94 18.17%2c18.922 18.17%2c18.9L18.17%2c17.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path26' serif:id='Rectangle-path' d='M18.17%2c17.54C18.17%2c17.518 18.152%2c17.5 18.13%2c17.5L17.21%2c17.5C17.188%2c17.5 17.17%2c17.518 17.17%2c17.54L17.17%2c18.46C17.17%2c18.482 17.188%2c18.5 17.21%2c18.5L18.13%2c18.5C18.152%2c18.5 18.17%2c18.482 18.17%2c18.46L18.17%2c17.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path27' serif:id='Rectangle-path' d='M20.72%2c17.32C20.72%2c17.298 20.702%2c17.28 20.68%2c17.28L19.76%2c17.28C19.738%2c17.28 19.72%2c17.298 19.72%2c17.32L19.72%2c18.24C19.72%2c18.262 19.738%2c18.28 19.76%2c18.28L20.68%2c18.28C20.702%2c18.28 20.72%2c18.262 20.72%2c18.24L20.72%2c17.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path28' serif:id='Rectangle-path' d='M20.72%2c17.98C20.72%2c17.958 20.702%2c17.94 20.68%2c17.94L19.76%2c17.94C19.738%2c17.94 19.72%2c17.958 19.72%2c17.98L19.72%2c18.9C19.72%2c18.922 19.738%2c18.94 19.76%2c18.94L20.68%2c18.94C20.702%2c18.94 20.72%2c18.922 20.72%2c18.9L20.72%2c17.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path29' serif:id='Rectangle-path' d='M20.72%2c17.54C20.72%2c17.518 20.702%2c17.5 20.68%2c17.5L19.76%2c17.5C19.738%2c17.5 19.72%2c17.518 19.72%2c17.54L19.72%2c18.46C19.72%2c18.482 19.738%2c18.5 19.76%2c18.5L20.68%2c18.5C20.702%2c18.5 20.72%2c18.482 20.72%2c18.46L20.72%2c17.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path30' serif:id='Rectangle-path' d='M23.28%2c17.32C23.28%2c17.298 23.262%2c17.28 23.24%2c17.28L22.32%2c17.28C22.298%2c17.28 22.28%2c17.298 22.28%2c17.32L22.28%2c18.24C22.28%2c18.262 22.298%2c18.28 22.32%2c18.28L23.24%2c18.28C23.262%2c18.28 23.28%2c18.262 23.28%2c18.24L23.28%2c17.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path31' serif:id='Rectangle-path' d='M23.28%2c17.98C23.28%2c17.958 23.262%2c17.94 23.24%2c17.94L22.32%2c17.94C22.298%2c17.94 22.28%2c17.958 22.28%2c17.98L22.28%2c18.9C22.28%2c18.922 22.298%2c18.94 22.32%2c18.94L23.24%2c18.94C23.262%2c18.94 23.28%2c18.922 23.28%2c18.9L23.28%2c17.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path32' serif:id='Rectangle-path' d='M23.28%2c17.54C23.28%2c17.518 23.262%2c17.5 23.24%2c17.5L22.32%2c17.5C22.298%2c17.5 22.28%2c17.518 22.28%2c17.54L22.28%2c18.46C22.28%2c18.482 22.298%2c18.5 22.32%2c18.5L23.24%2c18.5C23.262%2c18.5 23.28%2c18.482 23.28%2c18.46L23.28%2c17.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path33' serif:id='Rectangle-path' d='M25.83%2c17.32C25.83%2c17.298 25.812%2c17.28 25.79%2c17.28L24.87%2c17.28C24.848%2c17.28 24.83%2c17.298 24.83%2c17.32L24.83%2c18.24C24.83%2c18.262 24.848%2c18.28 24.87%2c18.28L25.79%2c18.28C25.812%2c18.28 25.83%2c18.262 25.83%2c18.24L25.83%2c17.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path34' serif:id='Rectangle-path' d='M25.83%2c17.98C25.83%2c17.958 25.812%2c17.94 25.79%2c17.94L24.87%2c17.94C24.848%2c17.94 24.83%2c17.958 24.83%2c17.98L24.83%2c18.9C24.83%2c18.922 24.848%2c18.94 24.87%2c18.94L25.79%2c18.94C25.812%2c18.94 25.83%2c18.922 25.83%2c18.9L25.83%2c17.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path35' serif:id='Rectangle-path' d='M25.83%2c17.54C25.83%2c17.518 25.812%2c17.5 25.79%2c17.5L24.87%2c17.5C24.848%2c17.5 24.83%2c17.518 24.83%2c17.54L24.83%2c18.46C24.83%2c18.482 24.848%2c18.5 24.87%2c18.5L25.79%2c18.5C25.812%2c18.5 25.83%2c18.482 25.83%2c18.46L25.83%2c17.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path36' serif:id='Rectangle-path' d='M15.61%2c19.82C15.61%2c19.798 15.592%2c19.78 15.57%2c19.78L14.65%2c19.78C14.628%2c19.78 14.61%2c19.798 14.61%2c19.82L14.61%2c20.74C14.61%2c20.762 14.628%2c20.78 14.65%2c20.78L15.57%2c20.78C15.592%2c20.78 15.61%2c20.762 15.61%2c20.74L15.61%2c19.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path37' serif:id='Rectangle-path' d='M15.61%2c20.48C15.61%2c20.458 15.592%2c20.44 15.57%2c20.44L14.65%2c20.44C14.628%2c20.44 14.61%2c20.458 14.61%2c20.48L14.61%2c21.4C14.61%2c21.422 14.628%2c21.44 14.65%2c21.44L15.57%2c21.44C15.592%2c21.44 15.61%2c21.422 15.61%2c21.4L15.61%2c20.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path38' serif:id='Rectangle-path' d='M15.61%2c20.04C15.61%2c20.018 15.592%2c20 15.57%2c20L14.65%2c20C14.628%2c20 14.61%2c20.018 14.61%2c20.04L14.61%2c20.96C14.61%2c20.982 14.628%2c21 14.65%2c21L15.57%2c21C15.592%2c21 15.61%2c20.982 15.61%2c20.96L15.61%2c20.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path39' serif:id='Rectangle-path' d='M18.17%2c19.82C18.17%2c19.798 18.152%2c19.78 18.13%2c19.78L17.21%2c19.78C17.188%2c19.78 17.17%2c19.798 17.17%2c19.82L17.17%2c20.74C17.17%2c20.762 17.188%2c20.78 17.21%2c20.78L18.13%2c20.78C18.152%2c20.78 18.17%2c20.762 18.17%2c20.74L18.17%2c19.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path40' serif:id='Rectangle-path' d='M18.17%2c20.48C18.17%2c20.458 18.152%2c20.44 18.13%2c20.44L17.21%2c20.44C17.188%2c20.44 17.17%2c20.458 17.17%2c20.48L17.17%2c21.4C17.17%2c21.422 17.188%2c21.44 17.21%2c21.44L18.13%2c21.44C18.152%2c21.44 18.17%2c21.422 18.17%2c21.4L18.17%2c20.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path41' serif:id='Rectangle-path' d='M18.17%2c20.04C18.17%2c20.018 18.152%2c20 18.13%2c20L17.21%2c20C17.188%2c20 17.17%2c20.018 17.17%2c20.04L17.17%2c20.96C17.17%2c20.982 17.188%2c21 17.21%2c21L18.13%2c21C18.152%2c21 18.17%2c20.982 18.17%2c20.96L18.17%2c20.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path42' serif:id='Rectangle-path' d='M20.72%2c19.82C20.72%2c19.798 20.702%2c19.78 20.68%2c19.78L19.76%2c19.78C19.738%2c19.78 19.72%2c19.798 19.72%2c19.82L19.72%2c20.74C19.72%2c20.762 19.738%2c20.78 19.76%2c20.78L20.68%2c20.78C20.702%2c20.78 20.72%2c20.762 20.72%2c20.74L20.72%2c19.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path43' serif:id='Rectangle-path' d='M20.72%2c20.48C20.72%2c20.458 20.702%2c20.44 20.68%2c20.44L19.76%2c20.44C19.738%2c20.44 19.72%2c20.458 19.72%2c20.48L19.72%2c21.4C19.72%2c21.422 19.738%2c21.44 19.76%2c21.44L20.68%2c21.44C20.702%2c21.44 20.72%2c21.422 20.72%2c21.4L20.72%2c20.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path44' serif:id='Rectangle-path' d='M20.72%2c20.04C20.72%2c20.018 20.702%2c20 20.68%2c20L19.76%2c20C19.738%2c20 19.72%2c20.018 19.72%2c20.04L19.72%2c20.96C19.72%2c20.982 19.738%2c21 19.76%2c21L20.68%2c21C20.702%2c21 20.72%2c20.982 20.72%2c20.96L20.72%2c20.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path45' serif:id='Rectangle-path' d='M23.28%2c19.82C23.28%2c19.798 23.262%2c19.78 23.24%2c19.78L22.32%2c19.78C22.298%2c19.78 22.28%2c19.798 22.28%2c19.82L22.28%2c20.74C22.28%2c20.762 22.298%2c20.78 22.32%2c20.78L23.24%2c20.78C23.262%2c20.78 23.28%2c20.762 23.28%2c20.74L23.28%2c19.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path46' serif:id='Rectangle-path' d='M23.28%2c20.48C23.28%2c20.458 23.262%2c20.44 23.24%2c20.44L22.32%2c20.44C22.298%2c20.44 22.28%2c20.458 22.28%2c20.48L22.28%2c21.4C22.28%2c21.422 22.298%2c21.44 22.32%2c21.44L23.24%2c21.44C23.262%2c21.44 23.28%2c21.422 23.28%2c21.4L23.28%2c20.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path47' serif:id='Rectangle-path' d='M23.28%2c20.04C23.28%2c20.018 23.262%2c20 23.24%2c20L22.32%2c20C22.298%2c20 22.28%2c20.018 22.28%2c20.04L22.28%2c20.96C22.28%2c20.982 22.298%2c21 22.32%2c21L23.24%2c21C23.262%2c21 23.28%2c20.982 23.28%2c20.96L23.28%2c20.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path48' serif:id='Rectangle-path' d='M25.83%2c19.82C25.83%2c19.798 25.812%2c19.78 25.79%2c19.78L24.87%2c19.78C24.848%2c19.78 24.83%2c19.798 24.83%2c19.82L24.83%2c20.74C24.83%2c20.762 24.848%2c20.78 24.87%2c20.78L25.79%2c20.78C25.812%2c20.78 25.83%2c20.762 25.83%2c20.74L25.83%2c19.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path49' serif:id='Rectangle-path' d='M25.83%2c20.48C25.83%2c20.458 25.812%2c20.44 25.79%2c20.44L24.87%2c20.44C24.848%2c20.44 24.83%2c20.458 24.83%2c20.48L24.83%2c21.4C24.83%2c21.422 24.848%2c21.44 24.87%2c21.44L25.79%2c21.44C25.812%2c21.44 25.83%2c21.422 25.83%2c21.4L25.83%2c20.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path50' serif:id='Rectangle-path' d='M25.83%2c20.04C25.83%2c20.018 25.812%2c20 25.79%2c20L24.87%2c20C24.848%2c20 24.83%2c20.018 24.83%2c20.04L24.83%2c20.96C24.83%2c20.982 24.848%2c21 24.87%2c21L25.79%2c21C25.812%2c21 25.83%2c20.982 25.83%2c20.96L25.83%2c20.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path51' serif:id='Rectangle-path' d='M15.61%2c22.32C15.61%2c22.298 15.592%2c22.28 15.57%2c22.28L14.65%2c22.28C14.628%2c22.28 14.61%2c22.298 14.61%2c22.32L14.61%2c23.24C14.61%2c23.262 14.628%2c23.28 14.65%2c23.28L15.57%2c23.28C15.592%2c23.28 15.61%2c23.262 15.61%2c23.24L15.61%2c22.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path52' serif:id='Rectangle-path' d='M15.61%2c22.98C15.61%2c22.958 15.592%2c22.94 15.57%2c22.94L14.65%2c22.94C14.628%2c22.94 14.61%2c22.958 14.61%2c22.98L14.61%2c23.9C14.61%2c23.922 14.628%2c23.94 14.65%2c23.94L15.57%2c23.94C15.592%2c23.94 15.61%2c23.922 15.61%2c23.9L15.61%2c22.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path53' serif:id='Rectangle-path' d='M15.61%2c22.54C15.61%2c22.518 15.592%2c22.5 15.57%2c22.5L14.65%2c22.5C14.628%2c22.5 14.61%2c22.518 14.61%2c22.54L14.61%2c23.46C14.61%2c23.482 14.628%2c23.5 14.65%2c23.5L15.57%2c23.5C15.592%2c23.5 15.61%2c23.482 15.61%2c23.46L15.61%2c22.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path54' serif:id='Rectangle-path' d='M18.17%2c22.32C18.17%2c22.298 18.152%2c22.28 18.13%2c22.28L17.21%2c22.28C17.188%2c22.28 17.17%2c22.298 17.17%2c22.32L17.17%2c23.24C17.17%2c23.262 17.188%2c23.28 17.21%2c23.28L18.13%2c23.28C18.152%2c23.28 18.17%2c23.262 18.17%2c23.24L18.17%2c22.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path55' serif:id='Rectangle-path' d='M18.17%2c22.98C18.17%2c22.958 18.152%2c22.94 18.13%2c22.94L17.21%2c22.94C17.188%2c22.94 17.17%2c22.958 17.17%2c22.98L17.17%2c23.9C17.17%2c23.922 17.188%2c23.94 17.21%2c23.94L18.13%2c23.94C18.152%2c23.94 18.17%2c23.922 18.17%2c23.9L18.17%2c22.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path56' serif:id='Rectangle-path' d='M18.17%2c22.54C18.17%2c22.518 18.152%2c22.5 18.13%2c22.5L17.21%2c22.5C17.188%2c22.5 17.17%2c22.518 17.17%2c22.54L17.17%2c23.46C17.17%2c23.482 17.188%2c23.5 17.21%2c23.5L18.13%2c23.5C18.152%2c23.5 18.17%2c23.482 18.17%2c23.46L18.17%2c22.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path57' serif:id='Rectangle-path' d='M20.72%2c22.32C20.72%2c22.298 20.702%2c22.28 20.68%2c22.28L19.76%2c22.28C19.738%2c22.28 19.72%2c22.298 19.72%2c22.32L19.72%2c23.24C19.72%2c23.262 19.738%2c23.28 19.76%2c23.28L20.68%2c23.28C20.702%2c23.28 20.72%2c23.262 20.72%2c23.24L20.72%2c22.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path58' serif:id='Rectangle-path' d='M20.72%2c22.98C20.72%2c22.958 20.702%2c22.94 20.68%2c22.94L19.76%2c22.94C19.738%2c22.94 19.72%2c22.958 19.72%2c22.98L19.72%2c23.9C19.72%2c23.922 19.738%2c23.94 19.76%2c23.94L20.68%2c23.94C20.702%2c23.94 20.72%2c23.922 20.72%2c23.9L20.72%2c22.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path59' serif:id='Rectangle-path' d='M20.72%2c22.54C20.72%2c22.518 20.702%2c22.5 20.68%2c22.5L19.76%2c22.5C19.738%2c22.5 19.72%2c22.518 19.72%2c22.54L19.72%2c23.46C19.72%2c23.482 19.738%2c23.5 19.76%2c23.5L20.68%2c23.5C20.702%2c23.5 20.72%2c23.482 20.72%2c23.46L20.72%2c22.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path60' serif:id='Rectangle-path' d='M23.28%2c22.32C23.28%2c22.298 23.262%2c22.28 23.24%2c22.28L22.32%2c22.28C22.298%2c22.28 22.28%2c22.298 22.28%2c22.32L22.28%2c23.24C22.28%2c23.262 22.298%2c23.28 22.32%2c23.28L23.24%2c23.28C23.262%2c23.28 23.28%2c23.262 23.28%2c23.24L23.28%2c22.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path61' serif:id='Rectangle-path' d='M23.28%2c22.98C23.28%2c22.958 23.262%2c22.94 23.24%2c22.94L22.32%2c22.94C22.298%2c22.94 22.28%2c22.958 22.28%2c22.98L22.28%2c23.9C22.28%2c23.922 22.298%2c23.94 22.32%2c23.94L23.24%2c23.94C23.262%2c23.94 23.28%2c23.922 23.28%2c23.9L23.28%2c22.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path62' serif:id='Rectangle-path' d='M23.28%2c22.54C23.28%2c22.518 23.262%2c22.5 23.24%2c22.5L22.32%2c22.5C22.298%2c22.5 22.28%2c22.518 22.28%2c22.54L22.28%2c23.46C22.28%2c23.482 22.298%2c23.5 22.32%2c23.5L23.24%2c23.5C23.262%2c23.5 23.28%2c23.482 23.28%2c23.46L23.28%2c22.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path63' serif:id='Rectangle-path' d='M25.83%2c22.32C25.83%2c22.298 25.812%2c22.28 25.79%2c22.28L24.87%2c22.28C24.848%2c22.28 24.83%2c22.298 24.83%2c22.32L24.83%2c23.24C24.83%2c23.262 24.848%2c23.28 24.87%2c23.28L25.79%2c23.28C25.812%2c23.28 25.83%2c23.262 25.83%2c23.24L25.83%2c22.32Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path64' serif:id='Rectangle-path' d='M25.83%2c22.98C25.83%2c22.958 25.812%2c22.94 25.79%2c22.94L24.87%2c22.94C24.848%2c22.94 24.83%2c22.958 24.83%2c22.98L24.83%2c23.9C24.83%2c23.922 24.848%2c23.94 24.87%2c23.94L25.79%2c23.94C25.812%2c23.94 25.83%2c23.922 25.83%2c23.9L25.83%2c22.98Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path65' serif:id='Rectangle-path' d='M25.83%2c22.54C25.83%2c22.518 25.812%2c22.5 25.79%2c22.5L24.87%2c22.5C24.848%2c22.5 24.83%2c22.518 24.83%2c22.54L24.83%2c23.46C24.83%2c23.482 24.848%2c23.5 24.87%2c23.5L25.79%2c23.5C25.812%2c23.5 25.83%2c23.482 25.83%2c23.46L25.83%2c22.54Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path66' serif:id='Rectangle-path' d='M15.61%2c24.82C15.61%2c24.798 15.592%2c24.78 15.57%2c24.78L14.65%2c24.78C14.628%2c24.78 14.61%2c24.798 14.61%2c24.82L14.61%2c25.74C14.61%2c25.762 14.628%2c25.78 14.65%2c25.78L15.57%2c25.78C15.592%2c25.78 15.61%2c25.762 15.61%2c25.74L15.61%2c24.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path67' serif:id='Rectangle-path' d='M15.61%2c25.48C15.61%2c25.458 15.592%2c25.44 15.57%2c25.44L14.65%2c25.44C14.628%2c25.44 14.61%2c25.458 14.61%2c25.48L14.61%2c26.4C14.61%2c26.422 14.628%2c26.44 14.65%2c26.44L15.57%2c26.44C15.592%2c26.44 15.61%2c26.422 15.61%2c26.4L15.61%2c25.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path68' serif:id='Rectangle-path' d='M15.61%2c25.04C15.61%2c25.018 15.592%2c25 15.57%2c25L14.65%2c25C14.628%2c25 14.61%2c25.018 14.61%2c25.04L14.61%2c25.96C14.61%2c25.982 14.628%2c26 14.65%2c26L15.57%2c26C15.592%2c26 15.61%2c25.982 15.61%2c25.96L15.61%2c25.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path69' serif:id='Rectangle-path' d='M18.17%2c24.82C18.17%2c24.798 18.152%2c24.78 18.13%2c24.78L17.21%2c24.78C17.188%2c24.78 17.17%2c24.798 17.17%2c24.82L17.17%2c25.74C17.17%2c25.762 17.188%2c25.78 17.21%2c25.78L18.13%2c25.78C18.152%2c25.78 18.17%2c25.762 18.17%2c25.74L18.17%2c24.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path70' serif:id='Rectangle-path' d='M18.17%2c25.48C18.17%2c25.458 18.152%2c25.44 18.13%2c25.44L17.21%2c25.44C17.188%2c25.44 17.17%2c25.458 17.17%2c25.48L17.17%2c26.4C17.17%2c26.422 17.188%2c26.44 17.21%2c26.44L18.13%2c26.44C18.152%2c26.44 18.17%2c26.422 18.17%2c26.4L18.17%2c25.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path71' serif:id='Rectangle-path' d='M18.17%2c25.04C18.17%2c25.018 18.152%2c25 18.13%2c25L17.21%2c25C17.188%2c25 17.17%2c25.018 17.17%2c25.04L17.17%2c25.96C17.17%2c25.982 17.188%2c26 17.21%2c26L18.13%2c26C18.152%2c26 18.17%2c25.982 18.17%2c25.96L18.17%2c25.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path72' serif:id='Rectangle-path' d='M20.72%2c24.82C20.72%2c24.798 20.702%2c24.78 20.68%2c24.78L19.76%2c24.78C19.738%2c24.78 19.72%2c24.798 19.72%2c24.82L19.72%2c25.74C19.72%2c25.762 19.738%2c25.78 19.76%2c25.78L20.68%2c25.78C20.702%2c25.78 20.72%2c25.762 20.72%2c25.74L20.72%2c24.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path73' serif:id='Rectangle-path' d='M20.72%2c25.48C20.72%2c25.458 20.702%2c25.44 20.68%2c25.44L19.76%2c25.44C19.738%2c25.44 19.72%2c25.458 19.72%2c25.48L19.72%2c26.4C19.72%2c26.422 19.738%2c26.44 19.76%2c26.44L20.68%2c26.44C20.702%2c26.44 20.72%2c26.422 20.72%2c26.4L20.72%2c25.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path74' serif:id='Rectangle-path' d='M20.72%2c25.04C20.72%2c25.018 20.702%2c25 20.68%2c25L19.76%2c25C19.738%2c25 19.72%2c25.018 19.72%2c25.04L19.72%2c25.96C19.72%2c25.982 19.738%2c26 19.76%2c26L20.68%2c26C20.702%2c26 20.72%2c25.982 20.72%2c25.96L20.72%2c25.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path75' serif:id='Rectangle-path' d='M23.28%2c24.82C23.28%2c24.798 23.262%2c24.78 23.24%2c24.78L22.32%2c24.78C22.298%2c24.78 22.28%2c24.798 22.28%2c24.82L22.28%2c25.74C22.28%2c25.762 22.298%2c25.78 22.32%2c25.78L23.24%2c25.78C23.262%2c25.78 23.28%2c25.762 23.28%2c25.74L23.28%2c24.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path76' serif:id='Rectangle-path' d='M23.28%2c25.48C23.28%2c25.458 23.262%2c25.44 23.24%2c25.44L22.32%2c25.44C22.298%2c25.44 22.28%2c25.458 22.28%2c25.48L22.28%2c26.4C22.28%2c26.422 22.298%2c26.44 22.32%2c26.44L23.24%2c26.44C23.262%2c26.44 23.28%2c26.422 23.28%2c26.4L23.28%2c25.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path77' serif:id='Rectangle-path' d='M23.28%2c25.04C23.28%2c25.018 23.262%2c25 23.24%2c25L22.32%2c25C22.298%2c25 22.28%2c25.018 22.28%2c25.04L22.28%2c25.96C22.28%2c25.982 22.298%2c26 22.32%2c26L23.24%2c26C23.262%2c26 23.28%2c25.982 23.28%2c25.96L23.28%2c25.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Rectangle-path78' serif:id='Rectangle-path' d='M25.83%2c24.82C25.83%2c24.798 25.812%2c24.78 25.79%2c24.78L24.87%2c24.78C24.848%2c24.78 24.83%2c24.798 24.83%2c24.82L24.83%2c25.74C24.83%2c25.762 24.848%2c25.78 24.87%2c25.78L25.79%2c25.78C25.812%2c25.78 25.83%2c25.762 25.83%2c25.74L25.83%2c24.82Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3b'/%3e%3cpath id='Rectangle-path79' serif:id='Rectangle-path' d='M25.83%2c25.48C25.83%2c25.458 25.812%2c25.44 25.79%2c25.44L24.87%2c25.44C24.848%2c25.44 24.83%2c25.458 24.83%2c25.48L24.83%2c26.4C24.83%2c26.422 24.848%2c26.44 24.87%2c26.44L25.79%2c26.44C25.812%2c26.44 25.83%2c26.422 25.83%2c26.4L25.83%2c25.48Z' style='fill:%23231f20%3bfill-opacity:0.25%3b'/%3e%3cpath id='Rectangle-path80' serif:id='Rectangle-path' d='M25.83%2c25.04C25.83%2c25.018 25.812%2c25 25.79%2c25L24.87%2c25C24.848%2c25 24.83%2c25.018 24.83%2c25.04L24.83%2c25.96C24.83%2c25.982 24.848%2c26 24.87%2c26L25.79%2c26C25.812%2c26 25.83%2c25.982 25.83%2c25.96L25.83%2c25.04Z' style='fill:%23e6e7e8%3b'/%3e%3cpath id='Shape11' serif:id='Shape' d='M4.94%2c29.67L4.94%2c32.58C4.739%2c32.479 4.559%2c32.339 4.41%2c32.17L4.41%2c29.67L4.94%2c29.67Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape12' serif:id='Shape' d='M5.58%2c32.77L5.7%2c32.77L5.7%2c29.67L5.17%2c29.67L5.17%2c32.69L5.58%2c32.77Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3crect id='Rectangle-path81' serif:id='Rectangle-path' x='5.96' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path82' serif:id='Rectangle-path' x='6.74' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path83' serif:id='Rectangle-path' x='7.53' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path84' serif:id='Rectangle-path' x='8.31' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path85' serif:id='Rectangle-path' x='9.09' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path86' serif:id='Rectangle-path' x='9.88' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path87' serif:id='Rectangle-path' x='10.66' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path88' serif:id='Rectangle-path' x='11.45' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path89' serif:id='Rectangle-path' x='12.23' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path90' serif:id='Rectangle-path' x='13.02' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path91' serif:id='Rectangle-path' x='13.8' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path92' serif:id='Rectangle-path' x='14.58' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path93' serif:id='Rectangle-path' x='15.37' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path94' serif:id='Rectangle-path' x='16.15' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path95' serif:id='Rectangle-path' x='16.94' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path96' serif:id='Rectangle-path' x='17.72' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path97' serif:id='Rectangle-path' x='18.51' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path98' serif:id='Rectangle-path' x='19.29' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path99' serif:id='Rectangle-path' x='20.08' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path100' serif:id='Rectangle-path' x='20.86' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path101' serif:id='Rectangle-path' x='21.64' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path102' serif:id='Rectangle-path' x='22.43' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path103' serif:id='Rectangle-path' x='23.21' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path104' serif:id='Rectangle-path' x='24' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path105' serif:id='Rectangle-path' x='24.78' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path106' serif:id='Rectangle-path' x='25.56' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path107' serif:id='Rectangle-path' x='26.35' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path108' serif:id='Rectangle-path' x='27.13' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path109' serif:id='Rectangle-path' x='27.92' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path110' serif:id='Rectangle-path' x='28.7' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path111' serif:id='Rectangle-path' x='29.49' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path112' serif:id='Rectangle-path' x='30.27' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path113' serif:id='Rectangle-path' x='31.06' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path114' serif:id='Rectangle-path' x='31.84' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path115' serif:id='Rectangle-path' x='32.62' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path116' serif:id='Rectangle-path' x='33.41' y='29.67' width='1' height='3.1' style='fill:%23ffbf00%3b'/%3e%3cpath id='Shape13' serif:id='Shape' d='M34.31%2c32.77L34.19%2c32.77L34.19%2c29.67L34.72%2c29.67L34.72%2c32.69L34.31%2c32.77Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape14' serif:id='Shape' d='M35.5%2c29.67L35.5%2c32.17C35.351%2c32.339 35.171%2c32.479 34.97%2c32.58L34.97%2c29.67L35.5%2c29.67Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape15' serif:id='Shape' d='M6.61%2c29.54C6.213%2c29.54 5.847%2c29.328 5.649%2c28.985C5.45%2c28.642 5.45%2c28.218 5.649%2c27.875C5.847%2c27.532 6.213%2c27.32 6.61%2c27.32C7.007%2c27.32 7.373%2c27.532 7.571%2c27.875C7.77%2c28.218 7.77%2c28.642 7.571%2c28.985C7.373%2c29.328 7.007%2c29.54 6.61%2c29.54ZM5.72%2c32.77L8.04%2c32.77L8.04%2c28.44C7.978%2c27.694 7.354%2c27.12 6.605%2c27.12C5.856%2c27.12 5.232%2c27.694 5.17%2c28.44L5.17%2c32.7L5.72%2c32.77Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape16' serif:id='Shape' d='M13.94%2c27.44C13.531%2c27.029 12.915%2c26.904 12.378%2c27.122C11.84%2c27.341 11.487%2c27.86 11.48%2c28.44L11.48%2c32.78L14.36%2c32.78L14.36%2c28.44C14.357%2c28.064 14.206%2c27.705 13.94%2c27.44ZM12.94%2c29.56C12.487%2c29.584 12.065%2c29.331 11.874%2c28.92C11.682%2c28.509 11.76%2c28.023 12.07%2c27.692C12.38%2c27.362 12.86%2c27.253 13.283%2c27.417C13.705%2c27.582 13.985%2c27.987 13.99%2c28.44C13.985%2c29.049 13.489%2c29.54 12.88%2c29.54L12.94%2c29.56Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape17' serif:id='Shape' d='M20.94%2c27.44C20.531%2c27.029 19.915%2c26.904 19.378%2c27.122C18.84%2c27.341 18.487%2c27.86 18.48%2c28.44L18.48%2c32.78L21.36%2c32.78L21.36%2c28.44C21.357%2c28.064 21.206%2c27.705 20.94%2c27.44ZM19.94%2c29.54C19.49%2c29.54 19.085%2c29.268 18.914%2c28.852C18.742%2c28.436 18.839%2c27.958 19.159%2c27.642C19.478%2c27.325 19.957%2c27.232 20.372%2c27.407C20.786%2c27.582 21.054%2c27.99 21.05%2c28.44C21.045%2c29.049 20.549%2c29.54 19.94%2c29.54Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape18' serif:id='Shape' d='M28.02%2c27.44C27.611%2c27.029 26.995%2c26.904 26.458%2c27.122C25.92%2c27.341 25.567%2c27.86 25.56%2c28.44L25.56%2c32.78L28.44%2c32.78L28.44%2c28.44C28.437%2c28.064 28.286%2c27.705 28.02%2c27.44ZM27.02%2c29.56C26.407%2c29.56 25.91%2c29.063 25.91%2c28.45C25.91%2c27.837 26.407%2c27.34 27.02%2c27.34C27.633%2c27.34 28.13%2c27.837 28.13%2c28.45C28.13%2c29.063 27.633%2c29.56 27.02%2c29.56Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape19' serif:id='Shape' d='M34.29%2c27.44C33.88%2c27.036 33.269%2c26.915 32.736%2c27.133C32.203%2c27.35 31.85%2c27.864 31.84%2c28.44L31.84%2c32.78L34.16%2c32.78L34.71%2c32.7L34.71%2c28.44C34.707%2c28.064 34.556%2c27.705 34.29%2c27.44ZM33.29%2c29.56C32.84%2c29.568 32.43%2c29.304 32.251%2c28.891C32.073%2c28.478 32.161%2c27.998 32.475%2c27.676C32.788%2c27.354 33.266%2c27.252 33.683%2c27.42C34.101%2c27.587 34.376%2c27.99 34.38%2c28.44C34.375%2c29.049 33.879%2c29.54 33.27%2c29.54L33.29%2c29.56Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='_0' serif:id='0' d='M6.481%2c30.828C6.481%2c30.85 6.482%2c30.877 6.483%2c30.909C6.485%2c30.94 6.489%2c30.97 6.497%2c31C6.505%2c31.029 6.517%2c31.054 6.534%2c31.075C6.551%2c31.095 6.576%2c31.106 6.607%2c31.106C6.64%2c31.106 6.665%2c31.095 6.682%2c31.075C6.7%2c31.054 6.712%2c31.029 6.72%2c31C6.728%2c30.97 6.733%2c30.94 6.734%2c30.909C6.735%2c30.877 6.736%2c30.85 6.736%2c30.828C6.736%2c30.815 6.736%2c30.799 6.736%2c30.78C6.735%2c30.761 6.734%2c30.742 6.731%2c30.722C6.729%2c30.702 6.725%2c30.682 6.72%2c30.662C6.715%2c30.643 6.708%2c30.625 6.698%2c30.61C6.689%2c30.594 6.677%2c30.581 6.662%2c30.572C6.647%2c30.562 6.629%2c30.557 6.607%2c30.557C6.586%2c30.557 6.568%2c30.562 6.554%2c30.572C6.539%2c30.581 6.527%2c30.594 6.518%2c30.61C6.509%2c30.625 6.502%2c30.643 6.496%2c30.662C6.491%2c30.682 6.488%2c30.702 6.485%2c30.722C6.483%2c30.742 6.482%2c30.761 6.481%2c30.78C6.481%2c30.799 6.481%2c30.815 6.481%2c30.828ZM6.323%2c30.828C6.323%2c30.753 6.331%2c30.689 6.346%2c30.638C6.361%2c30.586 6.382%2c30.545 6.408%2c30.514C6.434%2c30.483 6.464%2c30.461 6.498%2c30.447C6.533%2c30.434 6.569%2c30.427 6.607%2c30.427C6.647%2c30.427 6.684%2c30.434 6.718%2c30.447C6.752%2c30.461 6.783%2c30.483 6.809%2c30.514C6.835%2c30.545 6.856%2c30.586 6.871%2c30.638C6.886%2c30.689 6.894%2c30.753 6.894%2c30.828C6.894%2c30.906 6.886%2c30.971 6.871%2c31.023C6.856%2c31.075 6.835%2c31.117 6.809%2c31.148C6.783%2c31.179 6.752%2c31.201 6.718%2c31.214C6.684%2c31.228 6.647%2c31.234 6.607%2c31.234C6.569%2c31.234 6.533%2c31.228 6.498%2c31.214C6.464%2c31.201 6.434%2c31.179 6.408%2c31.148C6.382%2c31.117 6.361%2c31.075 6.346%2c31.023C6.331%2c30.971 6.323%2c30.906 6.323%2c30.828Z' style='fill:%23575e75%3b'/%3e%3cpath id='A' d='M7.236%2c24.234L7.442%2c24.234L7.342%2c23.943L7.34%2c23.943L7.236%2c24.234ZM7.253%2c23.747L7.432%2c23.747L7.728%2c24.54L7.547%2c24.54L7.487%2c24.364L7.191%2c24.364L7.129%2c24.54L6.953%2c24.54L7.253%2c23.747Z' style='fill:%23575e75%3b'/%3e%3cpath id='B' d='M32.321%2c13.798L32.497%2c13.798C32.528%2c13.798 32.554%2c13.791 32.574%2c13.776C32.594%2c13.761 32.604%2c13.737 32.604%2c13.704C32.604%2c13.685 32.601%2c13.67 32.594%2c13.658C32.587%2c13.647 32.578%2c13.637 32.567%2c13.631C32.556%2c13.624 32.543%2c13.619 32.529%2c13.617C32.515%2c13.614 32.5%2c13.613 32.484%2c13.613L32.321%2c13.613L32.321%2c13.798ZM32.147%2c13.477L32.52%2c13.477C32.557%2c13.477 32.592%2c13.481 32.623%2c13.487C32.654%2c13.494 32.68%2c13.505 32.703%2c13.52C32.725%2c13.535 32.742%2c13.556 32.754%2c13.581C32.767%2c13.606 32.773%2c13.637 32.773%2c13.674C32.773%2c13.714 32.764%2c13.747 32.745%2c13.774C32.727%2c13.8 32.7%2c13.822 32.665%2c13.839C32.714%2c13.853 32.75%2c13.878 32.774%2c13.913C32.798%2c13.948 32.81%2c13.991 32.81%2c14.04C32.81%2c14.08 32.803%2c14.115 32.787%2c14.144C32.772%2c14.173 32.751%2c14.197 32.724%2c14.216C32.698%2c14.234 32.668%2c14.248 32.634%2c14.257C32.601%2c14.266 32.566%2c14.27 32.531%2c14.27L32.147%2c14.27L32.147%2c13.477ZM32.321%2c14.135L32.507%2c14.135C32.524%2c14.135 32.541%2c14.133 32.556%2c14.13C32.572%2c14.126 32.585%2c14.121 32.597%2c14.113C32.609%2c14.105 32.619%2c14.095 32.626%2c14.081C32.633%2c14.068 32.636%2c14.051 32.636%2c14.03C32.636%2c13.99 32.625%2c13.96 32.602%2c13.943C32.579%2c13.926 32.548%2c13.917 32.511%2c13.917L32.321%2c13.917L32.321%2c14.135Z' style='fill:%23575e75%3b'/%3e%3cpath id='_1' serif:id='1' d='M12.955%2c31.22L12.798%2c31.22L12.798%2c30.716L12.602%2c30.716L12.602%2c30.597C12.63%2c30.598 12.656%2c30.596 12.682%2c30.591C12.707%2c30.586 12.73%2c30.578 12.75%2c30.566C12.771%2c30.553 12.788%2c30.537 12.802%2c30.517C12.816%2c30.497 12.825%2c30.473 12.83%2c30.443L12.955%2c30.443L12.955%2c31.22Z' style='fill:%23575e75%3b'/%3e%3cpath id='_2' serif:id='2' d='M19.681%2c30.742C19.68%2c30.697 19.685%2c30.656 19.697%2c30.618C19.708%2c30.58 19.726%2c30.546 19.75%2c30.518C19.774%2c30.489 19.803%2c30.467 19.839%2c30.451C19.875%2c30.435 19.916%2c30.427 19.963%2c30.427C19.999%2c30.427 20.032%2c30.433 20.065%2c30.444C20.097%2c30.455 20.125%2c30.471 20.149%2c30.492C20.174%2c30.513 20.193%2c30.538 20.208%2c30.568C20.222%2c30.599 20.229%2c30.633 20.229%2c30.671C20.229%2c30.71 20.223%2c30.743 20.211%2c30.772C20.198%2c30.8 20.181%2c30.825 20.161%2c30.846C20.14%2c30.868 20.116%2c30.888 20.09%2c30.906C20.064%2c30.924 20.037%2c30.941 20.011%2c30.959C19.984%2c30.976 19.958%2c30.995 19.933%2c31.015C19.908%2c31.035 19.886%2c31.058 19.866%2c31.085L20.234%2c31.085L20.234%2c31.22L19.663%2c31.22C19.663%2c31.175 19.67%2c31.136 19.683%2c31.102C19.696%2c31.069 19.713%2c31.039 19.735%2c31.013C19.758%2c30.987 19.784%2c30.962 19.814%2c30.94C19.844%2c30.918 19.875%2c30.896 19.909%2c30.873C19.926%2c30.861 19.944%2c30.849 19.963%2c30.836C19.982%2c30.824 20%2c30.811 20.016%2c30.796C20.032%2c30.781 20.045%2c30.765 20.056%2c30.746C20.066%2c30.728 20.072%2c30.706 20.072%2c30.683C20.072%2c30.645 20.061%2c30.616 20.039%2c30.595C20.017%2c30.573 19.989%2c30.563 19.955%2c30.563C19.932%2c30.563 19.913%2c30.568 19.897%2c30.579C19.881%2c30.59 19.868%2c30.604 19.859%2c30.621C19.849%2c30.639 19.842%2c30.658 19.838%2c30.679C19.834%2c30.7 19.832%2c30.721 19.832%2c30.742L19.681%2c30.742Z' style='fill:%23575e75%3b'/%3e%3cpath id='_3v' serif:id='3v' d='M26.713%2c30.757C26.73%2c30.759 26.748%2c30.759 26.767%2c30.757C26.787%2c30.756 26.805%2c30.751 26.821%2c30.744C26.838%2c30.737 26.852%2c30.727 26.862%2c30.714C26.873%2c30.701 26.878%2c30.683 26.878%2c30.661C26.878%2c30.627 26.867%2c30.602 26.845%2c30.584C26.823%2c30.566 26.797%2c30.557 26.769%2c30.557C26.729%2c30.557 26.698%2c30.57 26.678%2c30.597C26.658%2c30.623 26.648%2c30.656 26.649%2c30.696L26.499%2c30.696C26.5%2c30.656 26.508%2c30.62 26.52%2c30.587C26.533%2c30.554 26.552%2c30.526 26.575%2c30.502C26.598%2c30.478 26.626%2c30.46 26.659%2c30.447C26.691%2c30.434 26.728%2c30.427 26.767%2c30.427C26.799%2c30.427 26.83%2c30.432 26.861%2c30.441C26.892%2c30.451 26.92%2c30.464 26.945%2c30.483C26.969%2c30.501 26.989%2c30.524 27.005%2c30.551C27.021%2c30.577 27.028%2c30.608 27.028%2c30.643C27.028%2c30.681 27.019%2c30.714 27.001%2c30.743C26.983%2c30.772 26.956%2c30.791 26.92%2c30.802L26.92%2c30.804C26.962%2c30.813 26.996%2c30.834 27.021%2c30.866C27.045%2c30.898 27.057%2c30.936 27.057%2c30.98C27.057%2c31.021 27.049%2c31.057 27.033%2c31.089C27.017%2c31.121 26.996%2c31.147 26.969%2c31.169C26.943%2c31.19 26.912%2c31.207 26.877%2c31.218C26.843%2c31.229 26.806%2c31.234 26.769%2c31.234C26.725%2c31.234 26.685%2c31.228 26.649%2c31.216C26.613%2c31.203 26.583%2c31.185 26.558%2c31.161C26.533%2c31.137 26.513%2c31.107 26.499%2c31.072C26.486%2c31.038 26.479%2c30.998 26.48%2c30.952L26.63%2c30.952C26.631%2c30.973 26.634%2c30.993 26.64%2c31.012C26.646%2c31.031 26.654%2c31.047 26.665%2c31.061C26.676%2c31.074 26.69%2c31.085 26.707%2c31.093C26.724%2c31.102 26.743%2c31.106 26.766%2c31.106C26.802%2c31.106 26.832%2c31.095 26.856%2c31.073C26.881%2c31.051 26.893%2c31.021 26.893%2c30.984C26.893%2c30.954 26.887%2c30.931 26.876%2c30.916C26.864%2c30.9 26.85%2c30.889 26.832%2c30.882C26.814%2c30.875 26.795%2c30.871 26.774%2c30.87C26.752%2c30.869 26.732%2c30.868 26.713%2c30.868L26.713%2c30.757ZM27.455%2c31.22L27.279%2c31.22L27.083%2c30.646L27.248%2c30.646L27.369%2c31.038L27.371%2c31.038L27.492%2c30.646L27.649%2c30.646L27.455%2c31.22Z' style='fill:%23575e75%3b'/%3e%3cpath id='GND' d='M32.679%2c31.13C32.648%2c31.17 32.614%2c31.198 32.576%2c31.214C32.538%2c31.23 32.5%2c31.238 32.462%2c31.238C32.401%2c31.238 32.347%2c31.227 32.298%2c31.206C32.25%2c31.185 32.209%2c31.156 32.175%2c31.119C32.142%2c31.082 32.117%2c31.039 32.099%2c30.989C32.081%2c30.939 32.072%2c30.885 32.072%2c30.827C32.072%2c30.768 32.081%2c30.713 32.099%2c30.662C32.117%2c30.612 32.142%2c30.567 32.175%2c30.53C32.209%2c30.492 32.25%2c30.462 32.298%2c30.441C32.347%2c30.419 32.401%2c30.409 32.462%2c30.409C32.502%2c30.409 32.542%2c30.415 32.58%2c30.427C32.618%2c30.439 32.653%2c30.457 32.683%2c30.481C32.714%2c30.504 32.739%2c30.534 32.759%2c30.568C32.779%2c30.603 32.791%2c30.643 32.796%2c30.688L32.629%2c30.688C32.619%2c30.644 32.599%2c30.611 32.569%2c30.588C32.54%2c30.566 32.504%2c30.555 32.462%2c30.555C32.423%2c30.555 32.389%2c30.563 32.362%2c30.578C32.335%2c30.593 32.312%2c30.613 32.295%2c30.639C32.278%2c30.664 32.266%2c30.693 32.258%2c30.726C32.25%2c30.759 32.246%2c30.792 32.246%2c30.827C32.246%2c30.86 32.25%2c30.893 32.258%2c30.924C32.266%2c30.956 32.278%2c30.984 32.295%2c31.009C32.312%2c31.034 32.335%2c31.054 32.362%2c31.07C32.389%2c31.085 32.423%2c31.092 32.462%2c31.092C32.52%2c31.092 32.564%2c31.078 32.596%2c31.049C32.627%2c31.019 32.645%2c30.977 32.65%2c30.921L32.475%2c30.921L32.475%2c30.792L32.808%2c30.792L32.808%2c31.22L32.697%2c31.22L32.679%2c31.13ZM32.949%2c30.427L33.122%2c30.427L33.453%2c30.959L33.455%2c30.959L33.455%2c30.427L33.618%2c30.427L33.618%2c31.22L33.444%2c31.22L33.114%2c30.689L33.112%2c30.689L33.112%2c31.22L32.949%2c31.22L32.949%2c30.427ZM33.946%2c31.073L34.101%2c31.073C34.126%2c31.073 34.151%2c31.069 34.175%2c31.061C34.198%2c31.053 34.219%2c31.04 34.238%2c31.021C34.256%2c31.002 34.271%2c30.977 34.282%2c30.947C34.293%2c30.917 34.299%2c30.88 34.299%2c30.836C34.299%2c30.796 34.295%2c30.76 34.287%2c30.728C34.279%2c30.696 34.267%2c30.668 34.249%2c30.645C34.231%2c30.622 34.208%2c30.605 34.178%2c30.592C34.149%2c30.58 34.113%2c30.574 34.07%2c30.574L33.946%2c30.574L33.946%2c31.073ZM33.772%2c30.427L34.113%2c30.427C34.165%2c30.427 34.212%2c30.436 34.256%2c30.452C34.3%2c30.468 34.338%2c30.493 34.37%2c30.525C34.403%2c30.558 34.428%2c30.598 34.446%2c30.647C34.464%2c30.696 34.473%2c30.753 34.473%2c30.819C34.473%2c30.877 34.466%2c30.93 34.451%2c30.979C34.436%2c31.028 34.414%2c31.07 34.384%2c31.106C34.354%2c31.141 34.316%2c31.169 34.272%2c31.189C34.227%2c31.21 34.174%2c31.22 34.113%2c31.22L33.772%2c31.22L33.772%2c30.427Z' style='fill:%23575e75%3b'/%3e%3cuse xlink:href='%23_Image4' x='8.501' y='8.628' width='24.071px' height='23.851px' transform='matrix(0.962833%2c0%2c0%2c0.993785%2c0%2c0)'/%3e%3cpath d='M15.11%2c25.5L15.11%2c15.5L20.22%2c20.5L25.33%2c15.5L25.33%2c25.5' style='fill:none%3bstroke:red%3bstroke-width:2.06px%3bstroke-miterlimit:1.5%3b'/%3e%3c/g%3e%3cdefs%3e%3cimage id='_Image1' width='34px' height='28px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAACIAAAAcCAYAAAAEN20fAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA1ElEQVRIie3XsU7DMBRG4c%2bmFaIDLOyt1Pd/JCTYkRADQahVzVAjRa6dgSHJ4CN5SG6u/xM7QxzguD9ssEM0LxcML2%2bv55AlnhFmlvgj4T26rsRSEnL2Lpp/O2rENUhgHauBLnJLFynpIiVdpKSLlHSRki5SslqR1HjuMlFL/6ilPGdVJOGj0pjwjXMj7CePGid8NWQ%2bx/c3RfGp0hDwoP2Dfd8Igm3OqPU%2bji/GIgF3jQmnvqXQCJqq3WRF7beZkxQxWFYmYQhw3B%2b2ljloJdcj5%2bkXPe8rjWdIHOUAAAAASUVORK5CYII='/%3e%3cimage id='_Image2' width='6px' height='6px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAK0lEQVQImWNUllfQYWBgEGZABW%2bZsAgyMDAwCDNhEWRgYGBgIE/iLRbxtwD55QOaOR9NWAAAAABJRU5ErkJggg=='/%3e%3cimage id='_Image3' width='3px' height='3px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAJ0lEQVQImS3GsQkAIBAEsPiWP4SC%2b493pWBjqoyzdqOR%2bpnoQnCRBzu7BHNrioXgAAAAAElFTkSuQmCC'/%3e%3cimage id='_Image4' width='25px' height='24px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACb0lEQVRIiY2Wa27aQBSFP4N5uUlTpVXVNXYHWUF20EVWLYFAMMZm3B8%2bB18bkGppNPbMuffMfY4zwvPr9TXTa8b1095Yu4v7%2bfLSDkBB%2bURrnjMJtUAK79l/4JLJ8nCCCTAFco1pED6HYZJpGBHXaGCiTFaYYA4sNeZab4EaqDQnrc%2bAheZM6yfgqHESabIlmcBL4BH4DBRaSyI4SPisAy2FWYi0FuY9xCYht9j0mYS%2bAN80LwUugT3wIZJc2AdgJR1HYCPC6LZkksmI5LvGo/ZLYCeiRiQP2l/pIDu5uBG%2blAeySJIHd30FfgDPWq%2bCJSb5JKwVr2XBDngTZmISx8SBLxSTZ1mzDKc7BJJCVuRyFSIopMdZd4lJtMYJ4JMWUuDMceAXGkjmQ3KzaMXYkpjKHrlO5b0JfQrPpbDVAaJcLFJiMY5biour1ndNn/tT%2bgqHvkhv6RmQ%2bHF%2bN3JPkpKS6zpZ6f0kvFvK4Ikksfc0EjzQB3zH7ewq6F0WiS5k%2bQ2CswRKOt82wJYuRbdy2wx4osvAJ%2bkpCa0kEuU3CCq5xYV3BP4Cv%2bkquqIL%2bl6EjVznnlWNiaIl0YJ3nXYuV/0RyVqYOX1CJLrY1JKLFg0scRzcPt60lotkLWs2gSTRZdBZcbFbd9JziU8kqbW5VSxKusw5am0jBY6J75WarigTXWJsJVuPSVwPB/ouupcSZ9lewsY6lkdZ5ve98LVdFmNS099wJ/rLyOlcaXbF%2b3BlcLsvN19wLQzv%2bHj9uj34AA33r1/3PwLG%2bDS%2b41OYJwzby60fCad8PcIOfiQImwSLrtZtNnR/HwF3Fxt/if4BFBM38JLMEaoAAAAASUVORK5CYII='/%3e%3c/defs%3e%3c/svg%3e";

const img$2 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg width='116px' height='95px' viewBox='0 0 116 95' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve' xmlns:serif='http://www.serif.com/' style='fill-rule:evenodd%3bclip-rule:evenodd%3b'%3e%3cg id='micro-bit'%3e%3cuse id='Shape' xlink:href='%23_Image1' x='1' y='1' width='114px' height='94px'/%3e%3cpath id='Shape1' serif:id='Shape' d='M106%2c4.175L10%2c4.175C6.7%2c4.175 4%2c6.875 4%2c10.175L4%2c85.175C4%2c87.875 5.725%2c90.125 8.125%2c90.875C8.725%2c91.025 9.325%2c91.175 10%2c91.175L106%2c91.175C106.675%2c91.175 107.275%2c91.1 107.875%2c90.875C110.275%2c90.125 112%2c87.875 112%2c85.175L112%2c10.175C112%2c6.875 109.375%2c4.175 106%2c4.175ZM13%2c80.225C10.9%2c80.225 9.25%2c78.575 9.25%2c76.475C9.25%2c74.375 10.9%2c72.725 13%2c72.725C15.1%2c72.725 16.75%2c74.375 16.75%2c76.475C16.75%2c78.575 15.1%2c80.225 13%2c80.225ZM34.225%2c80.225C32.125%2c80.225 30.475%2c78.575 30.475%2c76.475C30.475%2c74.375 32.125%2c72.725 34.225%2c72.725C36.325%2c72.725 37.975%2c74.375 37.975%2c76.475C37.975%2c78.575 36.25%2c80.225 34.225%2c80.225ZM58%2c80.225C55.9%2c80.225 54.25%2c78.575 54.25%2c76.475C54.25%2c74.375 55.9%2c72.725 58%2c72.725C60.1%2c72.725 61.75%2c74.375 61.75%2c76.475C61.75%2c78.575 60.1%2c80.225 58%2c80.225ZM81.85%2c80.225C79.75%2c80.225 78.1%2c78.575 78.1%2c76.475C78.1%2c74.375 79.75%2c72.725 81.85%2c72.725C83.95%2c72.725 85.6%2c74.375 85.6%2c76.475C85.6%2c78.575 83.95%2c80.225 81.85%2c80.225ZM103%2c80.225C100.9%2c80.225 99.25%2c78.575 99.25%2c76.475C99.25%2c74.375 100.9%2c72.725 103%2c72.725C105.1%2c72.725 106.75%2c74.375 106.75%2c76.475C106.75%2c78.575 105.1%2c80.225 103%2c80.225Z' style='fill:%23414757%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape2' serif:id='Shape' d='M4%2c31.175L4%2c10.175C4%2c6.875 6.7%2c4.175 10%2c4.175L31%2c4.175L4%2c31.175Z' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape3' serif:id='Shape' d='M31%2c16.175L31%2c4.175L43%2c4.175L31%2c16.175Z' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape4' serif:id='Shape' d='M43%2c13.175L43%2c4.175L52%2c4.175L43%2c13.175Z' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape5' serif:id='Shape' d='M98.5%2c34.175L98.5%2c25.175L107.5%2c25.175L98.5%2c34.175Z' style='fill:%234c97ff%3bfill-rule:nonzero%3bstroke:%234c97ff%3bstroke-width:0.75px%3bstroke-linecap:round%3bstroke-linejoin:round%3b'/%3e%3cpath id='Shape6' serif:id='Shape' d='M17.5%2c55.175L17.5%2c64.175L8.5%2c64.175L17.5%2c55.175Z' style='fill:%234c97ff%3bfill-rule:nonzero%3bstroke:%234c97ff%3bstroke-width:0.75px%3bstroke-linecap:round%3bstroke-linejoin:round%3b'/%3e%3cpath id='Shape7' serif:id='Shape' d='M7%2c46.175C6.175%2c46.175 5.5%2c45.5 5.5%2c44.675C5.5%2c43.85 6.175%2c43.175 7%2c43.175C7.825%2c43.175 8.5%2c43.85 8.5%2c44.675C8.5%2c45.5 7.825%2c46.175 7%2c46.175Z' style='fill:white%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape8' serif:id='Shape' d='M109%2c46.175C108.175%2c46.175 107.5%2c45.5 107.5%2c44.675C107.5%2c43.85 108.175%2c43.175 109%2c43.175C109.825%2c43.175 110.5%2c43.85 110.5%2c44.675C110.5%2c45.5 109.825%2c46.175 109%2c46.175Z' style='fill:white%3bfill-rule:nonzero%3b'/%3e%3cg id='Group'%3e%3cpath id='Shape9' serif:id='Shape' d='M61.825%2c19.55C62.425%2c19.55 62.875%2c19.1 62.875%2c18.5C62.875%2c17.9 62.425%2c17.45 61.825%2c17.45C61.225%2c17.45 60.775%2c17.9 60.775%2c18.5C60.775%2c19.1 61.225%2c19.55 61.825%2c19.55' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape10' serif:id='Shape' d='M54.175%2c17.45C53.575%2c17.45 53.125%2c17.9 53.125%2c18.5C53.125%2c19.1 53.575%2c19.55 54.175%2c19.55C54.775%2c19.55 55.225%2c19.1 55.225%2c18.5C55.225%2c17.9 54.775%2c17.45 54.175%2c17.45' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape11' serif:id='Shape' d='M54.175%2c15.425C52.45%2c15.425 51.1%2c16.775 51.1%2c18.5C51.1%2c20.225 52.45%2c21.575 54.175%2c21.575L61.9%2c21.575C63.625%2c21.575 64.975%2c20.225 64.975%2c18.5C64.975%2c16.775 63.625%2c15.425 61.9%2c15.425L54.175%2c15.425M61.9%2c23.675L54.175%2c23.675C51.325%2c23.675 49%2c21.35 49%2c18.5C49%2c15.65 51.325%2c13.325 54.175%2c13.325L61.9%2c13.325C64.75%2c13.325 67.075%2c15.65 67.075%2c18.5C67%2c21.35 64.75%2c23.675 61.9%2c23.675' style='fill:%234c97ff%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Group1' serif:id='Group'%3e%3cuse id='Shape12' serif:id='Shape' xlink:href='%23_Image2' x='8.5' y='35.675' width='18px' height='18px'/%3e%3cpath id='Shape13' serif:id='Shape' d='M23.5%2c37.175L11.5%2c37.175C10.675%2c37.175 10%2c37.85 10%2c38.675L10%2c50.675C10%2c51.5 10.675%2c52.175 11.5%2c52.175L23.5%2c52.175C24.325%2c52.175 25%2c51.5 25%2c50.675L25%2c38.675C25%2c37.85 24.325%2c37.175 23.5%2c37.175Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3bstroke:%237c87a5%3bstroke-width:0.75px%3bstroke-linecap:round%3bstroke-linejoin:round%3b'/%3e%3cuse id='Oval' xlink:href='%23_Image3' x='13.328' y='41.789' width='9.548px' height='9.548px' transform='matrix(0.954812%2c0%2c0%2c0.954812%2c0%2c0)'/%3e%3ccircle id='Oval1' serif:id='Oval' cx='17.5' cy='44.675' r='3' style='fill:%23414757%3bstroke:%23414757%3bstroke-width:0.75px%3b'/%3e%3c/g%3e%3cg id='Group2' serif:id='Group'%3e%3cuse id='Shape14' serif:id='Shape' xlink:href='%23_Image2' x='89.5' y='35.675' width='18px' height='18px'/%3e%3cpath id='Shape15' serif:id='Shape' d='M104.5%2c37.175L92.5%2c37.175C91.675%2c37.175 91%2c37.85 91%2c38.675L91%2c50.675C91%2c51.5 91.675%2c52.175 92.5%2c52.175L104.5%2c52.175C105.325%2c52.175 106%2c51.5 106%2c50.675L106%2c38.675C106%2c37.85 105.325%2c37.175 104.5%2c37.175Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3bstroke:%237c87a5%3bstroke-width:0.75px%3bstroke-linecap:round%3bstroke-linejoin:round%3b'/%3e%3cuse id='Oval2' serif:id='Oval' xlink:href='%23_Image3' x='98.162' y='41.789' width='9.548px' height='9.548px' transform='matrix(0.954812%2c0%2c0%2c0.954812%2c0%2c0)'/%3e%3ccircle id='Oval3' serif:id='Oval' cx='98.5' cy='44.675' r='3' style='fill:%23414757%3bstroke:%23414757%3bstroke-width:0.75px%3b'/%3e%3c/g%3e%3cg id='Group3' serif:id='Group'%3e%3cg id='Shape16' serif:id='Shape'%3e%3cpath d='M41.35%2c31.925L40.15%2c31.925C40.075%2c31.925 40%2c31.85 40%2c31.775L40%2c30.575C40%2c30.5 40.075%2c30.425 40.15%2c30.425L41.35%2c30.425C41.425%2c30.425 41.5%2c30.5 41.5%2c30.575L41.5%2c31.775C41.5%2c31.85 41.5%2c31.925 41.35%2c31.925Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c34.175L40.15%2c34.175C40.075%2c34.175 40%2c34.1 40%2c34.025L40%2c32.825C40%2c32.75 40.075%2c32.675 40.15%2c32.675L41.35%2c32.675C41.425%2c32.675 41.5%2c32.75 41.5%2c32.825L41.5%2c34.025C41.5%2c34.1 41.5%2c34.175 41.35%2c34.175Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c33.425L40.15%2c33.425C40.075%2c33.425 40%2c33.35 40%2c33.275L40%2c31.325C40%2c31.25 40.075%2c31.175 40.15%2c31.175L41.35%2c31.175C41.425%2c31.175 41.5%2c31.25 41.5%2c31.325L41.5%2c33.275C41.5%2c33.35 41.5%2c33.425 41.35%2c33.425Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape17' serif:id='Shape'%3e%3cpath d='M49.975%2c31.925L48.775%2c31.925C48.7%2c31.925 48.625%2c31.85 48.625%2c31.775L48.625%2c30.575C48.625%2c30.5 48.7%2c30.425 48.775%2c30.425L49.975%2c30.425C50.05%2c30.425 50.125%2c30.5 50.125%2c30.575L50.125%2c31.775C50.125%2c31.85 50.125%2c31.925 49.975%2c31.925Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c34.175L48.775%2c34.175C48.7%2c34.175 48.625%2c34.1 48.625%2c34.025L48.625%2c32.825C48.625%2c32.75 48.7%2c32.675 48.775%2c32.675L49.975%2c32.675C50.05%2c32.675 50.125%2c32.75 50.125%2c32.825L50.125%2c34.025C50.125%2c34.1 50.125%2c34.175 49.975%2c34.175Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c33.425L48.775%2c33.425C48.7%2c33.425 48.625%2c33.35 48.625%2c33.275L48.625%2c31.325C48.625%2c31.25 48.7%2c31.175 48.775%2c31.175L49.975%2c31.175C50.05%2c31.175 50.125%2c31.25 50.125%2c31.325L50.125%2c33.275C50.125%2c33.35 50.125%2c33.425 49.975%2c33.425Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape18' serif:id='Shape'%3e%3cpath d='M58.6%2c31.925L57.4%2c31.925C57.325%2c31.925 57.25%2c31.85 57.25%2c31.775L57.25%2c30.575C57.25%2c30.5 57.325%2c30.425 57.4%2c30.425L58.6%2c30.425C58.675%2c30.425 58.75%2c30.5 58.75%2c30.575L58.75%2c31.775C58.75%2c31.85 58.75%2c31.925 58.6%2c31.925Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c34.175L57.4%2c34.175C57.325%2c34.175 57.25%2c34.1 57.25%2c34.025L57.25%2c32.825C57.25%2c32.75 57.325%2c32.675 57.4%2c32.675L58.6%2c32.675C58.675%2c32.675 58.75%2c32.75 58.75%2c32.825L58.75%2c34.025C58.75%2c34.1 58.75%2c34.175 58.6%2c34.175Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c33.425L57.4%2c33.425C57.325%2c33.425 57.25%2c33.35 57.25%2c33.275L57.25%2c31.325C57.25%2c31.25 57.325%2c31.175 57.4%2c31.175L58.6%2c31.175C58.675%2c31.175 58.75%2c31.25 58.75%2c31.325L58.75%2c33.275C58.75%2c33.35 58.75%2c33.425 58.6%2c33.425Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape19' serif:id='Shape'%3e%3cpath d='M67.225%2c31.925L66.025%2c31.925C65.95%2c31.925 65.875%2c31.85 65.875%2c31.775L65.875%2c30.575C65.875%2c30.5 65.95%2c30.425 66.025%2c30.425L67.225%2c30.425C67.3%2c30.425 67.375%2c30.5 67.375%2c30.575L67.375%2c31.775C67.375%2c31.85 67.375%2c31.925 67.225%2c31.925Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c34.175L66.025%2c34.175C65.95%2c34.175 65.875%2c34.1 65.875%2c34.025L65.875%2c32.825C65.875%2c32.75 65.95%2c32.675 66.025%2c32.675L67.225%2c32.675C67.3%2c32.675 67.375%2c32.75 67.375%2c32.825L67.375%2c34.025C67.375%2c34.1 67.375%2c34.175 67.225%2c34.175Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c33.425L66.025%2c33.425C65.95%2c33.425 65.875%2c33.35 65.875%2c33.275L65.875%2c31.325C65.875%2c31.25 65.95%2c31.175 66.025%2c31.175L67.225%2c31.175C67.3%2c31.175 67.375%2c31.25 67.375%2c31.325L67.375%2c33.275C67.375%2c33.35 67.375%2c33.425 67.225%2c33.425Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape20' serif:id='Shape'%3e%3cpath d='M75.85%2c31.925L74.65%2c31.925C74.575%2c31.925 74.5%2c31.85 74.5%2c31.775L74.5%2c30.575C74.5%2c30.5 74.575%2c30.425 74.65%2c30.425L75.85%2c30.425C75.925%2c30.425 76%2c30.5 76%2c30.575L76%2c31.775C76%2c31.85 76%2c31.925 75.85%2c31.925Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c34.175L74.65%2c34.175C74.575%2c34.175 74.5%2c34.1 74.5%2c34.025L74.5%2c32.825C74.5%2c32.75 74.575%2c32.675 74.65%2c32.675L75.85%2c32.675C75.925%2c32.675 76%2c32.75 76%2c32.825L76%2c34.025C76%2c34.1 76%2c34.175 75.85%2c34.175Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c33.425L74.65%2c33.425C74.575%2c33.425 74.5%2c33.35 74.5%2c33.275L74.5%2c31.325C74.5%2c31.25 74.575%2c31.175 74.65%2c31.175L75.85%2c31.175C75.925%2c31.175 76%2c31.25 76%2c31.325L76%2c33.275C76%2c33.35 76%2c33.425 75.85%2c33.425Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3c/g%3e%3cg id='Group4' serif:id='Group'%3e%3cg id='Shape21' serif:id='Shape'%3e%3cpath d='M41.35%2c40.325L40.15%2c40.325C40.075%2c40.325 40%2c40.25 40%2c40.175L40%2c38.975C40%2c38.9 40.075%2c38.825 40.15%2c38.825L41.35%2c38.825C41.425%2c38.825 41.5%2c38.9 41.5%2c38.975L41.5%2c40.175C41.5%2c40.25 41.5%2c40.325 41.35%2c40.325Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c42.575L40.15%2c42.575C40.075%2c42.575 40%2c42.5 40%2c42.425L40%2c41.225C40%2c41.15 40.075%2c41.075 40.15%2c41.075L41.35%2c41.075C41.425%2c41.075 41.5%2c41.15 41.5%2c41.225L41.5%2c42.425C41.5%2c42.5 41.5%2c42.575 41.35%2c42.575Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c41.825L40.15%2c41.825C40.075%2c41.825 40%2c41.75 40%2c41.675L40%2c39.725C40%2c39.65 40.075%2c39.575 40.15%2c39.575L41.35%2c39.575C41.425%2c39.575 41.5%2c39.65 41.5%2c39.725L41.5%2c41.675C41.5%2c41.75 41.5%2c41.825 41.35%2c41.825Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape22' serif:id='Shape'%3e%3cpath d='M49.975%2c40.325L48.775%2c40.325C48.7%2c40.325 48.625%2c40.25 48.625%2c40.175L48.625%2c38.975C48.625%2c38.9 48.7%2c38.825 48.775%2c38.825L49.975%2c38.825C50.05%2c38.825 50.125%2c38.9 50.125%2c38.975L50.125%2c40.175C50.125%2c40.25 50.125%2c40.325 49.975%2c40.325Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c42.575L48.775%2c42.575C48.7%2c42.575 48.625%2c42.5 48.625%2c42.425L48.625%2c41.225C48.625%2c41.15 48.7%2c41.075 48.775%2c41.075L49.975%2c41.075C50.05%2c41.075 50.125%2c41.15 50.125%2c41.225L50.125%2c42.425C50.125%2c42.5 50.125%2c42.575 49.975%2c42.575Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c41.825L48.775%2c41.825C48.7%2c41.825 48.625%2c41.75 48.625%2c41.675L48.625%2c39.725C48.625%2c39.65 48.7%2c39.575 48.775%2c39.575L49.975%2c39.575C50.05%2c39.575 50.125%2c39.65 50.125%2c39.725L50.125%2c41.675C50.125%2c41.75 50.125%2c41.825 49.975%2c41.825Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape23' serif:id='Shape'%3e%3cpath d='M58.6%2c40.325L57.4%2c40.325C57.325%2c40.325 57.25%2c40.25 57.25%2c40.175L57.25%2c38.975C57.25%2c38.9 57.325%2c38.825 57.4%2c38.825L58.6%2c38.825C58.675%2c38.825 58.75%2c38.9 58.75%2c38.975L58.75%2c40.175C58.75%2c40.25 58.75%2c40.325 58.6%2c40.325Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c42.575L57.4%2c42.575C57.325%2c42.575 57.25%2c42.5 57.25%2c42.425L57.25%2c41.225C57.25%2c41.15 57.325%2c41.075 57.4%2c41.075L58.6%2c41.075C58.675%2c41.075 58.75%2c41.15 58.75%2c41.225L58.75%2c42.425C58.75%2c42.5 58.75%2c42.575 58.6%2c42.575Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c41.825L57.4%2c41.825C57.325%2c41.825 57.25%2c41.75 57.25%2c41.675L57.25%2c39.725C57.25%2c39.65 57.325%2c39.575 57.4%2c39.575L58.6%2c39.575C58.675%2c39.575 58.75%2c39.65 58.75%2c39.725L58.75%2c41.675C58.75%2c41.75 58.75%2c41.825 58.6%2c41.825Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape24' serif:id='Shape'%3e%3cpath d='M67.225%2c40.325L66.025%2c40.325C65.95%2c40.325 65.875%2c40.25 65.875%2c40.175L65.875%2c38.975C65.875%2c38.9 65.95%2c38.825 66.025%2c38.825L67.225%2c38.825C67.3%2c38.825 67.375%2c38.9 67.375%2c38.975L67.375%2c40.175C67.375%2c40.25 67.375%2c40.325 67.225%2c40.325Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c42.575L66.025%2c42.575C65.95%2c42.575 65.875%2c42.5 65.875%2c42.425L65.875%2c41.225C65.875%2c41.15 65.95%2c41.075 66.025%2c41.075L67.225%2c41.075C67.3%2c41.075 67.375%2c41.15 67.375%2c41.225L67.375%2c42.425C67.375%2c42.5 67.375%2c42.575 67.225%2c42.575Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c41.825L66.025%2c41.825C65.95%2c41.825 65.875%2c41.75 65.875%2c41.675L65.875%2c39.725C65.875%2c39.65 65.95%2c39.575 66.025%2c39.575L67.225%2c39.575C67.3%2c39.575 67.375%2c39.65 67.375%2c39.725L67.375%2c41.675C67.375%2c41.75 67.375%2c41.825 67.225%2c41.825Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape25' serif:id='Shape'%3e%3cpath d='M75.85%2c40.325L74.65%2c40.325C74.575%2c40.325 74.5%2c40.25 74.5%2c40.175L74.5%2c38.975C74.5%2c38.9 74.575%2c38.825 74.65%2c38.825L75.85%2c38.825C75.925%2c38.825 76%2c38.9 76%2c38.975L76%2c40.175C76%2c40.25 76%2c40.325 75.85%2c40.325Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c42.575L74.65%2c42.575C74.575%2c42.575 74.5%2c42.5 74.5%2c42.425L74.5%2c41.225C74.5%2c41.15 74.575%2c41.075 74.65%2c41.075L75.85%2c41.075C75.925%2c41.075 76%2c41.15 76%2c41.225L76%2c42.425C76%2c42.5 76%2c42.575 75.85%2c42.575Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c41.825L74.65%2c41.825C74.575%2c41.825 74.5%2c41.75 74.5%2c41.675L74.5%2c39.725C74.5%2c39.65 74.575%2c39.575 74.65%2c39.575L75.85%2c39.575C75.925%2c39.575 76%2c39.65 76%2c39.725L76%2c41.675C76%2c41.75 76%2c41.825 75.85%2c41.825Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3c/g%3e%3cg id='Group5' serif:id='Group'%3e%3cg id='Shape26' serif:id='Shape'%3e%3cpath d='M41.35%2c48.8L40.15%2c48.8C40.075%2c48.8 40%2c48.725 40%2c48.65L40%2c47.45C40%2c47.375 40.075%2c47.3 40.15%2c47.3L41.35%2c47.3C41.425%2c47.3 41.5%2c47.375 41.5%2c47.45L41.5%2c48.65C41.5%2c48.725 41.5%2c48.8 41.35%2c48.8Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c51.05L40.15%2c51.05C40.075%2c51.05 40%2c50.975 40%2c50.9L40%2c49.7C40%2c49.625 40.075%2c49.55 40.15%2c49.55L41.35%2c49.55C41.425%2c49.55 41.5%2c49.625 41.5%2c49.7L41.5%2c50.9C41.5%2c50.975 41.5%2c51.05 41.35%2c51.05Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c50.3L40.15%2c50.3C40.075%2c50.3 40%2c50.225 40%2c50.15L40%2c48.2C40%2c48.125 40.075%2c48.05 40.15%2c48.05L41.35%2c48.05C41.425%2c48.05 41.5%2c48.125 41.5%2c48.2L41.5%2c50.15C41.5%2c50.225 41.5%2c50.3 41.35%2c50.3Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape27' serif:id='Shape'%3e%3cpath d='M49.975%2c48.8L48.775%2c48.8C48.7%2c48.8 48.625%2c48.725 48.625%2c48.65L48.625%2c47.45C48.625%2c47.375 48.7%2c47.3 48.775%2c47.3L49.975%2c47.3C50.05%2c47.3 50.125%2c47.375 50.125%2c47.45L50.125%2c48.65C50.125%2c48.725 50.125%2c48.8 49.975%2c48.8Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c51.05L48.775%2c51.05C48.7%2c51.05 48.625%2c50.975 48.625%2c50.9L48.625%2c49.7C48.625%2c49.625 48.7%2c49.55 48.775%2c49.55L49.975%2c49.55C50.05%2c49.55 50.125%2c49.625 50.125%2c49.7L50.125%2c50.9C50.125%2c50.975 50.125%2c51.05 49.975%2c51.05Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c50.3L48.775%2c50.3C48.7%2c50.3 48.625%2c50.225 48.625%2c50.15L48.625%2c48.2C48.625%2c48.125 48.7%2c48.05 48.775%2c48.05L49.975%2c48.05C50.05%2c48.05 50.125%2c48.125 50.125%2c48.2L50.125%2c50.15C50.125%2c50.225 50.125%2c50.3 49.975%2c50.3Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape28' serif:id='Shape'%3e%3cpath d='M58.6%2c48.8L57.4%2c48.8C57.325%2c48.8 57.25%2c48.725 57.25%2c48.65L57.25%2c47.45C57.25%2c47.375 57.325%2c47.3 57.4%2c47.3L58.6%2c47.3C58.675%2c47.3 58.75%2c47.375 58.75%2c47.45L58.75%2c48.65C58.75%2c48.725 58.75%2c48.8 58.6%2c48.8Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c51.05L57.4%2c51.05C57.325%2c51.05 57.25%2c50.975 57.25%2c50.9L57.25%2c49.7C57.25%2c49.625 57.325%2c49.55 57.4%2c49.55L58.6%2c49.55C58.675%2c49.55 58.75%2c49.625 58.75%2c49.7L58.75%2c50.9C58.75%2c50.975 58.75%2c51.05 58.6%2c51.05Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c50.3L57.4%2c50.3C57.325%2c50.3 57.25%2c50.225 57.25%2c50.15L57.25%2c48.2C57.25%2c48.125 57.325%2c48.05 57.4%2c48.05L58.6%2c48.05C58.675%2c48.05 58.75%2c48.125 58.75%2c48.2L58.75%2c50.15C58.75%2c50.225 58.75%2c50.3 58.6%2c50.3Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape29' serif:id='Shape'%3e%3cpath d='M67.225%2c48.8L66.025%2c48.8C65.95%2c48.8 65.875%2c48.725 65.875%2c48.65L65.875%2c47.45C65.875%2c47.375 65.95%2c47.3 66.025%2c47.3L67.225%2c47.3C67.3%2c47.3 67.375%2c47.375 67.375%2c47.45L67.375%2c48.65C67.375%2c48.725 67.375%2c48.8 67.225%2c48.8Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c51.05L66.025%2c51.05C65.95%2c51.05 65.875%2c50.975 65.875%2c50.9L65.875%2c49.7C65.875%2c49.625 65.95%2c49.55 66.025%2c49.55L67.225%2c49.55C67.3%2c49.55 67.375%2c49.625 67.375%2c49.7L67.375%2c50.9C67.375%2c50.975 67.375%2c51.05 67.225%2c51.05Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c50.3L66.025%2c50.3C65.95%2c50.3 65.875%2c50.225 65.875%2c50.15L65.875%2c48.2C65.875%2c48.125 65.95%2c48.05 66.025%2c48.05L67.225%2c48.05C67.3%2c48.05 67.375%2c48.125 67.375%2c48.2L67.375%2c50.15C67.375%2c50.225 67.375%2c50.3 67.225%2c50.3Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape30' serif:id='Shape'%3e%3cpath d='M75.85%2c48.8L74.65%2c48.8C74.575%2c48.8 74.5%2c48.725 74.5%2c48.65L74.5%2c47.45C74.5%2c47.375 74.575%2c47.3 74.65%2c47.3L75.85%2c47.3C75.925%2c47.3 76%2c47.375 76%2c47.45L76%2c48.65C76%2c48.725 76%2c48.8 75.85%2c48.8Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c51.05L74.65%2c51.05C74.575%2c51.05 74.5%2c50.975 74.5%2c50.9L74.5%2c49.7C74.5%2c49.625 74.575%2c49.55 74.65%2c49.55L75.85%2c49.55C75.925%2c49.55 76%2c49.625 76%2c49.7L76%2c50.9C76%2c50.975 76%2c51.05 75.85%2c51.05Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c50.3L74.65%2c50.3C74.575%2c50.3 74.5%2c50.225 74.5%2c50.15L74.5%2c48.2C74.5%2c48.125 74.575%2c48.05 74.65%2c48.05L75.85%2c48.05C75.925%2c48.05 76%2c48.125 76%2c48.2L76%2c50.15C76%2c50.225 76%2c50.3 75.85%2c50.3Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3c/g%3e%3cg id='Group6' serif:id='Group'%3e%3cg id='Shape31' serif:id='Shape'%3e%3cpath d='M41.35%2c57.2L40.15%2c57.2C40.075%2c57.2 40%2c57.125 40%2c57.05L40%2c55.85C40%2c55.775 40.075%2c55.7 40.15%2c55.7L41.35%2c55.7C41.425%2c55.7 41.5%2c55.775 41.5%2c55.85L41.5%2c57.05C41.5%2c57.125 41.5%2c57.2 41.35%2c57.2Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c59.45L40.15%2c59.45C40.075%2c59.45 40%2c59.375 40%2c59.3L40%2c58.1C40%2c58.025 40.075%2c57.95 40.15%2c57.95L41.35%2c57.95C41.425%2c57.95 41.5%2c58.025 41.5%2c58.1L41.5%2c59.3C41.5%2c59.375 41.5%2c59.45 41.35%2c59.45Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c58.7L40.15%2c58.7C40.075%2c58.7 40%2c58.625 40%2c58.55L40%2c56.6C40%2c56.525 40.075%2c56.45 40.15%2c56.45L41.35%2c56.45C41.425%2c56.45 41.5%2c56.525 41.5%2c56.6L41.5%2c58.55C41.5%2c58.625 41.5%2c58.7 41.35%2c58.7Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape32' serif:id='Shape'%3e%3cpath d='M49.975%2c57.2L48.775%2c57.2C48.7%2c57.2 48.625%2c57.125 48.625%2c57.05L48.625%2c55.85C48.625%2c55.775 48.7%2c55.7 48.775%2c55.7L49.975%2c55.7C50.05%2c55.7 50.125%2c55.775 50.125%2c55.85L50.125%2c57.05C50.125%2c57.125 50.125%2c57.2 49.975%2c57.2Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c59.45L48.775%2c59.45C48.7%2c59.45 48.625%2c59.375 48.625%2c59.3L48.625%2c58.1C48.625%2c58.025 48.7%2c57.95 48.775%2c57.95L49.975%2c57.95C50.05%2c57.95 50.125%2c58.025 50.125%2c58.1L50.125%2c59.3C50.125%2c59.375 50.125%2c59.45 49.975%2c59.45Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c58.7L48.775%2c58.7C48.7%2c58.7 48.625%2c58.625 48.625%2c58.55L48.625%2c56.6C48.625%2c56.525 48.7%2c56.45 48.775%2c56.45L49.975%2c56.45C50.05%2c56.45 50.125%2c56.525 50.125%2c56.6L50.125%2c58.55C50.125%2c58.625 50.125%2c58.7 49.975%2c58.7Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape33' serif:id='Shape'%3e%3cpath d='M58.6%2c57.2L57.4%2c57.2C57.325%2c57.2 57.25%2c57.125 57.25%2c57.05L57.25%2c55.85C57.25%2c55.775 57.325%2c55.7 57.4%2c55.7L58.6%2c55.7C58.675%2c55.7 58.75%2c55.775 58.75%2c55.85L58.75%2c57.05C58.75%2c57.125 58.75%2c57.2 58.6%2c57.2Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c59.45L57.4%2c59.45C57.325%2c59.45 57.25%2c59.375 57.25%2c59.3L57.25%2c58.1C57.25%2c58.025 57.325%2c57.95 57.4%2c57.95L58.6%2c57.95C58.675%2c57.95 58.75%2c58.025 58.75%2c58.1L58.75%2c59.3C58.75%2c59.375 58.75%2c59.45 58.6%2c59.45Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c58.7L57.4%2c58.7C57.325%2c58.7 57.25%2c58.625 57.25%2c58.55L57.25%2c56.6C57.25%2c56.525 57.325%2c56.45 57.4%2c56.45L58.6%2c56.45C58.675%2c56.45 58.75%2c56.525 58.75%2c56.6L58.75%2c58.55C58.75%2c58.625 58.75%2c58.7 58.6%2c58.7Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape34' serif:id='Shape'%3e%3cpath d='M67.225%2c57.2L66.025%2c57.2C65.95%2c57.2 65.875%2c57.125 65.875%2c57.05L65.875%2c55.85C65.875%2c55.775 65.95%2c55.7 66.025%2c55.7L67.225%2c55.7C67.3%2c55.7 67.375%2c55.775 67.375%2c55.85L67.375%2c57.05C67.375%2c57.125 67.375%2c57.2 67.225%2c57.2Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c59.45L66.025%2c59.45C65.95%2c59.45 65.875%2c59.375 65.875%2c59.3L65.875%2c58.1C65.875%2c58.025 65.95%2c57.95 66.025%2c57.95L67.225%2c57.95C67.3%2c57.95 67.375%2c58.025 67.375%2c58.1L67.375%2c59.3C67.375%2c59.375 67.375%2c59.45 67.225%2c59.45Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c58.7L66.025%2c58.7C65.95%2c58.7 65.875%2c58.625 65.875%2c58.55L65.875%2c56.6C65.875%2c56.525 65.95%2c56.45 66.025%2c56.45L67.225%2c56.45C67.3%2c56.45 67.375%2c56.525 67.375%2c56.6L67.375%2c58.55C67.375%2c58.625 67.375%2c58.7 67.225%2c58.7Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape35' serif:id='Shape'%3e%3cpath d='M75.85%2c57.2L74.65%2c57.2C74.575%2c57.2 74.5%2c57.125 74.5%2c57.05L74.5%2c55.85C74.5%2c55.775 74.575%2c55.7 74.65%2c55.7L75.85%2c55.7C75.925%2c55.7 76%2c55.775 76%2c55.85L76%2c57.05C76%2c57.125 76%2c57.2 75.85%2c57.2Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c59.45L74.65%2c59.45C74.575%2c59.45 74.5%2c59.375 74.5%2c59.3L74.5%2c58.1C74.5%2c58.025 74.575%2c57.95 74.65%2c57.95L75.85%2c57.95C75.925%2c57.95 76%2c58.025 76%2c58.1L76%2c59.3C76%2c59.375 76%2c59.45 75.85%2c59.45Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c58.7L74.65%2c58.7C74.575%2c58.7 74.5%2c58.625 74.5%2c58.55L74.5%2c56.6C74.5%2c56.525 74.575%2c56.45 74.65%2c56.45L75.85%2c56.45C75.925%2c56.45 76%2c56.525 76%2c56.6L76%2c58.55C76%2c58.625 76%2c58.7 75.85%2c58.7Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3c/g%3e%3cg id='Group7' serif:id='Group'%3e%3cg id='Shape36' serif:id='Shape'%3e%3cpath d='M41.35%2c65.675L40.15%2c65.675C40.075%2c65.675 40%2c65.6 40%2c65.525L40%2c64.325C40%2c64.25 40.075%2c64.175 40.15%2c64.175L41.35%2c64.175C41.425%2c64.175 41.5%2c64.25 41.5%2c64.325L41.5%2c65.525C41.5%2c65.6 41.5%2c65.675 41.35%2c65.675Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c67.925L40.15%2c67.925C40.075%2c67.925 40%2c67.85 40%2c67.775L40%2c66.575C40%2c66.5 40.075%2c66.425 40.15%2c66.425L41.35%2c66.425C41.425%2c66.425 41.5%2c66.5 41.5%2c66.575L41.5%2c67.775C41.5%2c67.85 41.5%2c67.925 41.35%2c67.925Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M41.35%2c67.175L40.15%2c67.175C40.075%2c67.175 40%2c67.1 40%2c67.025L40%2c65.075C40%2c65 40.075%2c64.925 40.15%2c64.925L41.35%2c64.925C41.425%2c64.925 41.5%2c65 41.5%2c65.075L41.5%2c67.025C41.5%2c67.1 41.5%2c67.175 41.35%2c67.175Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape37' serif:id='Shape'%3e%3cpath d='M49.975%2c65.675L48.775%2c65.675C48.7%2c65.675 48.625%2c65.6 48.625%2c65.525L48.625%2c64.325C48.625%2c64.25 48.7%2c64.175 48.775%2c64.175L49.975%2c64.175C50.05%2c64.175 50.125%2c64.25 50.125%2c64.325L50.125%2c65.525C50.125%2c65.6 50.125%2c65.675 49.975%2c65.675Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c67.925L48.775%2c67.925C48.7%2c67.925 48.625%2c67.85 48.625%2c67.775L48.625%2c66.575C48.625%2c66.5 48.7%2c66.425 48.775%2c66.425L49.975%2c66.425C50.05%2c66.425 50.125%2c66.5 50.125%2c66.575L50.125%2c67.775C50.125%2c67.85 50.125%2c67.925 49.975%2c67.925Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M49.975%2c67.175L48.775%2c67.175C48.7%2c67.175 48.625%2c67.1 48.625%2c67.025L48.625%2c65.075C48.625%2c65 48.7%2c64.925 48.775%2c64.925L49.975%2c64.925C50.05%2c64.925 50.125%2c65 50.125%2c65.075L50.125%2c67.025C50.125%2c67.1 50.125%2c67.175 49.975%2c67.175Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape38' serif:id='Shape'%3e%3cpath d='M58.6%2c65.675L57.4%2c65.675C57.325%2c65.675 57.25%2c65.6 57.25%2c65.525L57.25%2c64.325C57.25%2c64.25 57.325%2c64.175 57.4%2c64.175L58.6%2c64.175C58.675%2c64.175 58.75%2c64.25 58.75%2c64.325L58.75%2c65.525C58.75%2c65.6 58.75%2c65.675 58.6%2c65.675Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c67.925L57.4%2c67.925C57.325%2c67.925 57.25%2c67.85 57.25%2c67.775L57.25%2c66.575C57.25%2c66.5 57.325%2c66.425 57.4%2c66.425L58.6%2c66.425C58.675%2c66.425 58.75%2c66.5 58.75%2c66.575L58.75%2c67.775C58.75%2c67.85 58.75%2c67.925 58.6%2c67.925Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M58.6%2c67.175L57.4%2c67.175C57.325%2c67.175 57.25%2c67.1 57.25%2c67.025L57.25%2c65.075C57.25%2c65 57.325%2c64.925 57.4%2c64.925L58.6%2c64.925C58.675%2c64.925 58.75%2c65 58.75%2c65.075L58.75%2c67.025C58.75%2c67.1 58.75%2c67.175 58.6%2c67.175Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape39' serif:id='Shape'%3e%3cpath d='M67.225%2c65.675L66.025%2c65.675C65.95%2c65.675 65.875%2c65.6 65.875%2c65.525L65.875%2c64.325C65.875%2c64.25 65.95%2c64.175 66.025%2c64.175L67.225%2c64.175C67.3%2c64.175 67.375%2c64.25 67.375%2c64.325L67.375%2c65.525C67.375%2c65.6 67.375%2c65.675 67.225%2c65.675Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c67.925L66.025%2c67.925C65.95%2c67.925 65.875%2c67.85 65.875%2c67.775L65.875%2c66.575C65.875%2c66.5 65.95%2c66.425 66.025%2c66.425L67.225%2c66.425C67.3%2c66.425 67.375%2c66.5 67.375%2c66.575L67.375%2c67.775C67.375%2c67.85 67.375%2c67.925 67.225%2c67.925Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M67.225%2c67.175L66.025%2c67.175C65.95%2c67.175 65.875%2c67.1 65.875%2c67.025L65.875%2c65.075C65.875%2c65 65.95%2c64.925 66.025%2c64.925L67.225%2c64.925C67.3%2c64.925 67.375%2c65 67.375%2c65.075L67.375%2c67.025C67.375%2c67.1 67.375%2c67.175 67.225%2c67.175Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Shape40' serif:id='Shape'%3e%3cpath d='M75.85%2c65.675L74.65%2c65.675C74.575%2c65.675 74.5%2c65.6 74.5%2c65.525L74.5%2c64.325C74.5%2c64.25 74.575%2c64.175 74.65%2c64.175L75.85%2c64.175C75.925%2c64.175 76%2c64.25 76%2c64.325L76%2c65.525C76%2c65.6 76%2c65.675 75.85%2c65.675Z' style='fill:%23e6e7e8%3bfill-opacity:0.5%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c67.925L74.65%2c67.925C74.575%2c67.925 74.5%2c67.85 74.5%2c67.775L74.5%2c66.575C74.5%2c66.5 74.575%2c66.425 74.65%2c66.425L75.85%2c66.425C75.925%2c66.425 76%2c66.5 76%2c66.575L76%2c67.775C76%2c67.85 76%2c67.925 75.85%2c67.925Z' style='fill:%23231f20%3bfill-opacity:0.25%3bfill-rule:nonzero%3b'/%3e%3cpath d='M75.85%2c67.175L74.65%2c67.175C74.575%2c67.175 74.5%2c67.1 74.5%2c67.025L74.5%2c65.075C74.5%2c65 74.575%2c64.925 74.65%2c64.925L75.85%2c64.925C75.925%2c64.925 76%2c65 76%2c65.075L76%2c67.025C76%2c67.1 76%2c67.175 75.85%2c67.175Z' style='fill:%23e6e7e8%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3c/g%3e%3cg id='Group8' serif:id='Group'%3e%3cpath id='Shape41' serif:id='Shape' d='M7.3%2c80.675L7.3%2c90.5C6.625%2c90.125 6.025%2c89.675 5.575%2c89.15L5.575%2c80.675L7.3%2c80.675Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape42' serif:id='Shape' d='M9.55%2c91.1L9.925%2c91.1L9.925%2c80.675L8.2%2c80.675L8.2%2c90.875L9.55%2c91.1Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3crect id='Rectangle-path' x='10.825' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path1' serif:id='Rectangle-path' x='13.45' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path2' serif:id='Rectangle-path' x='16.15' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path3' serif:id='Rectangle-path' x='18.775' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path4' serif:id='Rectangle-path' x='21.4' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path5' serif:id='Rectangle-path' x='24.025' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path6' serif:id='Rectangle-path' x='26.725' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path7' serif:id='Rectangle-path' x='29.35' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path8' serif:id='Rectangle-path' x='31.975' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path9' serif:id='Rectangle-path' x='34.675' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path10' serif:id='Rectangle-path' x='37.3' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path11' serif:id='Rectangle-path' x='39.925' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path12' serif:id='Rectangle-path' x='42.625' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path13' serif:id='Rectangle-path' x='45.25' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path14' serif:id='Rectangle-path' x='47.875' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path15' serif:id='Rectangle-path' x='50.5' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path16' serif:id='Rectangle-path' x='53.2' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path17' serif:id='Rectangle-path' x='55.825' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path18' serif:id='Rectangle-path' x='58.45' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path19' serif:id='Rectangle-path' x='61.15' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path20' serif:id='Rectangle-path' x='63.775' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path21' serif:id='Rectangle-path' x='66.4' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path22' serif:id='Rectangle-path' x='69.025' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path23' serif:id='Rectangle-path' x='71.725' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path24' serif:id='Rectangle-path' x='74.35' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path25' serif:id='Rectangle-path' x='76.975' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path26' serif:id='Rectangle-path' x='79.675' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path27' serif:id='Rectangle-path' x='82.3' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path28' serif:id='Rectangle-path' x='84.925' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path29' serif:id='Rectangle-path' x='87.625' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path30' serif:id='Rectangle-path' x='90.25' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path31' serif:id='Rectangle-path' x='92.875' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path32' serif:id='Rectangle-path' x='95.5' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path33' serif:id='Rectangle-path' x='98.2' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path34' serif:id='Rectangle-path' x='100.825' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3crect id='Rectangle-path35' serif:id='Rectangle-path' x='103.45' y='80.675' width='1.8' height='10.425' style='fill:%23ffbf00%3b'/%3e%3cpath id='Shape43' serif:id='Shape' d='M106.525%2c91.1L106.15%2c91.1L106.15%2c80.675L107.875%2c80.675L107.875%2c90.875L106.525%2c91.1Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape44' serif:id='Shape' d='M110.5%2c80.675L110.5%2c89.15C109.975%2c89.75 109.45%2c90.2 108.775%2c90.5L108.775%2c80.675L110.5%2c80.675Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cg id='Group9' serif:id='Group'%3e%3cpath id='Shape45' serif:id='Shape' d='M13%2c80.225C10.9%2c80.225 9.25%2c78.575 9.25%2c76.475C9.25%2c74.375 10.9%2c72.725 13%2c72.725C15.1%2c72.725 16.75%2c74.375 16.75%2c76.475C16.75%2c78.575 15.1%2c80.225 13%2c80.225ZM10%2c91.175L17.875%2c91.175L17.875%2c76.55C17.875%2c75.2 17.35%2c74 16.45%2c73.1C15.55%2c72.2 14.35%2c71.675 13%2c71.675C10.3%2c71.675 8.125%2c73.85 8.125%2c76.55L8.125%2c90.875L10%2c91.175Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape46' serif:id='Shape' d='M37.675%2c73.1C36.775%2c72.2 35.575%2c71.675 34.225%2c71.675C31.525%2c71.675 29.35%2c73.85 29.35%2c76.55L29.35%2c91.175L39.025%2c91.175L39.025%2c76.55C39.1%2c75.2 38.5%2c73.925 37.675%2c73.1ZM34.225%2c80.225C32.125%2c80.225 30.475%2c78.575 30.475%2c76.475C30.475%2c74.375 32.125%2c72.725 34.225%2c72.725C36.325%2c72.725 37.975%2c74.375 37.975%2c76.475C37.975%2c78.575 36.25%2c80.225 34.225%2c80.225Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape47' serif:id='Shape' d='M61.45%2c73.1C60.55%2c72.2 59.35%2c71.675 58%2c71.675C55.3%2c71.675 53.125%2c73.85 53.125%2c76.55L53.125%2c91.175L62.8%2c91.175L62.8%2c76.55C62.875%2c75.2 62.35%2c73.925 61.45%2c73.1ZM58%2c80.225C55.9%2c80.225 54.25%2c78.575 54.25%2c76.475C54.25%2c74.375 55.9%2c72.725 58%2c72.725C60.1%2c72.725 61.75%2c74.375 61.75%2c76.475C61.75%2c78.575 60.1%2c80.225 58%2c80.225Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape48' serif:id='Shape' d='M85.3%2c73.1C84.4%2c72.2 83.2%2c71.675 81.85%2c71.675C79.15%2c71.675 76.975%2c73.85 76.975%2c76.55L76.975%2c91.175L86.65%2c91.175L86.65%2c76.55C86.725%2c75.2 86.2%2c73.925 85.3%2c73.1ZM81.85%2c80.225C79.75%2c80.225 78.1%2c78.575 78.1%2c76.475C78.1%2c74.375 79.75%2c72.725 81.85%2c72.725C83.95%2c72.725 85.6%2c74.375 85.6%2c76.475C85.6%2c78.575 83.95%2c80.225 81.85%2c80.225Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3cpath id='Shape49' serif:id='Shape' d='M106.45%2c73.1C105.55%2c72.2 104.35%2c71.675 103%2c71.675C100.3%2c71.675 98.125%2c73.85 98.125%2c76.55L98.125%2c91.175L106%2c91.175L107.875%2c90.875L107.875%2c76.55C107.875%2c75.2 107.35%2c73.925 106.45%2c73.1ZM103%2c80.225C100.9%2c80.225 99.25%2c78.575 99.25%2c76.475C99.25%2c74.375 100.9%2c72.725 103%2c72.725C105.1%2c72.725 106.75%2c74.375 106.75%2c76.475C106.75%2c78.575 105.1%2c80.225 103%2c80.225Z' style='fill:%23ffbf00%3bfill-rule:nonzero%3b'/%3e%3c/g%3e%3cpath id='_0' serif:id='0' d='M13.006%2c83.537C13.346%2c83.537 13.591%2c83.677 13.742%2c83.956C13.86%2c84.172 13.918%2c84.468 13.918%2c84.844C13.918%2c85.201 13.865%2c85.496 13.759%2c85.729C13.605%2c86.063 13.354%2c86.231 13.005%2c86.231C12.69%2c86.231 12.455%2c86.094 12.301%2c85.82C12.173%2c85.592 12.109%2c85.286 12.109%2c84.901C12.109%2c84.603 12.148%2c84.348 12.225%2c84.134C12.369%2c83.736 12.629%2c83.537 13.006%2c83.537ZM13.003%2c85.93C13.174%2c85.93 13.31%2c85.855 13.411%2c85.703C13.512%2c85.552 13.563%2c85.27 13.563%2c84.857C13.563%2c84.559 13.526%2c84.314 13.453%2c84.122C13.38%2c83.93 13.238%2c83.834 13.027%2c83.834C12.832%2c83.834 12.691%2c83.925 12.601%2c84.107C12.511%2c84.29 12.466%2c84.559 12.466%2c84.914C12.466%2c85.181 12.495%2c85.396 12.552%2c85.559C12.64%2c85.806 12.79%2c85.93 13.003%2c85.93Z' style='fill:%23414757%3b'/%3e%3cpath id='A' d='M15.88%2c62.494L15.472%2c61.306L15.038%2c62.494L15.88%2c62.494ZM15.281%2c60.906L15.693%2c60.906L16.669%2c63.596L16.27%2c63.596L15.997%2c62.791L14.933%2c62.791L14.642%2c63.596L14.269%2c63.596L15.281%2c60.906Z' style='fill:%23414757%3b'/%3e%3cpath id='B' d='M100.252%2c27.403C100.406%2c27.403 100.525%2c27.381 100.611%2c27.339C100.745%2c27.272 100.812%2c27.151 100.812%2c26.976C100.812%2c26.8 100.741%2c26.682 100.598%2c26.621C100.517%2c26.587 100.398%2c26.57 100.239%2c26.57L99.589%2c26.57L99.589%2c27.403L100.252%2c27.403ZM100.375%2c28.644C100.598%2c28.644 100.757%2c28.579 100.853%2c28.45C100.912%2c28.368 100.942%2c28.269 100.942%2c28.153C100.942%2c27.958 100.855%2c27.825 100.68%2c27.754C100.588%2c27.716 100.465%2c27.698 100.312%2c27.698L99.589%2c27.698L99.589%2c28.644L100.375%2c28.644ZM99.232%2c26.266L100.387%2c26.266C100.702%2c26.266 100.926%2c26.36 101.059%2c26.548C101.138%2c26.659 101.177%2c26.787 101.177%2c26.932C101.177%2c27.102 101.128%2c27.241 101.032%2c27.35C100.982%2c27.407 100.91%2c27.46 100.816%2c27.507C100.954%2c27.56 101.057%2c27.619 101.125%2c27.685C101.246%2c27.802 101.307%2c27.964 101.307%2c28.17C101.307%2c28.343 101.252%2c28.5 101.144%2c28.641C100.981%2c28.85 100.723%2c28.955 100.369%2c28.955L99.232%2c28.955L99.232%2c26.266Z' style='fill:%23414757%3b'/%3e%3cpath id='_1' serif:id='1' d='M33.35%2c84.302L33.35%2c84.05C33.588%2c84.027 33.754%2c83.988 33.848%2c83.933C33.942%2c83.879 34.012%2c83.751 34.058%2c83.548L34.318%2c83.548L34.318%2c86.159L33.967%2c86.159L33.967%2c84.302L33.35%2c84.302Z' style='fill:%23414757%3b'/%3e%3cpath id='_2' serif:id='2' d='M57.108%2c86.159C57.12%2c85.933 57.167%2c85.737 57.248%2c85.57C57.329%2c85.402 57.487%2c85.25 57.723%2c85.114L58.075%2c84.91C58.232%2c84.819 58.343%2c84.741 58.406%2c84.676C58.506%2c84.575 58.556%2c84.459 58.556%2c84.328C58.556%2c84.175 58.51%2c84.054 58.419%2c83.965C58.327%2c83.875 58.205%2c83.83 58.053%2c83.83C57.827%2c83.83 57.671%2c83.915 57.584%2c84.086C57.538%2c84.178 57.512%2c84.305 57.507%2c84.467L57.172%2c84.467C57.176%2c84.239 57.218%2c84.053 57.298%2c83.909C57.441%2c83.655 57.693%2c83.528 58.054%2c83.528C58.355%2c83.528 58.574%2c83.609 58.713%2c83.771C58.851%2c83.934 58.921%2c84.114 58.921%2c84.313C58.921%2c84.523 58.847%2c84.703 58.699%2c84.852C58.614%2c84.938 58.46%2c85.043 58.239%2c85.167L57.989%2c85.306C57.869%2c85.372 57.775%2c85.435 57.707%2c85.494C57.585%2c85.601 57.508%2c85.718 57.476%2c85.848L58.908%2c85.848L58.908%2c86.159L57.108%2c86.159Z' style='fill:%23414757%3b'/%3e%3cpath id='_3v' serif:id='3v' d='M81.502%2c84.768C81.501%2c84.768 81.499%2c84.768 81.498%2c84.767L81.502%2c84.768ZM81.502%2c84.768C81.638%2c84.807 81.745%2c84.879 81.821%2c84.986C81.899%2c85.094 81.938%2c85.226 81.938%2c85.383C81.938%2c85.633 81.855%2c85.837 81.69%2c85.994C81.526%2c86.152 81.292%2c86.231 80.989%2c86.231C80.679%2c86.231 80.454%2c86.145 80.314%2c85.975C80.175%2c85.805 80.105%2c85.598 80.105%2c85.353L80.449%2c85.353C80.464%2c85.523 80.495%2c85.646 80.544%2c85.723C80.63%2c85.861 80.784%2c85.93 81.007%2c85.93C81.181%2c85.93 81.32%2c85.884 81.425%2c85.791C81.53%2c85.698 81.582%2c85.579 81.582%2c85.432C81.582%2c85.252 81.527%2c85.125 81.417%2c85.053C81.306%2c84.981 81.153%2c84.945 80.956%2c84.945C80.934%2c84.945 80.912%2c84.945 80.889%2c84.946C80.867%2c84.947 80.844%2c84.948 80.821%2c84.949L80.821%2c84.658C80.855%2c84.661 80.884%2c84.664 80.907%2c84.665C80.93%2c84.666 80.955%2c84.667 80.982%2c84.667C81.105%2c84.667 81.206%2c84.647 81.286%2c84.608C81.425%2c84.54 81.495%2c84.418 81.495%2c84.242C81.495%2c84.111 81.448%2c84.011 81.355%2c83.94C81.263%2c83.869 81.155%2c83.834 81.031%2c83.834C80.812%2c83.834 80.66%2c83.907 80.575%2c84.053C80.529%2c84.134 80.503%2c84.249 80.497%2c84.398L80.171%2c84.398C80.171%2c84.202 80.21%2c84.036 80.288%2c83.9C80.422%2c83.655 80.658%2c83.533 80.996%2c83.533C81.264%2c83.533 81.471%2c83.593 81.617%2c83.712C81.764%2c83.831 81.837%2c84.003 81.837%2c84.229C81.837%2c84.39 81.794%2c84.521 81.707%2c84.621C81.653%2c84.683 81.584%2c84.732 81.498%2c84.767L81.502%2c84.768ZM82.503%2c84.198L83.027%2c85.795L83.575%2c84.198L83.935%2c84.198L83.196%2c86.159L82.844%2c86.159L82.121%2c84.198L82.503%2c84.198Z' style='fill:%23414757%3b'/%3e%3cpath id='GND' d='M100.279%2c83.4C100.532%2c83.4 100.751%2c83.449 100.935%2c83.546C101.202%2c83.687 101.366%2c83.933 101.426%2c84.284L101.065%2c84.284C101.021%2c84.088 100.93%2c83.944 100.792%2c83.855C100.654%2c83.765 100.48%2c83.72 100.27%2c83.72C100.021%2c83.72 99.812%2c83.814 99.641%2c84C99.471%2c84.187 99.386%2c84.465 99.386%2c84.835C99.386%2c85.155 99.456%2c85.415 99.596%2c85.616C99.737%2c85.817 99.966%2c85.917 100.283%2c85.917C100.526%2c85.917 100.727%2c85.847 100.886%2c85.706C101.046%2c85.565 101.127%2c85.337 101.131%2c85.022L100.288%2c85.022L100.288%2c84.72L101.47%2c84.72L101.47%2c86.159L101.235%2c86.159L101.147%2c85.813C101.024%2c85.949 100.915%2c86.043 100.82%2c86.095C100.66%2c86.185 100.456%2c86.231 100.21%2c86.231C99.891%2c86.231 99.617%2c86.127 99.388%2c85.921C99.137%2c85.662 99.012%2c85.307 99.012%2c84.855C99.012%2c84.405 99.134%2c84.047 99.378%2c83.781C99.61%2c83.527 99.911%2c83.4 100.279%2c83.4ZM102.033%2c83.469L102.464%2c83.469L103.822%2c85.648L103.822%2c83.469L104.168%2c83.469L104.168%2c86.159L103.76%2c86.159L102.381%2c83.982L102.381%2c86.159L102.033%2c86.159L102.033%2c83.469ZM105.774%2c85.848C105.898%2c85.848 105.999%2c85.835 106.078%2c85.809C106.22%2c85.762 106.336%2c85.67 106.426%2c85.535C106.498%2c85.426 106.55%2c85.287 106.582%2c85.117C106.6%2c85.016 106.609%2c84.922 106.609%2c84.835C106.609%2c84.502 106.543%2c84.243 106.411%2c84.059C106.278%2c83.875 106.065%2c83.782 105.771%2c83.782L105.124%2c83.782L105.124%2c85.848L105.774%2c85.848ZM104.758%2c83.469L105.848%2c83.469C106.217%2c83.469 106.504%2c83.601 106.708%2c83.863C106.89%2c84.1 106.981%2c84.403 106.981%2c84.773C106.981%2c85.059 106.927%2c85.317 106.82%2c85.548C106.631%2c85.955 106.305%2c86.159 105.844%2c86.159L104.758%2c86.159L104.758%2c83.469Z' style='fill:%23414757%3b'/%3e%3cg id='Group10' serif:id='Group'%3e%3cg id='Shape50' serif:id='Shape'%3e%3cpath d='M41.35%2c33.425L40.15%2c33.425C40.075%2c33.425 40%2c33.35 40%2c33.275L40%2c31.325C40%2c31.25 40.075%2c31.175 40.15%2c31.175L41.35%2c31.175C41.425%2c31.175 41.5%2c31.25 41.5%2c31.325L41.5%2c33.275C41.5%2c33.35 41.5%2c33.425 41.35%2c33.425Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M75.85%2c33.425L74.65%2c33.425C74.575%2c33.425 74.5%2c33.35 74.5%2c33.275L74.5%2c31.325C74.5%2c31.25 74.575%2c31.175 74.65%2c31.175L75.85%2c31.175C75.925%2c31.175 76%2c31.25 76%2c31.325L76%2c33.275C76%2c33.35 76%2c33.425 75.85%2c33.425Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M41.35%2c50.3L40.15%2c50.3C40.075%2c50.3 40%2c50.225 40%2c50.15L40%2c48.2C40%2c48.125 40.075%2c48.05 40.15%2c48.05L41.35%2c48.05C41.425%2c48.05 41.5%2c48.125 41.5%2c48.2L41.5%2c50.15C41.5%2c50.225 41.5%2c50.3 41.35%2c50.3Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M75.85%2c50.3L74.65%2c50.3C74.575%2c50.3 74.5%2c50.225 74.5%2c50.15L74.5%2c48.2C74.5%2c48.125 74.575%2c48.05 74.65%2c48.05L75.85%2c48.05C75.925%2c48.05 76%2c48.125 76%2c48.2L76%2c50.15C76%2c50.225 76%2c50.3 75.85%2c50.3Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M41.35%2c58.7L40.15%2c58.7C40.075%2c58.7 40%2c58.625 40%2c58.55L40%2c56.6C40%2c56.525 40.075%2c56.45 40.15%2c56.45L41.35%2c56.45C41.425%2c56.45 41.5%2c56.525 41.5%2c56.6L41.5%2c58.55C41.5%2c58.625 41.5%2c58.7 41.35%2c58.7Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M75.85%2c58.7L74.65%2c58.7C74.575%2c58.7 74.5%2c58.625 74.5%2c58.55L74.5%2c56.6C74.5%2c56.525 74.575%2c56.45 74.65%2c56.45L75.85%2c56.45C75.925%2c56.45 76%2c56.525 76%2c56.6L76%2c58.55C76%2c58.625 76%2c58.7 75.85%2c58.7Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M41.35%2c67.175L40.15%2c67.175C40.075%2c67.175 40%2c67.1 40%2c67.025L40%2c65.075C40%2c65 40.075%2c64.925 40.15%2c64.925L41.35%2c64.925C41.425%2c64.925 41.5%2c65 41.5%2c65.075L41.5%2c67.025C41.5%2c67.1 41.5%2c67.175 41.35%2c67.175Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M58.6%2c50.3L57.4%2c50.3C57.325%2c50.3 57.25%2c50.225 57.25%2c50.15L57.25%2c48.2C57.25%2c48.125 57.325%2c48.05 57.4%2c48.05L58.6%2c48.05C58.675%2c48.05 58.75%2c48.125 58.75%2c48.2L58.75%2c50.15C58.75%2c50.225 58.75%2c50.3 58.6%2c50.3Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M75.85%2c67.175L74.65%2c67.175C74.575%2c67.175 74.5%2c67.1 74.5%2c67.025L74.5%2c65.075C74.5%2c65 74.575%2c64.925 74.65%2c64.925L75.85%2c64.925C75.925%2c64.925 76%2c65 76%2c65.075L76%2c67.025C76%2c67.1 76%2c67.175 75.85%2c67.175Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M41.35%2c41.825L40.15%2c41.825C40.075%2c41.825 40%2c41.75 40%2c41.675L40%2c39.725C40%2c39.65 40.075%2c39.575 40.15%2c39.575L41.35%2c39.575C41.425%2c39.575 41.5%2c39.65 41.5%2c39.725L41.5%2c41.675C41.5%2c41.75 41.5%2c41.825 41.35%2c41.825Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M75.85%2c41.825L74.65%2c41.825C74.575%2c41.825 74.5%2c41.75 74.5%2c41.675L74.5%2c39.725C74.5%2c39.65 74.575%2c39.575 74.65%2c39.575L75.85%2c39.575C75.925%2c39.575 76%2c39.65 76%2c39.725L76%2c41.675C76%2c41.75 76%2c41.825 75.85%2c41.825Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M49.975%2c41.825L48.775%2c41.825C48.7%2c41.825 48.625%2c41.75 48.625%2c41.675L48.625%2c39.725C48.625%2c39.65 48.7%2c39.575 48.775%2c39.575L49.975%2c39.575C50.05%2c39.575 50.125%2c39.65 50.125%2c39.725L50.125%2c41.675C50.125%2c41.75 50.125%2c41.825 49.975%2c41.825Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3cpath d='M67.225%2c41.825L66.025%2c41.825C65.95%2c41.825 65.875%2c41.75 65.875%2c41.675L65.875%2c39.725C65.875%2c39.65 65.95%2c39.575 66.025%2c39.575L67.225%2c39.575C67.3%2c39.575 67.375%2c39.65 67.375%2c39.725L67.375%2c41.675C67.375%2c41.75 67.375%2c41.825 67.225%2c41.825Z' style='fill:%23ff4e00%3bfill-rule:nonzero%3bstroke:%23ff4e00%3bstroke-width:1.5px%3b'/%3e%3c/g%3e%3c/g%3e%3cuse xlink:href='%23_Image4' x='21.1' y='14.534' width='74.232px' height='69.493px' transform='matrix(0.989753%2c0%2c0%2c0.992753%2c0%2c0)'/%3e%3cpath d='M40.75%2c66.05C40.819%2c31.89 40.75%2c32.3 40.75%2c32.3L58%2c49.175L75.25%2c32.3L75.25%2c66.05' style='fill:none%3bstroke:%23fe0000%3bstroke-width:6.2px%3bstroke-linecap:round%3bstroke-linejoin:round%3bstroke-miterlimit:1.5%3b'/%3e%3c/g%3e%3cdefs%3e%3cimage id='_Image1' width='114px' height='94px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAAHIAAABeCAYAAAD/s0AwAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACJ0lEQVR4nO3Z72raUByH8cdo/2xsJe0uQMH7v6RAcgFDLaWWLuJeGEtbZKuzLvrl%2bcB5I4f4g4ejiQ7YYTqejIBL4KJbg1379N%2bsgV/deq6aun2/4U2g6XgyAL51S6frAXiomnq9feElZHcKSzYnUKevBWbb0zmEl5P4AyOekwK4vivLx9liTtG9%2bB0Y9TiU/s0QuAEYTMeTSzanUefrZwFc9T2FDnZV4PdiggtDZrgo4OWGR%2berMGIIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkCEOGMGQIQ4YwZAhDhjBkiH1DPnbrM7XA7JOv%2bdoxZn7tHnj%2b5GvuPfNozzf4uuf%2bj85we4Trbh1j5tdujnDNvWf2ozWEIUMYMoQhQxgyhCFDGDJEAaz7HkIHWxfAqu8pdLBVweYnMp23tgCe%2bp5CB3sqqqZe4qk8Z23V1MvtXet9r6PoEPcAQ4DZYr66K8sVcN3rSNrXvGrqJ%2bhCAswW8/auLFvgEp8vT90KWGwjAgze75iOJwPgC5v/xEa79qgXazb3Mo/AsmrqN8//f400HU%2bGH9mno1pXTf3H5/3fEHBYu/7wayEAAAAASUVORK5CYII='/%3e%3cimage id='_Image2' width='18px' height='18px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAaUlEQVQ4je3PvQqAIABF4aMFQpO0ShT1/o9kZOLcz%2bYSLU3RIjlF5wE%2b7hUAQ9s1gAEUaUUgWDd5cSF9InBvlNeStxlJ%2bp2nlMyAAPBDP/RdKGZwogRCBigUy7butdYHUAFl6hJgtm7yJ21tFf%2bKFbzvAAAAAElFTkSuQmCC'/%3e%3cimage id='_Image3' width='10px' height='10px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs%2b9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAdElEQVQYlYWQrQ7AIAyEP8gQw8zMQ8L7PxIJ%2bGkQiM2UhZD9nGlzvV5/YEJw3gTnzcwrKSpgBSzQRQ0oQI05nYuQK7BNJmbgipbEzqMGWAAl%2b%2bwfQoBD/whu6JhTk8Xf0GJOrTuWD2EB6FdXiY/veWx/e/gF1ZkaTtgO5KEAAAAASUVORK5CYII='/%3e%3cimage id='_Image4' width='75px' height='70px' xlink:href='data:image/png%3bbase64%2ciVBORw0KGgoAAAANSUhEUgAAAEsAAABGCAYAAACE0Gk0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAVY0lEQVR4nM1cy3LbONo9uJCiJMeJesbpsqvSu%2blF5wFm2y%2bReR4/z%2bQlsp0HyCx6lqmya%2bLq1tixLIrEZRaHHwBKVGJ38v/TqGKRkijg4OC7AfxAha8oEVCPvVcB8Wva%2biPgeHQjwB6o%2bDvaVPnvXwP6f4XjUWQlcPvALi8fT/bl5SGoAfRjAB/F8LU4noDBPhlgCez16ydJJi4vy%2bso9UZFxFOAv4jh8vJpOH4HBilHG4mAmgRYAnv/XuHnn3n9yy/Tdf34Iyt59w54/ZrXb97EBLocaTVRxRSGy0vg7Vv1VRj43ziF4Rhhk5WPiNoHKOAE2GrF8/X1NNDzc1a0XscEXEAfI22//H9jOELYQeWTRIk0nZ0p/PKLwmqlcH2t8Je/AP/%2bt8Jvvym8eoUBkHQgN7bZRHz/fcS//kXg63V8FGmfI2kfw3KZ%2b7KP4cMH4LvvpjHc3PCefSmbIOw4WSVRJci21Tg9Jbj1WmE%2b531No3B3N67v9JSNtW3EdhuxWkVsNhF3d3EScElaSdLUQO1jaBreN4WhbVn/PoamCaNBKwmbIGtk4A/slBB1caFwc6PQtgTZdRrGKBijoZTCbKaw2Sj86U/Aw0MGu9mwsq6LWCwigABjIpomYrMJaFsSJaS9fQu8fp3bf/s2kwSw/c1GoWnYPqCwWGg8PCh4z3Zl8ABgsYj4z3%2bA5TJit4swJqJtA7ou4vQ04O5O4%2bYm4uIi4v17ti2ExYiolCoJG41CjFHEXiXVW681ViuFkxOF%2b3uNttXoOo3ZTME5Dec06lrBWnamqnKdfU9inIvoughrA6wN2O0i6jqgacKkpEmZkqRv3f7JScD9PdterQIAEjaoo1Iq4dHYL6VbPjtTk0QZY9C2FnVtMZtZhFAhhArzOc9Nw7MxNbbbGiFUAKp0nzEGShkABsYYnJ9rbDas/%2bYmH23L78/P2SbA/xljUl1S73Zbw5h61L7gCaHCbEa8bWthjEHXsf77e42TE/bz7ExN8jCUpIajqLhUv7ZVOD/Xg63SWK8NtDaYzQxCMAhBo2k0vKdKaq3Q9wpVBXhP0deao7jbBVSVx3arMZt5bDYcaUCh6wLOz2NSXQA4P6dNWi41lCJxy6VG1xnMZhp9b9A0GiFoABpaKxij0PeA1hFK8ZC2lQqYzTxi9ACA01Pg7o5tXV8HrNcKV1cjdYwMaOKIrIPI%2bOKCbNNGKNzdZaK6zmK55Chba7DbGVQVVcIYBedIvLUEq3VA3wcY46GUx3zuB/XxeHhgB2iDSG4uavheo20NFgsN5wzm8yxh3rPtEEhW2bZzbHu3YxuAR4zsU10D6zXgPfDiRUxqnmSn4GWI/w4j%2bCxVwMmJwnqdpWq7JVFVZfHwYDGfGzhnoRRBh0DCtJaoOyLGmCQK8AAcdjsPax0ASth2qzCf036JMxCjPZ%2brQRIpyX3P9prGwFoLgINlrQZtLtvuugilAmIMUMqj69jmdqtRVQpdB9Q1jX/bRnQd8P33tF3v36vB0UyHDjFGlQz72ZnCzQ3FXuxL29I%2bWUsb5ZxFjBWMsfDeoq4N%2bt4gxkyW1iTLOZLlvYMxmSxrHZxzWCw82jbAmADnIubziO2WRtt7qvnDA8lxjsdsZuC9hTEWfU%2bylFIIgW2HQLKqikQZ4%2bC9g1I9rHXQuodzDrudQ9M4xOjhvcdyGXB2FnBzE8XQi5GfnhsynhIXzWOx0GlkYyRRVVUhxgp1bQfgYoQJWmxWVYmdcABIklK0Q1prbLf8XamAEKg%2bIajhoERrbaCUhVIW1lYDdmKpKrbrPW2m1hFaRwAkoK4dQqBE9T3gHAbzELFYBHSdhvcR3tMzr9dqFFSXkpVCBkDh8lLj4kKhrs2BVIVQQesaSvFwroYx9EgxVgAIOsbsZUlAgNYOWjuEwNGVs0gb4KE1pWu7BeZzwHsx3lmKYqygdT6HwENrfdAu1d5DqR5AD%2b97WNshRh4hdNC6P5CurvO4uoq4vAyiikqpOC1ZNOyMhl%2b%2bVNCaUiXunsArGFNBqRre1wk8CaNKCGgeWQ0AA617hGBgDM8xehjj0fcc8b6ncfdejLkt2uAAec/PlDh6xGH0AZAsDooE0fzN%2bwCtPZQyUCpgsQioKoWPHxWWS/b/6upQskZR%2b9u3Ohn083ONuzuL%2bVwMeg2ta3g/gzEzhJDPgEgb1UJrGnoAsJaSpZRDjCJNHGlrO4RAadPaDZ2j6opKAWaQHB7O1QA4UDFWj2ozxg5AB6138H6XzsbsEEKHxaJD3ztstw6npw7X1wx1VquAN2/CMOifWc9arxUWC4WHB8Y5dM0cZQFPA18hBJKVwRsYQ%2bAhxIEEqgN/o/f03gDooXUP2h8PYwjOGCAEDaVor2KkJJVESUBKTGYIM5A8YIxmkDg6G5oDweKGgSDJDw8MkWQSPlGyjpcR6%2bkpXfbDg0Jd0yPVtdgEM6gRySJBNYAaMc4Q4wwhNIiRB9AAmKezUnOEMIcx8lsD7%2bfpXvlf%2bdn7ebrXmAYhsJ6y3vK/bJ9YROoFazYVtK11rYf%2bsb/zOadWE7yUZPF8dZVvlDmXMfRK1urBRVO6rDUJBEeapIkTiHEGpQR0c3BozbO1%2bSzEeD8ffW9Mvn//KNtRiu0LlhKftcTNYJp9CYH2zFoKhhThoVgFOa6GTUMjX1VkvKpUmlYYo4epDu0FYKGUqGA9fKaRZwRMYxujGH9KaZ7nuSEOCoO9iSnGYls04uJ1lcoE8Hsz1AcAETGG4jMDU4Bek/NRth8jieo6mpyuy/2eKGOyzs4YuX74QK9Q14y3ON8i832vCzed1ZJGVoiTDihoTbultQdQ/o8HvSzjL%2bmYMXEILuU%2bxnEcDNoqoEpxVwgGEmBzPuiHaxp61m0SQTHqFHd1HfvXtlmyfvuNPHBinbziccm6u1Np%2biBi6pxKDYlkcHQEQA4vYrSFZEXQ66rhOzlLHQxHtPaD2%2bf9SqnBCZjk9YSw/FnazFMskTDioSRzom9G%2bJ3LE3%2buh6kU8nxRsqS8epVn48slUswj5EmErlTuNGf9AsTsBYkxESRYtAZiVIWk%2bUF9IkKIxTxPpNemKD6rpU2qnckKw3chYeCgZLxaq0Hq8%2bA1DZL6yRL5Xjlcz5JF/z//mZ93O352Ls/oywZLEOVnuR6rnhmmSnawd5QQrbNHlWut6TDkWiQq20kDCYCl/hLLPh75LATt90n6Kf2eePgxLVkSY9W1Qgj5%2b7pmpbrgmICmaikJ42deqyH2MYhRlobU4ATCoIZIg5LJyIt/Eq2PVTq3M1X2cXqvMJsBfV/2T%2bHTJzVaGi/KoWRNlb7PI2Et0iT3WKGN4opD3Fsoi1H%2bWxrwbOfEDsl1KUGibiGU5OQ2xd4VS8EHRbBbiyRV0r8vlMeRBVCqRv/U8sgok0LjKtIhk9CQrvn7fkfUhPocqtS%2bxJTklG2IdAqOjCuOcB/r12fK48hqGp65%2bnhIlKxblUB5iNEWFZM5WyaPXosrlgCSxMjZewymoJQc1hNjGDxoXuSTtks8gq8kzDn2p%2bzfF8pncx1SaVt6xa5DWvalx%2bJnIUhm%2blkKJAQ4lAJ2rpTATHwIsnAo9YShHhT18PBeDeSoon5Zmsl2UOsI7znAxhB31wGzGftnzDciCyBRUsQO5REjKEqNLzoWBrXalz7en78rRz4WDqR0EmqQKNq60shLGCN1xOiHI0DrMWF0KlkVy359M7KkMLrG0DinJlxZCClKZ8wUkyckNlE9gpdVUXkCk6Vr3F5pszIpEjvpgVBObbLkZTPACD4/OCHW3I8nlMeRVVVswNqIvufn0qCPVcsPndfJYyoVk60qbYrW2QiLmpQGOAQ1LNWUwaROZ7Yhc8287i9YiCcPjrTDxUX2x3v25xHEPV2ygPzUhot045HMtiMOUXomVdaTSvA8yzSFkkW7JaosKojkJct5pUTpIoHeY1gTGxv/Eu9%2bOPPI8niyrM0GXYr32eDmSasfOh0SsRxpP9gPWXwbhxiUPiS7ohQlKk%2bLRJrynJKLghLg8jfauziSLMEoHhfI/RAP/03JAmgMq4oNOReTJyyBUfXi0LkcRtCOybNDPzgCUWMhDRg/qxM11gNxErVz8i0RPQdD1qaGWpKai9RzQOSJk3NI3vCR5Wlkic0CsieUNfMQRM3YSVFBceVaO3jvBwnjk5T9mEjslTgHqQvQsLY07HkRT%2bt8LQZf8ImdpD3M9so5JJv1lO4/iSwAQ%2b5CxG4H1HW2AdkuIbn%2b8jFYCHwgAfAhgkgaH%2blnCZPOlIY9T3Nk6mOGQbADIXFYM8srHSHgIIrXWmKr/TSB/yOyStLG0XoOHGlIgWxk8/NCSlX5NGcsYc6xE5wp5FBBHpjkpz0yI6igtQyQAfMlxDEceuDfQdLjyZrNqOt9L/FUVj%2bRhBxCqCHuAmhQqYLGOFjbo%2b8dgB58yuPSb87J1EWiehZ6N0qLtRreywpsjpeqinGcJLOJJxWvWgakEhOW0gZE1DWvyxWIJ5M1n0fc3lIl7HCrMWKjYrIFHDU9dFYlyTKGDzn57C4TRbJ6UBUdYgyw1sO5AGup4rOZrHLolENBD2sSoTHKvFHiMMEoKhwhOQ8iVZzukBzxjtstPfvz52z7SWStVnzm37b5u6qiikjuk0hWGS/RTqhCAiXNh7aKqtcn0oRICTk4OZbOyFIO4ykhi4/gMETsslTDuEvWrMTWlUTJjEEOCa7L0OH2lgH0ahVxff0IsiQNWoqooTRS1yGByFOWbK844iLiJIskMWPGWocYRcJIYF177HYh2SF6UoYMux3zuOgB88qBUkyTtFYIlRiMkpbxjGcMgrmuA7xnn4S0Uqr2ecCxJZoPH3hm0iyGKB0HOq91gPc5GGViRY6r9mMryT2QdCNJOXJOjD%2bPh4d8rVSf7in/l73rYTtKEZd8F0IY8huyd8xz2tw/6a/0/4tkvX/P8%2bkp7VXf0wBqTXtSSpX3zOajbSJpxmTQkjkjnZH4arfj4ZxD3/Ooa%2bZKLRa8Xiz4ua7zPcyn4n/L%2bvbbouMYYzImD6RIl7XsV13Tgd3e5nR04eEoWZKP/t13ER8/0sA3TUy5S1qHdAhRMoIC3rnciXK0Ja1IiKM68joEft80Dr/%2b6rFc8tw0ObyQe%2bV/x%2bo9hqPEO%2b4H%2b9Y0TKL7%2bJH9L/k4KllSTk8jlksadecyYdR/D2t9CjhlZA%2bBUl1EZfI6k0fXsZ7FgjlRIXjc3ga8fOmxXvN8exsQAn9fLMb/KwdDsnAkfiuJKvGFQK8rswfpk/RxuYxJsibKYa7DxUW%2bebdjjqcksvZ9gHOi%2bxmIgJVzVfUJeCaHUhCjx2zm0TSSMePx7Fkm6tdfA1694lkIe/ZMpCigaXzKODbGoet43fd5gKqqH%2bGRwcoEsh99H4Zr9nO3y30XHopch%2bP5WU3DPIT5nLnjklPedTWapkbfM%2bkiBKYpSrYwgGG9KCYyGVd1UKpH1/Wo6w7OMa9zPne4uwtDOmPAcpkXljabnHfPBGBmH1pr0XU16jpn8UjmIfGMc0s50CRLqR5V1aFtO9Q1M/%2b22x5Nw/ws7z3a1k/lZx2qoexwWK0okiJZ1gZ0Xc4jl/RGiZ0kbuJojj9770aqs9sFLJd%2btNtBiFqvYzqWy5B%2b2%2b2IYbnk/8v6vM/qLl61/MwcMEk%2bydLddUxEEck6PY0pl7Tc6SFqONrM8%2bYNN/1I8n7bEqDWAW3Lc9eFRJSkPQooOSj2PeqaQDndoZTNZrQ/2y330MxmAdttTGnVP/4YcXXF83rN77db3td1EdttwGLhU167tZKTmtubwlPmr3rv0HXjflnLvUSbDbfGvHtHPkQFgTht4GVf3osXMY2oMWFkVJlx3CfCRNVi7OBcBimj3rb5v9ttSPto2paSdX%2bfPdDr13mn2P09f5eBszZgu81xXdv6UTuMyzIWwVamdZfOxpi8n%2bfFizjq/75kUR1VNmay05PTHUmoj6gqEiZu3HuXCBPRl%2buqyiCbpk%2bBZFU5tC3BVVXAbMbcTZGq/aTXq6ssXU3D%2b6tKSA6oqhykNs10%2byUua7MahkCiqooSK329uyOG16/Tdj7hZ1qyfvwxJlX84QeStNlkyaoqlwgTQH3fj0RfInDvGUyKVC0WBCrSstnEJFUyULKNTT7f32ezwOkW6xEJcY4klFG/HH2fvxOiBH%2bM3D9kTMAPP4SkghP2CtjfYQEAf/ubxk8/ySYnnTY5yark/b3Bs2cGDw/cbLTbGSyXKqUlAZygSgzTdXT35ZSkjKlOTgL%2b8Y%2bIn3/OuxqkyG6Pd%2b80/vpX7kz7%2bNHg%2bfO8tiX5YG1rUNeSwq1S/oL3nPttNhGzGZ3DYuHx6ZPHyUkOeJsmpCzlq6uIf/4z4u9/D6VkHU6kf/opDllvtB%2byn2a1CtjtgJMTpD18s5ketpAwMayqMEgCCaOYRziXY6r7e7rkqgrDDjBujry54fbfcprx5g03bF5cRNzfc7Mn1ZeZPicnspZFQrjRSQ97gVjHbseVhMWC6hsjB49rYh6zGT2w95SqszPxiJ%2bZSO%2bnDb17h5H7Xq9pM7iyydH49IkqYMx4wnty0sMYfu66rIIkiqNY12HY%2bpFt1f4%2b6ZwUzPvu7vKmytWK9YnEdp1LWE5OMhalMpZPnyR69wVR47Dl3bsxD%2bMXZuRysJNVttzKvuiu0%2bh7jefPuZO075mXKZuSyiIblvo%2b7yItwcnuVdlUJPuj9zeUyz5p2Xwlu1q7TmO14hKO7GZ9DJaqoue7vaV0CxbZL11scCJXn9vJWpabGxq7pglpVKsqjGzPes1z17nRUf4mT3X2iVqvc4iwT5RImEiX7KU%2bP88Stl4HyH6bx2IRSXz50k8S9ZkyJktE7vIyG9qSMFHJpslA%2b56rBN770bFcOqxWPnWmVL2m4TY1Ub/SqJc4pMjvV1eUxHLwmiakwVitjmPp%2bzxgsjd7uQwHRBVStY9jRJbiMvEhSCFMbNj1dRhWGn1aJdgHuF7Tntzc8N7r63AAbv/1ACXAcuAEiwSr5eAJlpsbtncMy8uXsp0uYzn2boehfbVn5I%2brYQlSCCtHdrnMYF%2b98mkOJ8erVz79JiSJMf/CiyfkmCSsxLJeZ9LK9o5hEcylZB/DMlEmcylHKxGsgPfJ6wv2X28C5FecSCmnDOWLJkpgE0R9FsvUS4O%2bFZZHvI/maOLpUcJKoAIWQHp5jhRxweWLcj7zwp4pcF/EUr5R5KlYpgbsC1g%2bm6UbcyL%2bIVApX3od077xnnir0eeI%2biNheVRK8yRQNvao/3/NC77%2bSFge18BQYnn/U/PBvtEr7P6XWJ5E1n6Jj/z/tyDnj4DlvyKmjCu6E9atAAAAAElFTkSuQmCC'/%3e%3c/defs%3e%3c/svg%3e";

var translationMap = {
  'ja': {
    'gui.extension.microbitMore.name': 'micro:bit MORE v0.5.0',
    'gui.extension.microbitMore.description': 'micro:bitのすべての機能で遊ぶ。'
  },
  'ja-Hira': {
    'gui.extension.microbitMore.name': 'マイクロビット モア v0.5.0',
    'gui.extension.microbitMore.description': 'マイクロビットのすべてのきのうであそぶ。'
  }
};
var entry = {
  name: /*#__PURE__*/react.createElement(FormattedMessage, {
    defaultMessage: "micro:bit MORE v0.5.0",
    description: "Name for the 'microbit MORE' extension selector",
    id: "gui.extension.microbitMore.name"
  }),
  extensionId: 'microbitMore',
  extensionURL: 'https://yokobond.github.io/scratch-microbit-more/dist/microbitMore.mjs',
  collaborator: 'Yengawa Lab',
  iconURL: img,
  insetIconURL: img$1,
  description: /*#__PURE__*/react.createElement(FormattedMessage, {
    defaultMessage: "Play with all functions of micro:bit.",
    description: "Description for the 'micro:bit MORE' extension",
    id: "gui.extension.microbitMore.description"
  }),
  featured: true,
  disabled: false,
  bluetoothRequired: true,
  internetConnectionRequired: false,
  launchPeripheralConnectionFlow: true,
  useAutoScan: false,
  connectionIconURL: img$2,
  connectionSmallIconURL: img$1,
  connectingMessage: /*#__PURE__*/react.createElement(FormattedMessage, {
    defaultMessage: "Connecting",
    description: "Message to help people connect to their micro:bit.",
    id: "gui.extension.microbit.connectingMessage"
  }),
  helpLink: 'https://lab.yengawa.com/project/scratch-microbit-more/',
  translationMap: translationMap
};

/**
 * Block argument types
 * @enum {string}
 */
var ArgumentType = {
  /**
   * Numeric value with angle picker
   */
  ANGLE: 'angle',

  /**
   * Boolean value with hexagonal placeholder
   */
  BOOLEAN: 'Boolean',

  /**
   * Numeric value with color picker
   */
  COLOR: 'color',

  /**
   * Numeric value with text field
   */
  NUMBER: 'number',

  /**
   * String value with text field
   */
  STRING: 'string',

  /**
   * String value with matrix field
   */
  MATRIX: 'matrix',

  /**
   * MIDI note number with note picker (piano) field
   */
  NOTE: 'note',

  /**
   * Inline image on block (as part of the label)
   */
  IMAGE: 'image'
};
var argumentType = ArgumentType;

/**
 * Types of block
 * @enum {string}
 */
var BlockType = {
  /**
   * Boolean reporter with hexagonal shape
   */
  BOOLEAN: 'Boolean',

  /**
   * A button (not an actual block) for some special action, like making a variable
   */
  BUTTON: 'button',

  /**
   * Command block
   */
  COMMAND: 'command',

  /**
   * Specialized command block which may or may not run a child branch
   * The thread continues with the next block whether or not a child branch ran.
   */
  CONDITIONAL: 'conditional',

  /**
   * Specialized hat block with no implementation function
   * This stack only runs if the corresponding event is emitted by other code.
   */
  EVENT: 'event',

  /**
   * Hat block which conditionally starts a block stack
   */
  HAT: 'hat',

  /**
   * Specialized command block which may or may not run a child branch
   * If a child branch runs, the thread evaluates the loop block again.
   */
  LOOP: 'loop',

  /**
   * General reporter with numeric or string value
   */
  REPORTER: 'reporter'
};
var blockType = BlockType;

function M$1() {
  this._events = {};
}

M$1.prototype = {
  on: function on(ev, cb) {
    this._events || (this._events = {});
    var e = this._events;
    (e[ev] || (e[ev] = [])).push(cb);
    return this;
  },
  removeListener: function removeListener(ev, cb) {
    var e = this._events[ev] || [],
        i;

    for (i = e.length - 1; i >= 0 && e[i]; i--) {
      if (e[i] === cb || e[i].cb === cb) {
        e.splice(i, 1);
      }
    }
  },
  removeAllListeners: function removeAllListeners(ev) {
    if (!ev) {
      this._events = {};
    } else {
      this._events[ev] && (this._events[ev] = []);
    }
  },
  listeners: function listeners(ev) {
    return this._events ? this._events[ev] || [] : [];
  },
  emit: function emit(ev) {
    this._events || (this._events = {});
    var args = Array.prototype.slice.call(arguments, 1),
        i,
        e = this._events[ev] || [];

    for (i = e.length - 1; i >= 0 && e[i]; i--) {
      e[i].apply(this, args);
    }

    return this;
  },
  when: function when(ev, cb) {
    return this.once(ev, cb, true);
  },
  once: function once(ev, cb, when) {
    if (!cb) return this;

    function c() {
      if (!when) this.removeListener(ev, c);
      if (cb.apply(this, arguments) && when) this.removeListener(ev, c);
    }

    c.cb = cb;
    this.on(ev, c);
    return this;
  }
};

M$1.mixin = function (dest) {
  var o = M$1.prototype,
      k;

  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};

var microee = M$1;

function Transform() {}

microee.mixin(Transform); // The write() signature is different from Node's
// --> makes it much easier to work with objects in logs.
// One of the lessons from v1 was that it's better to target
// a good browser rather than the lowest common denominator
// internally.
// If you want to use external streams, pipe() to ./stringify.js first.

Transform.prototype.write = function (name, level, args) {
  this.emit('item', name, level, args);
};

Transform.prototype.end = function () {
  this.emit('end');
  this.removeAllListeners();
};

Transform.prototype.pipe = function (dest) {
  var s = this; // prevent double piping

  s.emit('unpipe', dest); // tell the dest that it's being piped to

  dest.emit('pipe', s);

  function onItem() {
    dest.write.apply(dest, Array.prototype.slice.call(arguments));
  }

  function onEnd() {
    !dest._isStdio && dest.end();
  }

  s.on('item', onItem);
  s.on('end', onEnd);
  s.when('unpipe', function (from) {
    var match = from === dest || typeof from == 'undefined';

    if (match) {
      s.removeListener('item', onItem);
      s.removeListener('end', onEnd);
      dest.emit('unpipe');
    }

    return match;
  });
  return dest;
};

Transform.prototype.unpipe = function (from) {
  this.emit('unpipe', from);
  return this;
};

Transform.prototype.format = function (dest) {
  throw new Error(['Warning: .format() is deprecated in Minilog v2! Use .pipe() instead. For example:', 'var Minilog = require(\'minilog\');', 'Minilog', '  .pipe(Minilog.backends.console.formatClean)', '  .pipe(Minilog.backends.console);'].join('\n'));
};

Transform.mixin = function (dest) {
  var o = Transform.prototype,
      k;

  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};

var transform = Transform;

var levelMap = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

function Filter() {
  this.enabled = true;
  this.defaultResult = true;
  this.clear();
}

transform.mixin(Filter); // allow all matching, with level >= given level

Filter.prototype.allow = function (name, level) {
  this._white.push({
    n: name,
    l: levelMap[level]
  });

  return this;
}; // deny all matching, with level <= given level


Filter.prototype.deny = function (name, level) {
  this._black.push({
    n: name,
    l: levelMap[level]
  });

  return this;
};

Filter.prototype.clear = function () {
  this._white = [];
  this._black = [];
  return this;
};

function test(rule, name) {
  // use .test for RegExps
  return rule.n.test ? rule.n.test(name) : rule.n == name;
}

Filter.prototype.test = function (name, level) {
  var i,
      len = Math.max(this._white.length, this._black.length);

  for (i = 0; i < len; i++) {
    if (this._white[i] && test(this._white[i], name) && levelMap[level] >= this._white[i].l) {
      return true;
    }

    if (this._black[i] && test(this._black[i], name) && levelMap[level] <= this._black[i].l) {
      return false;
    }
  }

  return this.defaultResult;
};

Filter.prototype.write = function (name, level, args) {
  if (!this.enabled || this.test(name, level)) {
    return this.emit('item', name, level, args);
  }
};

var filter = Filter;

var minilog = createCommonjsModule(function (module, exports) {
  var log = new transform(),
      slice = Array.prototype.slice;

  exports = module.exports = function create(name) {
    var o = function o() {
      log.write(name, undefined, slice.call(arguments));
      return o;
    };

    o.debug = function () {
      log.write(name, 'debug', slice.call(arguments));
      return o;
    };

    o.info = function () {
      log.write(name, 'info', slice.call(arguments));
      return o;
    };

    o.warn = function () {
      log.write(name, 'warn', slice.call(arguments));
      return o;
    };

    o.error = function () {
      log.write(name, 'error', slice.call(arguments));
      return o;
    };

    o.log = o.debug; // for interface compliance with Node and browser consoles

    o.suggest = exports.suggest;
    o.format = log.format;
    return o;
  }; // filled in separately


  exports.defaultBackend = exports.defaultFormatter = null;

  exports.pipe = function (dest) {
    return log.pipe(dest);
  };

  exports.end = exports.unpipe = exports.disable = function (from) {
    return log.unpipe(from);
  };

  exports.Transform = transform;
  exports.Filter = filter; // this is the default filter that's applied when .enable() is called normally
  // you can bypass it completely and set up your own pipes

  exports.suggest = new filter();

  exports.enable = function () {
    if (exports.defaultFormatter) {
      return log.pipe(exports.suggest) // filter
      .pipe(exports.defaultFormatter) // formatter
      .pipe(exports.defaultBackend); // backend
    }

    return log.pipe(exports.suggest) // filter
    .pipe(exports.defaultBackend); // formatter
  };
});

var hex = {
  black: '#000',
  red: '#c23621',
  green: '#25bc26',
  yellow: '#bbbb00',
  blue: '#492ee1',
  magenta: '#d338d3',
  cyan: '#33bbc8',
  gray: '#808080',
  purple: '#708'
};

function color(fg, isInverse) {
  if (isInverse) {
    return 'color: #fff; background: ' + hex[fg] + ';';
  } else {
    return 'color: ' + hex[fg] + ';';
  }
}

var util = color;

var colors = {
  debug: ['cyan'],
  info: ['purple'],
  warn: ['yellow', true],
  error: ['red', true]
},
    logger = new transform();

logger.write = function (name, level, args) {
  var fn = console.log;

  if (console[level] && console[level].apply) {
    fn = console[level];
    fn.apply(console, ['%c' + name + ' %c' + level, util('gray'), util.apply(util, colors[level])].concat(args));
  }
}; // NOP, because piping the formatted logs can only cause trouble.


logger.pipe = function () {};

var color_1 = logger;

var colors$1 = {
  debug: ['gray'],
  info: ['purple'],
  warn: ['yellow', true],
  error: ['red', true]
},
    logger$1 = new transform();

logger$1.write = function (name, level, args) {
  var fn = console.log;

  if (level != 'debug' && console[level]) {
    fn = console[level];
  }

  var i = 0;

  if (level != 'info') {
    for (; i < args.length; i++) {
      if (typeof args[i] != 'string') break;
    }

    fn.apply(console, ['%c' + name + ' ' + args.slice(0, i).join(' '), util.apply(util, colors$1[level])].concat(args.slice(i)));
  } else {
    fn.apply(console, ['%c' + name, util.apply(util, colors$1[level])].concat(args));
  }
}; // NOP, because piping the formatted logs can only cause trouble.


logger$1.pipe = function () {};

var minilog$1 = logger$1;

var newlines = /\n+$/,
    logger$2 = new transform();

logger$2.write = function (name, level, args) {
  var i = args.length - 1;

  if (typeof console === 'undefined' || !console.log) {
    return;
  }

  if (console.log.apply) {
    return console.log.apply(console, [name, level].concat(args));
  } else if (JSON && JSON.stringify) {
    // console.log.apply is undefined in IE8 and IE9
    // for IE8/9: make console.log at least a bit less awful
    if (args[i] && typeof args[i] == 'string') {
      args[i] = args[i].replace(newlines, '');
    }

    try {
      for (i = 0; i < args.length; i++) {
        args[i] = JSON.stringify(args[i]);
      }
    } catch (e) {}

    console.log(args.join(' '));
  }
};

logger$2.formatters = ['color', 'minilog'];
logger$2.color = color_1;
logger$2.minilog = minilog$1;
var console_1 = logger$2;

var cache = [];
var logger$3 = new transform();

logger$3.write = function (name, level, args) {
  cache.push([name, level, args]);
}; // utility functions


logger$3.get = function () {
  return cache;
};

logger$3.empty = function () {
  cache = [];
};

var array = logger$3;

var cache$1 = false;
var logger$4 = new transform();

logger$4.write = function (name, level, args) {
  if (typeof window == 'undefined' || typeof JSON == 'undefined' || !JSON.stringify || !JSON.parse) return;

  try {
    if (!cache$1) {
      cache$1 = window.localStorage.minilog ? JSON.parse(window.localStorage.minilog) : [];
    }

    cache$1.push([new Date().toString(), name, level, args]);
    window.localStorage.minilog = JSON.stringify(cache$1);
  } catch (e) {}
};

var localstorage = logger$4;

var cid = new Date().valueOf().toString(36);

function AjaxLogger(options) {
  this.url = options.url || '';
  this.cache = [];
  this.timer = null;
  this.interval = options.interval || 30 * 1000;
  this.enabled = true;
  this.jQuery = window.jQuery;
  this.extras = {};
}

transform.mixin(AjaxLogger);

AjaxLogger.prototype.write = function (name, level, args) {
  if (!this.timer) {
    this.init();
  }

  this.cache.push([name, level].concat(args));
};

AjaxLogger.prototype.init = function () {
  if (!this.enabled || !this.jQuery) return;
  var self = this;
  this.timer = setTimeout(function () {
    var i,
        logs = [],
        ajaxData,
        url = self.url;
    if (self.cache.length == 0) return self.init(); // Test each log line and only log the ones that are valid (e.g. don't have circular references).
    // Slight performance hit but benefit is we log all valid lines.

    for (i = 0; i < self.cache.length; i++) {
      try {
        JSON.stringify(self.cache[i]);
        logs.push(self.cache[i]);
      } catch (e) {}
    }

    if (self.jQuery.isEmptyObject(self.extras)) {
      ajaxData = JSON.stringify({
        logs: logs
      });
      url = self.url + '?client_id=' + cid;
    } else {
      ajaxData = JSON.stringify(self.jQuery.extend({
        logs: logs
      }, self.extras));
    }

    self.jQuery.ajax(url, {
      type: 'POST',
      cache: false,
      processData: false,
      data: ajaxData,
      contentType: 'application/json',
      timeout: 10000
    }).success(function (data, status, jqxhr) {
      if (data.interval) {
        self.interval = Math.max(1000, data.interval);
      }
    }).error(function () {
      self.interval = 30000;
    }).always(function () {
      self.init();
    });
    self.cache = [];
  }, this.interval);
};

AjaxLogger.prototype.end = function () {}; // wait until jQuery is defined. Useful if you don't control the load order.


AjaxLogger.jQueryWait = function (onDone) {
  if (typeof window !== 'undefined' && (window.jQuery || window.$)) {
    return onDone(window.jQuery || window.$);
  } else if (typeof window !== 'undefined') {
    setTimeout(function () {
      AjaxLogger.jQueryWait(onDone);
    }, 200);
  }
};

var jquery_simple = AjaxLogger;

var web = createCommonjsModule(function (module, exports) {
  var oldEnable = minilog.enable,
      oldDisable = minilog.disable,
      isChrome = typeof navigator != 'undefined' && /chrome/i.test(navigator.userAgent); // Use a more capable logging backend if on Chrome

  minilog.defaultBackend = isChrome ? console_1.minilog : console_1; // apply enable inputs from localStorage and from the URL

  if (typeof window != 'undefined') {
    try {
      minilog.enable(JSON.parse(window.localStorage['minilogSettings']));
    } catch (e) {}

    if (window.location && window.location.search) {
      var match = RegExp('[?&]minilog=([^&]*)').exec(window.location.search);
      match && minilog.enable(decodeURIComponent(match[1]));
    }
  } // Make enable also add to localStorage


  minilog.enable = function () {
    oldEnable.call(minilog, true);

    try {
      window.localStorage['minilogSettings'] = JSON.stringify(true);
    } catch (e) {}

    return this;
  };

  minilog.disable = function () {
    oldDisable.call(minilog);

    try {
      delete window.localStorage.minilogSettings;
    } catch (e) {}

    return this;
  };

  exports = module.exports = minilog;
  exports.backends = {
    array: array,
    browser: minilog.defaultBackend,
    localStorage: localstorage,
    jQuery: jquery_simple
  };
});

web.enable();
var log = web('vm');

var Color = /*#__PURE__*/function () {
  function Color() {
    _classCallCheck(this, Color);
  }

  _createClass(Color, null, [{
    key: "decimalToHex",

    /**
     * Convert a Scratch decimal color to a hex string, #RRGGBB.
     * @param {number} decimal RGB color as a decimal.
     * @return {string} RGB color as #RRGGBB hex string.
     */
    value: function decimalToHex(decimal) {
      if (decimal < 0) {
        decimal += 0xFFFFFF + 1;
      }

      var hex = Number(decimal).toString(16);
      hex = "#".concat('000000'.substr(0, 6 - hex.length)).concat(hex);
      return hex;
    }
    /**
     * Convert a Scratch decimal color to an RGB color object.
     * @param {number} decimal RGB color as decimal.
     * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
     */

  }, {
    key: "decimalToRgb",
    value: function decimalToRgb(decimal) {
      var a = decimal >> 24 & 0xFF;
      var r = decimal >> 16 & 0xFF;
      var g = decimal >> 8 & 0xFF;
      var b = decimal & 0xFF;
      return {
        r: r,
        g: g,
        b: b,
        a: a > 0 ? a : 255
      };
    }
    /**
     * Convert a hex color (e.g., F00, #03F, #0033FF) to an RGB color object.
     * CC-BY-SA Tim Down:
     * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param {!string} hex Hex representation of the color.
     * @return {RGBObject} null on failure, or rgb: {r: red [0,255], g: green [0,255], b: blue [0,255]}.
     */

  }, {
    key: "hexToRgb",
    value: function hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    /**
     * Convert an RGB color object to a hex color.
     * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
     * @return {!string} Hex representation of the color.
     */

  }, {
    key: "rgbToHex",
    value: function rgbToHex(rgb) {
      return Color.decimalToHex(Color.rgbToDecimal(rgb));
    }
    /**
     * Convert an RGB color object to a Scratch decimal color.
     * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
     * @return {!number} Number representing the color.
     */

  }, {
    key: "rgbToDecimal",
    value: function rgbToDecimal(rgb) {
      return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
    }
    /**
    * Convert a hex color (e.g., F00, #03F, #0033FF) to a decimal color number.
    * @param {!string} hex Hex representation of the color.
    * @return {!number} Number representing the color.
    */

  }, {
    key: "hexToDecimal",
    value: function hexToDecimal(hex) {
      return Color.rgbToDecimal(Color.hexToRgb(hex));
    }
    /**
     * Convert an HSV color to RGB format.
     * @param {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
     * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
     */

  }, {
    key: "hsvToRgb",
    value: function hsvToRgb(hsv) {
      var h = hsv.h % 360;
      if (h < 0) h += 360;
      var s = Math.max(0, Math.min(hsv.s, 1));
      var v = Math.max(0, Math.min(hsv.v, 1));
      var i = Math.floor(h / 60);
      var f = h / 60 - i;
      var p = v * (1 - s);
      var q = v * (1 - s * f);
      var t = v * (1 - s * (1 - f));
      var r;
      var g;
      var b;

      switch (i) {
        default:
        case 0:
          r = v;
          g = t;
          b = p;
          break;

        case 1:
          r = q;
          g = v;
          b = p;
          break;

        case 2:
          r = p;
          g = v;
          b = t;
          break;

        case 3:
          r = p;
          g = q;
          b = v;
          break;

        case 4:
          r = t;
          g = p;
          b = v;
          break;

        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }

      return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
      };
    }
    /**
     * Convert an RGB color to HSV format.
     * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
     * @return {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
     */

  }, {
    key: "rgbToHsv",
    value: function rgbToHsv(rgb) {
      var r = rgb.r / 255;
      var g = rgb.g / 255;
      var b = rgb.b / 255;
      var x = Math.min(Math.min(r, g), b);
      var v = Math.max(Math.max(r, g), b); // For grays, hue will be arbitrarily reported as zero. Otherwise, calculate

      var h = 0;
      var s = 0;

      if (x !== v) {
        var f = r === x ? g - b : g === x ? b - r : r - g;
        var i = r === x ? 3 : g === x ? 5 : 1;
        h = (i - f / (v - x)) * 60 % 360;
        s = (v - x) / v;
      }

      return {
        h: h,
        s: s,
        v: v
      };
    }
    /**
     * Linear interpolation between rgb0 and rgb1.
     * @param {RGBObject} rgb0 - the color corresponding to fraction1 <= 0.
     * @param {RGBObject} rgb1 - the color corresponding to fraction1 >= 1.
     * @param {number} fraction1 - the interpolation parameter. If this is 0.5, for example, mix the two colors equally.
     * @return {RGBObject} the interpolated color.
     */

  }, {
    key: "mixRgb",
    value: function mixRgb(rgb0, rgb1, fraction1) {
      if (fraction1 <= 0) return rgb0;
      if (fraction1 >= 1) return rgb1;
      var fraction0 = 1 - fraction1;
      return {
        r: fraction0 * rgb0.r + fraction1 * rgb1.r,
        g: fraction0 * rgb0.g + fraction1 * rgb1.g,
        b: fraction0 * rgb0.b + fraction1 * rgb1.b
      };
    }
  }, {
    key: "RGB_BLACK",

    /**
     * @typedef {object} RGBObject - An object representing a color in RGB format.
     * @property {number} r - the red component, in the range [0, 255].
     * @property {number} g - the green component, in the range [0, 255].
     * @property {number} b - the blue component, in the range [0, 255].
     */

    /**
     * @typedef {object} HSVObject - An object representing a color in HSV format.
     * @property {number} h - hue, in the range [0-359).
     * @property {number} s - saturation, in the range [0,1].
     * @property {number} v - value, in the range [0,1].
     */

    /** @type {RGBObject} */
    get: function get() {
      return {
        r: 0,
        g: 0,
        b: 0
      };
    }
    /** @type {RGBObject} */

  }, {
    key: "RGB_WHITE",
    get: function get() {
      return {
        r: 255,
        g: 255,
        b: 255
      };
    }
  }]);

  return Color;
}();

var color$1 = Color;

/**
 * @fileoverview
 * Utilities for casting and comparing Scratch data-types.
 * Scratch behaves slightly differently from JavaScript in many respects,
 * and these differences should be encapsulated below.
 * For example, in Scratch, add(1, join("hello", world")) -> 1.
 * This is because "hello world" is cast to 0.
 * In JavaScript, 1 + Number("hello" + "world") would give you NaN.
 * Use when coercing a value before computation.
 */

var Cast = /*#__PURE__*/function () {
  function Cast() {
    _classCallCheck(this, Cast);
  }

  _createClass(Cast, null, [{
    key: "toNumber",

    /**
     * Scratch cast to number.
     * Treats NaN as 0.
     * In Scratch 2.0, this is captured by `interp.numArg.`
     * @param {*} value Value to cast to number.
     * @return {number} The Scratch-casted number value.
     */
    value: function toNumber(value) {
      // If value is already a number we don't need to coerce it with
      // Number().
      if (typeof value === 'number') {
        // Scratch treats NaN as 0, when needed as a number.
        // E.g., 0 + NaN -> 0.
        if (Number.isNaN(value)) {
          return 0;
        }

        return value;
      }

      var n = Number(value);

      if (Number.isNaN(n)) {
        // Scratch treats NaN as 0, when needed as a number.
        // E.g., 0 + NaN -> 0.
        return 0;
      }

      return n;
    }
    /**
     * Scratch cast to boolean.
     * In Scratch 2.0, this is captured by `interp.boolArg.`
     * Treats some string values differently from JavaScript.
     * @param {*} value Value to cast to boolean.
     * @return {boolean} The Scratch-casted boolean value.
     */

  }, {
    key: "toBoolean",
    value: function toBoolean(value) {
      // Already a boolean?
      if (typeof value === 'boolean') {
        return value;
      }

      if (typeof value === 'string') {
        // These specific strings are treated as false in Scratch.
        if (value === '' || value === '0' || value.toLowerCase() === 'false') {
          return false;
        } // All other strings treated as true.


        return true;
      } // Coerce other values and numbers.


      return Boolean(value);
    }
    /**
     * Scratch cast to string.
     * @param {*} value Value to cast to string.
     * @return {string} The Scratch-casted string value.
     */

  }, {
    key: "toString",
    value: function toString(value) {
      return String(value);
    }
    /**
     * Cast any Scratch argument to an RGB color array to be used for the renderer.
     * @param {*} value Value to convert to RGB color array.
     * @return {Array.<number>} [r,g,b], values between 0-255.
     */

  }, {
    key: "toRgbColorList",
    value: function toRgbColorList(value) {
      var color = Cast.toRgbColorObject(value);
      return [color.r, color.g, color.b];
    }
    /**
     * Cast any Scratch argument to an RGB color object to be used for the renderer.
     * @param {*} value Value to convert to RGB color object.
     * @return {RGBOject} [r,g,b], values between 0-255.
     */

  }, {
    key: "toRgbColorObject",
    value: function toRgbColorObject(value) {
      var color;

      if (typeof value === 'string' && value.substring(0, 1) === '#') {
        color = color$1.hexToRgb(value); // If the color wasn't *actually* a hex color, cast to black

        if (!color) color = {
          r: 0,
          g: 0,
          b: 0,
          a: 255
        };
      } else {
        color = color$1.decimalToRgb(Cast.toNumber(value));
      }

      return color;
    }
    /**
     * Determine if a Scratch argument is a white space string (or null / empty).
     * @param {*} val value to check.
     * @return {boolean} True if the argument is all white spaces or null / empty.
     */

  }, {
    key: "isWhiteSpace",
    value: function isWhiteSpace(val) {
      return val === null || typeof val === 'string' && val.trim().length === 0;
    }
    /**
     * Compare two values, using Scratch cast, case-insensitive string compare, etc.
     * In Scratch 2.0, this is captured by `interp.compare.`
     * @param {*} v1 First value to compare.
     * @param {*} v2 Second value to compare.
     * @returns {number} Negative number if v1 < v2; 0 if equal; positive otherwise.
     */

  }, {
    key: "compare",
    value: function compare(v1, v2) {
      var n1 = Number(v1);
      var n2 = Number(v2);

      if (n1 === 0 && Cast.isWhiteSpace(v1)) {
        n1 = NaN;
      } else if (n2 === 0 && Cast.isWhiteSpace(v2)) {
        n2 = NaN;
      }

      if (isNaN(n1) || isNaN(n2)) {
        // At least one argument can't be converted to a number.
        // Scratch compares strings as case insensitive.
        var s1 = String(v1).toLowerCase();
        var s2 = String(v2).toLowerCase();

        if (s1 < s2) {
          return -1;
        } else if (s1 > s2) {
          return 1;
        }

        return 0;
      } // Handle the special case of Infinity


      if (n1 === Infinity && n2 === Infinity || n1 === -Infinity && n2 === -Infinity) {
        return 0;
      } // Compare as numbers.


      return n1 - n2;
    }
    /**
     * Determine if a Scratch argument number represents a round integer.
     * @param {*} val Value to check.
     * @return {boolean} True if number looks like an integer.
     */

  }, {
    key: "isInt",
    value: function isInt(val) {
      // Values that are already numbers.
      if (typeof val === 'number') {
        if (isNaN(val)) {
          // NaN is considered an integer.
          return true;
        } // True if it's "round" (e.g., 2.0 and 2).


        return val === parseInt(val, 10);
      } else if (typeof val === 'boolean') {
        // `True` and `false` always represent integer after Scratch cast.
        return true;
      } else if (typeof val === 'string') {
        // If it contains a decimal point, don't consider it an int.
        return val.indexOf('.') < 0;
      }

      return false;
    }
  }, {
    key: "toListIndex",

    /**
     * Compute a 1-based index into a list, based on a Scratch argument.
     * Two special cases may be returned:
     * LIST_ALL: if the block is referring to all of the items in the list.
     * LIST_INVALID: if the index was invalid in any way.
     * @param {*} index Scratch arg, including 1-based numbers or special cases.
     * @param {number} length Length of the list.
     * @param {boolean} acceptAll Whether it should accept "all" or not.
     * @return {(number|string)} 1-based index for list, LIST_ALL, or LIST_INVALID.
     */
    value: function toListIndex(index, length, acceptAll) {
      if (typeof index !== 'number') {
        if (index === 'all') {
          return acceptAll ? Cast.LIST_ALL : Cast.LIST_INVALID;
        }

        if (index === 'last') {
          if (length > 0) {
            return length;
          }

          return Cast.LIST_INVALID;
        } else if (index === 'random' || index === 'any') {
          if (length > 0) {
            return 1 + Math.floor(Math.random() * length);
          }

          return Cast.LIST_INVALID;
        }
      }

      index = Math.floor(Cast.toNumber(index));

      if (index < 1 || index > length) {
        return Cast.LIST_INVALID;
      }

      return index;
    }
  }, {
    key: "LIST_INVALID",
    get: function get() {
      return 'INVALID';
    }
  }, {
    key: "LIST_ALL",
    get: function get() {
      return 'ALL';
    }
  }]);

  return Cast;
}();

var cast = Cast;

var JSONRPC = /*#__PURE__*/function () {
  function JSONRPC() {
    _classCallCheck(this, JSONRPC);

    this._requestID = 0;
    this._openRequests = {};
  }
  /**
   * Make an RPC request and retrieve the result.
   * @param {string} method - the remote method to call.
   * @param {object} params - the parameters to pass to the remote method.
   * @returns {Promise} - a promise for the result of the call.
   */


  _createClass(JSONRPC, [{
    key: "sendRemoteRequest",
    value: function sendRemoteRequest(method, params) {
      var _this = this;

      var requestID = this._requestID++;
      var promise = new Promise(function (resolve, reject) {
        _this._openRequests[requestID] = {
          resolve: resolve,
          reject: reject
        };
      });

      this._sendRequest(method, params, requestID);

      return promise;
    }
    /**
     * Make an RPC notification with no expectation of a result or callback.
     * @param {string} method - the remote method to call.
     * @param {object} params - the parameters to pass to the remote method.
     */

  }, {
    key: "sendRemoteNotification",
    value: function sendRemoteNotification(method, params) {
      this._sendRequest(method, params);
    }
    /**
     * Handle an RPC request from remote, should return a result or Promise for result, if appropriate.
     * @param {string} method - the method requested by the remote caller.
     * @param {object} params - the parameters sent with the remote caller's request.
     */

  }, {
    key: "didReceiveCall",
    value: function didReceiveCall()
    /* method , params */
    {
      throw new Error('Must override didReceiveCall');
    }
  }, {
    key: "_sendMessage",
    value: function _sendMessage()
    /* jsonMessageObject */
    {
      throw new Error('Must override _sendMessage');
    }
  }, {
    key: "_sendRequest",
    value: function _sendRequest(method, params, id) {
      var request = {
        jsonrpc: '2.0',
        method: method,
        params: params
      };

      if (id !== null) {
        request.id = id;
      }

      this._sendMessage(request);
    }
  }, {
    key: "_handleMessage",
    value: function _handleMessage(json) {
      if (json.jsonrpc !== '2.0') {
        throw new Error("Bad or missing JSON-RPC version in message: ".concat(json));
      }

      if (json.hasOwnProperty('method')) {
        this._handleRequest(json);
      } else {
        this._handleResponse(json);
      }
    }
  }, {
    key: "_sendResponse",
    value: function _sendResponse(id, result, error) {
      var response = {
        jsonrpc: '2.0',
        id: id
      };

      if (error) {
        response.error = error;
      } else {
        response.result = result || null;
      }

      this._sendMessage(response);
    }
  }, {
    key: "_handleResponse",
    value: function _handleResponse(json) {
      var result = json.result,
          error = json.error,
          id = json.id;
      var openRequest = this._openRequests[id];
      delete this._openRequests[id];

      if (openRequest) {
        if (error) {
          openRequest.reject(error);
        } else {
          openRequest.resolve(result);
        }
      }
    }
  }, {
    key: "_handleRequest",
    value: function _handleRequest(json) {
      var _this2 = this;

      var method = json.method,
          params = json.params,
          id = json.id;
      var rawResult = this.didReceiveCall(method, params);

      if (id) {
        Promise.resolve(rawResult).then(function (result) {
          _this2._sendResponse(id, result);
        }, function (error) {
          _this2._sendResponse(id, null, error);
        });
      }
    }
  }]);

  return JSONRPC;
}();

var jsonrpc = JSONRPC;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;

function init() {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray(b64) {
  if (!inited) {
    init();
  }

  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  } // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice


  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0; // base64 is 4/3 + up to two characters of the original data

  arr = new Arr(len * 3 / 4 - placeHolders); // if there are placeholders, only get up to the last complete 4 chars

  l = placeHolders > 0 ? len - 4 : len;
  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];

  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  if (!inited) {
    init();
  }

  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  } // pad the end with zeros, but make sure to not forget the extra bytes


  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);
  return parts.join('');
}

function read(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;

  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;

  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }

  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);

    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }

    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;

  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;
var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */

Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined ? global$1.TYPED_ARRAY_SUPPORT : true;

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }

    that.length = length;
  }

  return that;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */


function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  } // Common case.


  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }

    return allocUnsafe(this, arg);
  }

  return from(this, arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192; // not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.

Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/


Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);

  if (size <= 0) {
    return createBuffer(that, size);
  }

  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }

  return createBuffer(that, size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/


Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }

  return that;
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */


Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */


Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }

  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }

  return that;
}

function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }

      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }

  return length | 0;
}
Buffer.isBuffer = isBuffer;

function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}

Buffer.compare = function compare(a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;
  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;

    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;

  if (length === undefined) {
    length = 0;

    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;

  for (i = 0; i < list.length; ++i) {
    var buf = list[i];

    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    buf.copy(buffer, pos);
    pos += buf.length;
  }

  return buffer;
};

function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }

  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }

  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0; // Use a for loop to avoid recursion

  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;

      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;

      case 'hex':
        return len >>> 1;

      case 'base64':
        return base64ToBytes(string).length;

      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8

        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}

Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.
  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

  if (start === undefined || start < 0) {
    start = 0;
  } // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.


  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.


  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
} // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.


Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;

  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }

  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }

  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;

  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }

  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }

  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;

  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }

  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }

  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = INSPECT_MAX_BYTES;

  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }

  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }

  if (end === undefined) {
    end = target ? target.length : 0;
  }

  if (thisStart === undefined) {
    thisStart = 0;
  }

  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }

  if (thisStart >= thisEnd) {
    return -1;
  }

  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
}; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf


function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1; // Normalize byteOffset

  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }

  byteOffset = +byteOffset; // Coerce to Number.

  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  } // Normalize byteOffset: negative offsets start from the end of the buffer


  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  } // Normalize val


  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  } // Finally, search either indexOf (if dir is true) or lastIndexOf


  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }

    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]

    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }

    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();

    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }

      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;

  if (dir) {
    var foundIndex = -1;

    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

    for (i = byteOffset; i >= 0; i--) {
      var found = true;

      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }

      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;

  if (!length) {
    length = remaining;
  } else {
    length = Number(length);

    if (length > remaining) {
      length = remaining;
    }
  } // must be an even number of digits


  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }

  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }

  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0; // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0; // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;

    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    } // legacy write(string, encoding, offset, length) - remove in v0.13

  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';
  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;

  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }

          break;

        case 2:
          secondByte = buf[i + 1];

          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }

      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
} // Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety


var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;

  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  } // Decode in chunks to avoid "call stack size exceeded".


  var res = '';
  var i = 0;

  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }

  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }

  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }

  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = '';

  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }

  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';

  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }

  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;
  var newBuf;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);

    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */


function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;

  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];

  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }

  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }

  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
}; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }

  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
}; // Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])


Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }

    if (val.length === 1) {
      var code = val.charCodeAt(0);

      if (code < 256) {
        val = code;
      }
    }

    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }

    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } // Invalid ranges are not set to a default, so can range check early.


  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;

  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;

    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
}; // HELPER FUNCTIONS
// ================


var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

  if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

  while (str.length % 4 !== 0) {
    str = str + '=';
  }

  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i); // is surrogate component

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } // valid lead


        leadSurrogate = codePoint;
        continue;
      } // 2 leads in a row


      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      } // valid surrogate pair


      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null; // encode utf8

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }

  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }

  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
} // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually


function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}

function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
} // For Node v0.10 support. Remove this eventually.


function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0));
}

var browserAtob = createCommonjsModule(function (module) {
  (function (w) {

    function findBest(atobNative) {
      // normal window
      if ('function' === typeof atobNative) {
        return atobNative;
      } // browserify (web worker)


      if ('function' === typeof Buffer) {
        return function atobBrowserify(a) {
          //!! Deliberately using an API that's deprecated in node.js because
          //!! this file is for browsers and we expect them to cope with it.
          //!! Discussion: github.com/node-browser-compat/atob/pull/9
          return new Buffer(a, 'base64').toString('binary');
        };
      } // ios web worker with base64js


      if ('object' === _typeof(w.base64js)) {
        // bufferToBinaryString
        // https://git.coolaj86.com/coolaj86/unibabel.js/blob/master/index.js#L50
        return function atobWebWorker_iOS(a) {
          var buf = w.base64js.b64ToByteArray(a);
          return Array.prototype.map.call(buf, function (ch) {
            return String.fromCharCode(ch);
          }).join('');
        };
      }

      return function () {
        // ios web worker without base64js
        throw new Error("You're probably in an old browser or an iOS webworker." + " It might help to include beatgammit's base64-js.");
      };
    }

    var atobBest = findBest(w.atob);
    w.atob = atobBest;

    if ( module && module.exports) {
      module.exports = atobBest;
    }
  })(window);
});

var btoa = createCommonjsModule(function (module) {
  (function () {

    function btoa(str) {
      var buffer;

      if (str instanceof Buffer) {
        buffer = str;
      } else {
        buffer = Buffer.from(str.toString(), 'binary');
      }

      return buffer.toString('base64');
    }

    module.exports = btoa;
  })();
});

var Base64Util = /*#__PURE__*/function () {
  function Base64Util() {
    _classCallCheck(this, Base64Util);
  }

  _createClass(Base64Util, null, [{
    key: "base64ToUint8Array",

    /**
     * Convert a base64 encoded string to a Uint8Array.
     * @param {string} base64 - a base64 encoded string.
     * @return {Uint8Array} - a decoded Uint8Array.
     */
    value: function base64ToUint8Array(base64) {
      var binaryString = browserAtob(base64);
      var len = binaryString.length;
      var array = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        array[i] = binaryString.charCodeAt(i);
      }

      return array;
    }
    /**
     * Convert a Uint8Array to a base64 encoded string.
     * @param {Uint8Array} array - the array to convert.
     * @return {string} - the base64 encoded string.
     */

  }, {
    key: "uint8ArrayToBase64",
    value: function uint8ArrayToBase64(array) {
      var base64 = btoa(String.fromCharCode.apply(null, array));
      return base64;
    }
    /**
    * Convert an array buffer to a base64 encoded string.
    * @param {array} buffer - an array buffer to convert.
    * @return {string} - the base64 encoded string.
    */

  }, {
    key: "arrayBufferToBase64",
    value: function arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;

      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      return btoa(binary);
    }
  }]);

  return Base64Util;
}();

var base64Util = Base64Util;

var WebBLE = /*#__PURE__*/function () {
  /**
   * A BLE peripheral object.  It handles connecting, over Web Bluetooth API, to
   * BLE peripherals, and reading and writing data to them.
   * @param {Runtime} runtime - the Runtime for sending/receiving GUI update events.
   * @param {string} extensionId - the id of the extension using this object.
   * @param {object} peripheralOptions - the list of options for peripheral discovery.
   * @param {object} connectCallback - a callback for connection.
   * @param {object} resetCallback - a callback for resetting extension state.
   */
  function WebBLE(runtime, extensionId, peripheralOptions, connectCallback) {
    var resetCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, WebBLE);

    /**
     * Remote device which have been connected.
     * @type {BluetoothDevice}
     */
    this._device = null;
    /**
     * Remote GATT server
     * @type {BluetoothRemoteGATTServer}
     */

    this._server = null;
    this._connectCallback = connectCallback;
    this._disconnected = true;
    this._characteristicDidChangeCallback = null;
    this._resetCallback = resetCallback;
    this._extensionId = extensionId;
    this._peripheralOptions = peripheralOptions;
    this._runtime = runtime;
    this.requestPeripheral();
  }
  /**
   * Request connection to the peripheral.
   * Request user to choose a device, and then connect it automatically.
   */


  _createClass(WebBLE, [{
    key: "requestPeripheral",
    value: function requestPeripheral() {
      var _this = this;

      if (this._server) {
        this.disconnect();
      }

      navigator.bluetooth.requestDevice(this._peripheralOptions).then(function (device) {
        _this._device = device;
        log.debug("device=".concat(_this._device.name));

        _this._runtime.connectPeripheral(_this._extensionId, _this._device.id);
      }).catch(function (e) {
        _this._handleRequestError(e);
      });
    }
    /**
     * Try connecting to the GATT server of the device, and then call the connect
     * callback when connection is successful.
     */

  }, {
    key: "connectPeripheral",
    value: function connectPeripheral()
    /* id */
    {
      var _this2 = this;

      if (!this._device) {
        throw new Error('device is not chosen');
      }

      this._device.gatt.connect().then(function (gattServer) {
        log.debug("GATTServer is connected");
        _this2._server = gattServer;

        _this2._runtime.emit(_this2._runtime.constructor.PERIPHERAL_CONNECTED);

        _this2._disconnected = false;

        _this2._connectCallback();

        _this2._device.addEventListener('gattserverdisconnected', function (event) {
          _this2.onDisconnected(event);
        });
      });
    }
    /**
     * Disconnect from the device and clean up.
     * Then emit the connection state by the runtime.
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      if (!this._server) return;

      this._server.disconnect();

      this._server = null;
      this._device = null;

      this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);

      this._disconnected = true;
    }
    /**
     * @return {bool} whether the peripheral is connected.
     */

  }, {
    key: "isConnected",
    value: function isConnected() {
      if (!this._server) return false;
      return this._server.connected;
    }
    /**
     * Start receiving notifications from the specified ble service.
     * @param {number} serviceId - the ble service to read.
     * @param {number} characteristicId - the ble characteristic to get notifications from.
     * @param {object} onCharacteristicChanged - callback for characteristic change notifications
     *  like function(base64message).
     * @return {Promise} - a promise from the remote startNotifications request.
     */

  }, {
    key: "startNotifications",
    value: function startNotifications(serviceId, characteristicId) {
      var onCharacteristicChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return this._server.getPrimaryService(serviceId).then(function (service) {
        return service.getCharacteristic(characteristicId);
      }).then(function (characteristic) {
        characteristic.addEventListener('characteristicvaluechanged', function (event) {
          var dataView = event.target.value;
          onCharacteristicChanged(base64Util.arrayBufferToBase64(dataView.buffer));
        });
        characteristic.startNotifications();
      });
    }
    /**
     * Read from the specified ble service.
     * @param {number} serviceId - the ble service to read.
     * @param {number} characteristicId - the ble characteristic to read.
     * @param {boolean} optStartNotifications - whether to start receiving characteristic change notifications.
     * @param {object} onCharacteristicChanged - callback for characteristic change notifications
     *  like function(base64message).
     * @return {Promise} - a promise from the remote read request which resolve {message: base64string}.
     */

  }, {
    key: "read",
    value: function read(serviceId, characteristicId) {
      var _this3 = this;

      var optStartNotifications = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var onCharacteristicChanged = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return this._server.getPrimaryService(serviceId).then(function (service) {
        return service.getCharacteristic(characteristicId);
      }).then(function (characteristic) {
        if (optStartNotifications) {
          _this3.startNotifications(serviceId, characteristicId, onCharacteristicChanged);
        }

        return characteristic.readValue();
      }).then(function (dataView) {
        return {
          message: base64Util.arrayBufferToBase64(dataView.buffer)
        };
      });
    }
    /**
     * Write data to the specified ble service.
     * @param {number} serviceId - the ble service to write.
     * @param {number} characteristicId - the ble characteristic to write.
     * @param {string} message - the message to send.
     * @param {string} encoding - the message encoding type.
     * @param {boolean} withResponse - if true, resolve after peripheral's response.
     * @return {Promise} - a promise from the remote send request.
     */
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "write",
    value: function write(serviceId, characteristicId, message) {
      var encoding = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var withResponse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var value = encoding === 'base64' ? base64Util.base64ToUint8Array(message) : message;
      return this._server.getPrimaryService(serviceId).then(function (service) {
        return service.getCharacteristic(characteristicId);
      }).then(function (characteristic) {
        if (withResponse) {
          return characteristic.writeValueWithResponse(value);
        }

        return characteristic.writeValue(value);
      });
    }
    /**
     * Handle an error resulting from losing connection to a peripheral.
     *
     * This could be due to:
     * - battery depletion
     * - going out of bluetooth range
     * - being powered down
     *
     * Disconnect the device, and if the extension using this object has a
     * reset callback, call it. Finally, emit an error to the runtime.
     */

  }, {
    key: "handleDisconnectError",
    value: function handleDisconnectError()
    /* e */
    {
      // log.error(`BLE error: ${JSON.stringify(e)}`);
      if (this._disconnected) return;
      this.disconnect();

      if (this._resetCallback) {
        this._resetCallback();
      }

      this._runtime.emit(this._runtime.constructor.PERIPHERAL_CONNECTION_LOST_ERROR, {
        message: "Scratch lost connection to",
        extensionId: this._extensionId
      });
    }
  }, {
    key: "_handleRequestError",
    value: function _handleRequestError()
    /* e */
    {
      // log.error(`BLE error: ${JSON.stringify(e)}`);
      this._runtime.emit(this._runtime.constructor.PERIPHERAL_REQUEST_ERROR, {
        message: "Scratch lost connection to",
        extensionId: this._extensionId
      });
    }
    /**
     * Called when disconnected by the device.
     */

  }, {
    key: "onDisconnected",
    value: function onDisconnected()
    /* event */
    {
      this.handleDisconnectError(new Error('device disconnected'));
    }
  }]);

  return WebBLE;
}();

var bleWeb = WebBLE;

var BLE = /*#__PURE__*/function (_JSONRPC) {
  _inherits(BLE, _JSONRPC);

  var _super = _createSuper(BLE);

  /**
   * A BLE peripheral socket object.  It handles connecting, over web sockets, to
   * BLE peripherals, and reading and writing data to them.
   * @param {Runtime} runtime - the Runtime for sending/receiving GUI update events.
   * @param {string} extensionId - the id of the extension using this socket.
   * @param {object} peripheralOptions - the list of options for peripheral discovery.
   * @param {object} connectCallback - a callback for connection.
   * @param {object} resetCallback - a callback for resetting extension state.
   */
  function BLE(runtime, extensionId, peripheralOptions, connectCallback) {
    var _this;

    var resetCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, BLE);

    _this = _super.call(this);
    _this._socket = runtime.getScratchLinkSocket('BLE');

    _this._socket.setOnOpen(_this.requestPeripheral.bind(_assertThisInitialized(_this)));

    _this._socket.setOnClose(_this.handleDisconnectError.bind(_assertThisInitialized(_this)));

    _this._socket.setOnError(_this._handleRequestError.bind(_assertThisInitialized(_this)));

    _this._socket.setHandleMessage(_this._handleMessage.bind(_assertThisInitialized(_this)));

    _this._sendMessage = _this._socket.sendMessage.bind(_this._socket);
    _this._availablePeripherals = {};
    _this._connectCallback = connectCallback;
    _this._connected = false;
    _this._characteristicDidChangeCallback = null;
    _this._resetCallback = resetCallback;
    _this._discoverTimeoutID = null;
    _this._extensionId = extensionId;
    _this._peripheralOptions = peripheralOptions;
    _this._runtime = runtime;

    _this._socket.open();

    return _this;
  }
  /**
   * Request connection to the peripheral.
   * If the web socket is not yet open, request when the socket promise resolves.
   */


  _createClass(BLE, [{
    key: "requestPeripheral",
    value: function requestPeripheral() {
      var _this2 = this;

      this._availablePeripherals = {};

      if (this._discoverTimeoutID) {
        window.clearTimeout(this._discoverTimeoutID);
      }

      this._discoverTimeoutID = window.setTimeout(this._handleDiscoverTimeout.bind(this), 15000);
      this.sendRemoteRequest('discover', this._peripheralOptions).catch(function (e) {
        _this2._handleRequestError(e);
      });
    }
    /**
     * Try connecting to the input peripheral id, and then call the connect
     * callback if connection is successful.
     * @param {number} id - the id of the peripheral to connect to
     */

  }, {
    key: "connectPeripheral",
    value: function connectPeripheral(id) {
      var _this3 = this;

      this.sendRemoteRequest('connect', {
        peripheralId: id
      }).then(function () {
        _this3._connected = true;

        _this3._runtime.emit(_this3._runtime.constructor.PERIPHERAL_CONNECTED);

        _this3._connectCallback();
      }).catch(function (e) {
        _this3._handleRequestError(e);
      });
    }
    /**
     * Close the websocket.
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this._connected) {
        this._connected = false;
      }

      if (this._socket.isOpen()) {
        this._socket.close();
      }

      if (this._discoverTimeoutID) {
        window.clearTimeout(this._discoverTimeoutID);
      } // Sets connection status icon to orange


      this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);
    }
    /**
     * @return {bool} whether the peripheral is connected.
     */

  }, {
    key: "isConnected",
    value: function isConnected() {
      return this._connected;
    }
    /**
     * Start receiving notifications from the specified ble service.
     * @param {number} serviceId - the ble service to read.
     * @param {number} characteristicId - the ble characteristic to get notifications from.
     * @param {object} onCharacteristicChanged - callback for characteristic change notifications.
     * @return {Promise} - a promise from the remote startNotifications request.
     */

  }, {
    key: "startNotifications",
    value: function startNotifications(serviceId, characteristicId) {
      var _this4 = this;

      var onCharacteristicChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var params = {
        serviceId: serviceId,
        characteristicId: characteristicId
      };
      this._characteristicDidChangeCallback = onCharacteristicChanged;
      return this.sendRemoteRequest('startNotifications', params).catch(function (e) {
        _this4.handleDisconnectError(e);
      });
    }
    /**
     * Read from the specified ble service.
     * @param {number} serviceId - the ble service to read.
     * @param {number} characteristicId - the ble characteristic to read.
     * @param {boolean} optStartNotifications - whether to start receiving characteristic change notifications.
     * @param {object} onCharacteristicChanged - callback for characteristic change notifications.
     * @return {Promise} - a promise from the remote read request.
     */

  }, {
    key: "read",
    value: function read(serviceId, characteristicId) {
      var _this5 = this;

      var optStartNotifications = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var onCharacteristicChanged = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var params = {
        serviceId: serviceId,
        characteristicId: characteristicId
      };

      if (optStartNotifications) {
        params.startNotifications = true;
      }

      if (onCharacteristicChanged) {
        this._characteristicDidChangeCallback = onCharacteristicChanged;
      }

      return this.sendRemoteRequest('read', params).catch(function (e) {
        _this5.handleDisconnectError(e);
      });
    }
    /**
     * Write data to the specified ble service.
     * @param {number} serviceId - the ble service to write.
     * @param {number} characteristicId - the ble characteristic to write.
     * @param {string} message - the message to send.
     * @param {string} encoding - the message encoding type.
     * @param {boolean} withResponse - if true, resolve after peripheral's response.
     * @return {Promise} - a promise from the remote send request.
     */

  }, {
    key: "write",
    value: function write(serviceId, characteristicId, message) {
      var _this6 = this;

      var encoding = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var withResponse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var params = {
        serviceId: serviceId,
        characteristicId: characteristicId,
        message: message
      };

      if (encoding) {
        params.encoding = encoding;
      }

      if (withResponse !== null) {
        params.withResponse = withResponse;
      }

      return this.sendRemoteRequest('write', params).catch(function (e) {
        _this6.handleDisconnectError(e);
      });
    }
    /**
     * Handle a received call from the socket.
     * @param {string} method - a received method label.
     * @param {object} params - a received list of parameters.
     * @return {object} - optional return value.
     */

  }, {
    key: "didReceiveCall",
    value: function didReceiveCall(method, params) {
      switch (method) {
        case 'didDiscoverPeripheral':
          this._availablePeripherals[params.peripheralId] = params;

          this._runtime.emit(this._runtime.constructor.PERIPHERAL_LIST_UPDATE, this._availablePeripherals);

          if (this._discoverTimeoutID) {
            window.clearTimeout(this._discoverTimeoutID);
          }

          break;

        case 'characteristicDidChange':
          if (this._characteristicDidChangeCallback) {
            this._characteristicDidChangeCallback(params.message);
          }

          break;

        case 'ping':
          return 42;
      }
    }
    /**
     * Handle an error resulting from losing connection to a peripheral.
     *
     * This could be due to:
     * - battery depletion
     * - going out of bluetooth range
     * - being powered down
     *
     * Disconnect the socket, and if the extension using this socket has a
     * reset callback, call it. Finally, emit an error to the runtime.
     */

  }, {
    key: "handleDisconnectError",
    value: function handleDisconnectError()
    /* e */
    {
      // log.error(`BLE error: ${JSON.stringify(e)}`);
      if (!this._connected) return;
      this.disconnect();

      if (this._resetCallback) {
        this._resetCallback();
      }

      this._runtime.emit(this._runtime.constructor.PERIPHERAL_CONNECTION_LOST_ERROR, {
        message: "Scratch lost connection to",
        extensionId: this._extensionId
      });
    }
  }, {
    key: "_handleRequestError",
    value: function _handleRequestError()
    /* e */
    {
      // log.error(`BLE error: ${JSON.stringify(e)}`);
      this._runtime.emit(this._runtime.constructor.PERIPHERAL_REQUEST_ERROR, {
        message: "Scratch lost connection to",
        extensionId: this._extensionId
      });
    }
  }, {
    key: "_handleDiscoverTimeout",
    value: function _handleDiscoverTimeout() {
      if (this._discoverTimeoutID) {
        window.clearTimeout(this._discoverTimeoutID);
      }

      this._runtime.emit(this._runtime.constructor.PERIPHERAL_SCAN_TIMEOUT);
    }
  }]);

  return BLE;
}(jsonrpc);

var ble = navigator.bluetooth ? bleWeb : BLE;

var formatMessageParse = createCommonjsModule(function (module, exports) {
  /*::
  export type AST = Element[]
  export type Element = string | Placeholder
  export type Placeholder = Plural | Styled | Typed | Simple
  export type Plural = [ string, 'plural' | 'selectordinal', number, SubMessages ]
  export type Styled = [ string, string, string | SubMessages ]
  export type Typed = [ string, string ]
  export type Simple = [ string ]
  export type SubMessages = { [string]: AST }
  export type Token = [ TokenType, string ]
  export type TokenType = 'text' | 'space' | 'id' | 'type' | 'style' | 'offset' | 'number' | 'selector' | 'syntax'
  type Context = {|
    pattern: string,
    index: number,
    tagsType: ?string,
    tokens: ?Token[]
  |}
  */

  var ARG_OPN = '{';
  var ARG_CLS = '}';
  var ARG_SEP = ',';
  var NUM_ARG = '#';
  var TAG_OPN = '<';
  var TAG_CLS = '>';
  var TAG_END = '</';
  var TAG_SELF_CLS = '/>';
  var ESC = '\'';
  var OFFSET = 'offset:';
  var simpleTypes = ['number', 'date', 'time', 'ordinal', 'duration', 'spellout'];
  var submTypes = ['plural', 'select', 'selectordinal'];
  /**
   * parse
   *
   * Turns this:
   *  `You have { numBananas, plural,
   *       =0 {no bananas}
   *      one {a banana}
   *    other {# bananas}
   *  } for sale`
   *
   * into this:
   *  [ "You have ", [ "numBananas", "plural", 0, {
   *       "=0": [ "no bananas" ],
   *      "one": [ "a banana" ],
   *    "other": [ [ '#' ], " bananas" ]
   *  } ], " for sale." ]
   *
   * tokens:
   *  [
   *    [ "text", "You have " ],
   *    [ "syntax", "{" ],
   *    [ "space", " " ],
   *    [ "id", "numBananas" ],
   *    [ "syntax", ", " ],
   *    [ "space", " " ],
   *    [ "type", "plural" ],
   *    [ "syntax", "," ],
   *    [ "space", "\n     " ],
   *    [ "selector", "=0" ],
   *    [ "space", " " ],
   *    [ "syntax", "{" ],
   *    [ "text", "no bananas" ],
   *    [ "syntax", "}" ],
   *    [ "space", "\n    " ],
   *    [ "selector", "one" ],
   *    [ "space", " " ],
   *    [ "syntax", "{" ],
   *    [ "text", "a banana" ],
   *    [ "syntax", "}" ],
   *    [ "space", "\n  " ],
   *    [ "selector", "other" ],
   *    [ "space", " " ],
   *    [ "syntax", "{" ],
   *    [ "syntax", "#" ],
   *    [ "text", " bananas" ],
   *    [ "syntax", "}" ],
   *    [ "space", "\n" ],
   *    [ "syntax", "}" ],
   *    [ "text", " for sale." ]
   *  ]
   **/

  exports = module.exports = function parse(pattern
  /*: string */
  , options
  /*:: ?: { tagsType?: string, tokens?: Token[] } */
  )
  /*: AST */
  {
    return parseAST({
      pattern: String(pattern),
      index: 0,
      tagsType: options && options.tagsType || null,
      tokens: options && options.tokens || null
    }, '');
  };

  function parseAST(current
  /*: Context */
  , parentType
  /*: string */
  )
  /*: AST */
  {
    var pattern = current.pattern;
    var length = pattern.length;
    var elements
    /*: AST */
    = [];
    var start = current.index;
    var text = parseText(current, parentType);
    if (text) elements.push(text);
    if (text && current.tokens) current.tokens.push(['text', pattern.slice(start, current.index)]);

    while (current.index < length) {
      if (pattern[current.index] === ARG_CLS) {
        if (!parentType) throw expected(current);
        break;
      }

      if (parentType && current.tagsType && pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) break;
      elements.push(parsePlaceholder(current));
      start = current.index;
      text = parseText(current, parentType);
      if (text) elements.push(text);
      if (text && current.tokens) current.tokens.push(['text', pattern.slice(start, current.index)]);
    }

    return elements;
  }

  function parseText(current
  /*: Context */
  , parentType
  /*: string */
  )
  /*: string */
  {
    var pattern = current.pattern;
    var length = pattern.length;
    var isHashSpecial = parentType === 'plural' || parentType === 'selectordinal';
    var isAngleSpecial = !!current.tagsType;
    var isArgStyle = parentType === '{style}';
    var text = '';

    while (current.index < length) {
      var char = pattern[current.index];

      if (char === ARG_OPN || char === ARG_CLS || isHashSpecial && char === NUM_ARG || isAngleSpecial && char === TAG_OPN || isArgStyle && isWhitespace(char.charCodeAt(0))) {
        break;
      } else if (char === ESC) {
        char = pattern[++current.index];

        if (char === ESC) {
          // double is always 1 '
          text += char;
          ++current.index;
        } else if ( // only when necessary
        char === ARG_OPN || char === ARG_CLS || isHashSpecial && char === NUM_ARG || isAngleSpecial && char === TAG_OPN || isArgStyle) {
          text += char;

          while (++current.index < length) {
            char = pattern[current.index];

            if (char === ESC && pattern[current.index + 1] === ESC) {
              // double is always 1 '
              text += ESC;
              ++current.index;
            } else if (char === ESC) {
              // end of quoted
              ++current.index;
              break;
            } else {
              text += char;
            }
          }
        } else {
          // lone ' is just a '
          text += ESC; // already incremented
        }
      } else {
        text += char;
        ++current.index;
      }
    }

    return text;
  }

  function isWhitespace(code
  /*: number */
  )
  /*: boolean */
  {
    return code >= 0x09 && code <= 0x0D || code === 0x20 || code === 0x85 || code === 0xA0 || code === 0x180E || code >= 0x2000 && code <= 0x200D || code === 0x2028 || code === 0x2029 || code === 0x202F || code === 0x205F || code === 0x2060 || code === 0x3000 || code === 0xFEFF;
  }

  function skipWhitespace(current
  /*: Context */
  )
  /*: void */
  {
    var pattern = current.pattern;
    var length = pattern.length;
    var start = current.index;

    while (current.index < length && isWhitespace(pattern.charCodeAt(current.index))) {
      ++current.index;
    }

    if (start < current.index && current.tokens) {
      current.tokens.push(['space', current.pattern.slice(start, current.index)]);
    }
  }

  function parsePlaceholder(current
  /*: Context */
  )
  /*: Placeholder */
  {
    var pattern = current.pattern;

    if (pattern[current.index] === NUM_ARG) {
      if (current.tokens) current.tokens.push(['syntax', NUM_ARG]);
      ++current.index; // move passed #

      return [NUM_ARG];
    }

    var tag = parseTag(current);
    if (tag) return tag;
    /* istanbul ignore if should be unreachable if parseAST and parseText are right */

    if (pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN);
    if (current.tokens) current.tokens.push(['syntax', ARG_OPN]);
    ++current.index; // move passed {

    skipWhitespace(current);
    var id = parseId(current);
    if (!id) throw expected(current, 'placeholder id');
    if (current.tokens) current.tokens.push(['id', id]);
    skipWhitespace(current);
    var char = pattern[current.index];

    if (char === ARG_CLS) {
      // end placeholder
      if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
      ++current.index; // move passed }

      return [id];
    }

    if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS);
    if (current.tokens) current.tokens.push(['syntax', ARG_SEP]);
    ++current.index; // move passed ,

    skipWhitespace(current);
    var type = parseId(current);
    if (!type) throw expected(current, 'placeholder type');
    if (current.tokens) current.tokens.push(['type', type]);
    skipWhitespace(current);
    char = pattern[current.index];

    if (char === ARG_CLS) {
      // end placeholder
      if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);

      if (type === 'plural' || type === 'selectordinal' || type === 'select') {
        throw expected(current, type + ' sub-messages');
      }

      ++current.index; // move passed }

      return [id, type];
    }

    if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS);
    if (current.tokens) current.tokens.push(['syntax', ARG_SEP]);
    ++current.index; // move passed ,

    skipWhitespace(current);
    var arg;

    if (type === 'plural' || type === 'selectordinal') {
      var offset = parsePluralOffset(current);
      skipWhitespace(current);
      arg = [id, type, offset, parseSubMessages(current, type)];
    } else if (type === 'select') {
      arg = [id, type, parseSubMessages(current, type)];
    } else if (simpleTypes.indexOf(type) >= 0) {
      arg = [id, type, parseSimpleFormat(current)];
    } else {
      // custom placeholder type
      var index = current.index;
      var format
      /*: string | SubMessages */
      = parseSimpleFormat(current);
      skipWhitespace(current);

      if (pattern[current.index] === ARG_OPN) {
        current.index = index; // rewind, since should have been submessages

        format = parseSubMessages(current, type);
      }

      arg = [id, type, format];
    }

    skipWhitespace(current);
    if (pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS);
    if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
    ++current.index; // move passed }

    return arg;
  }

  function parseTag(current
  /*: Context */
  )
  /*: ?Placeholder */
  {
    var tagsType = current.tagsType;
    if (!tagsType || current.pattern[current.index] !== TAG_OPN) return;

    if (current.pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) {
      throw expected(current, null, 'closing tag without matching opening tag');
    }

    if (current.tokens) current.tokens.push(['syntax', TAG_OPN]);
    ++current.index; // move passed <

    var id = parseId(current, true);
    if (!id) throw expected(current, 'placeholder id');
    if (current.tokens) current.tokens.push(['id', id]);
    skipWhitespace(current);

    if (current.pattern.slice(current.index, current.index + TAG_SELF_CLS.length) === TAG_SELF_CLS) {
      if (current.tokens) current.tokens.push(['syntax', TAG_SELF_CLS]);
      current.index += TAG_SELF_CLS.length;
      return [id, tagsType];
    }

    if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS);
    if (current.tokens) current.tokens.push(['syntax', TAG_CLS]);
    ++current.index; // move passed >

    var children = parseAST(current, tagsType);
    var end = current.index;
    if (current.pattern.slice(current.index, current.index + TAG_END.length) !== TAG_END) throw expected(current, TAG_END + id + TAG_CLS);
    if (current.tokens) current.tokens.push(['syntax', TAG_END]);
    current.index += TAG_END.length;
    var closeId = parseId(current, true);
    if (closeId && current.tokens) current.tokens.push(['id', closeId]);

    if (id !== closeId) {
      current.index = end; // rewind for better error message

      throw expected(current, TAG_END + id + TAG_CLS, TAG_END + closeId + TAG_CLS);
    }

    skipWhitespace(current);
    if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS);
    if (current.tokens) current.tokens.push(['syntax', TAG_CLS]);
    ++current.index; // move passed >

    return [id, tagsType, {
      children: children
    }];
  }

  function parseId(current
  /*: Context */
  , isTag
  /*:: ?: boolean */
  )
  /*: string */
  {
    var pattern = current.pattern;
    var length = pattern.length;
    var id = '';

    while (current.index < length) {
      var char = pattern[current.index];
      if (char === ARG_OPN || char === ARG_CLS || char === ARG_SEP || char === NUM_ARG || char === ESC || isWhitespace(char.charCodeAt(0)) || isTag && (char === TAG_OPN || char === TAG_CLS || char === '/')) break;
      id += char;
      ++current.index;
    }

    return id;
  }

  function parseSimpleFormat(current
  /*: Context */
  )
  /*: string */
  {
    var start = current.index;
    var style = parseText(current, '{style}');
    if (!style) throw expected(current, 'placeholder style name');
    if (current.tokens) current.tokens.push(['style', current.pattern.slice(start, current.index)]);
    return style;
  }

  function parsePluralOffset(current
  /*: Context */
  )
  /*: number */
  {
    var pattern = current.pattern;
    var length = pattern.length;
    var offset = 0;

    if (pattern.slice(current.index, current.index + OFFSET.length) === OFFSET) {
      if (current.tokens) current.tokens.push(['offset', 'offset'], ['syntax', ':']);
      current.index += OFFSET.length; // move passed offset:

      skipWhitespace(current);
      var start = current.index;

      while (current.index < length && isDigit(pattern.charCodeAt(current.index))) {
        ++current.index;
      }

      if (start === current.index) throw expected(current, 'offset number');
      if (current.tokens) current.tokens.push(['number', pattern.slice(start, current.index)]);
      offset = +pattern.slice(start, current.index);
    }

    return offset;
  }

  function isDigit(code
  /*: number */
  )
  /*: boolean */
  {
    return code >= 0x30 && code <= 0x39;
  }

  function parseSubMessages(current
  /*: Context */
  , parentType
  /*: string */
  )
  /*: SubMessages */
  {
    var pattern = current.pattern;
    var length = pattern.length;
    var options
    /*: SubMessages */
    = {};

    while (current.index < length && pattern[current.index] !== ARG_CLS) {
      var selector = parseId(current);
      if (!selector) throw expected(current, 'sub-message selector');
      if (current.tokens) current.tokens.push(['selector', selector]);
      skipWhitespace(current);
      options[selector] = parseSubMessage(current, parentType);
      skipWhitespace(current);
    }

    if (!options.other && submTypes.indexOf(parentType) >= 0) {
      throw expected(current, null, null, '"other" sub-message must be specified in ' + parentType);
    }

    return options;
  }

  function parseSubMessage(current
  /*: Context */
  , parentType
  /*: string */
  )
  /*: AST */
  {
    if (current.pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN + ' to start sub-message');
    if (current.tokens) current.tokens.push(['syntax', ARG_OPN]);
    ++current.index; // move passed {

    var message = parseAST(current, parentType);
    if (current.pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS + ' to end sub-message');
    if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
    ++current.index; // move passed }

    return message;
  }

  function expected(current
  /*: Context */
  , expected
  /*:: ?: ?string */
  , found
  /*:: ?: ?string */
  , message
  /*:: ?: string */
  ) {
    var pattern = current.pattern;
    var lines = pattern.slice(0, current.index).split(/\r?\n/);
    var offset = current.index;
    var line = lines.length;
    var column = lines.slice(-1)[0].length;
    found = found || (current.index >= pattern.length ? 'end of message pattern' : parseId(current) || pattern[current.index]);
    if (!message) message = errorMessage(expected, found);
    message += ' in ' + pattern.replace(/\r?\n/g, '\n');
    return new SyntaxError(message, expected, found, offset, line, column);
  }

  function errorMessage(expected
  /*: ?string */
  , found
  /* string */
  ) {
    if (!expected) return 'Unexpected ' + found + ' found';
    return 'Expected ' + expected + ' but found ' + found;
  }
  /**
   * SyntaxError
   *  Holds information about bad syntax found in a message pattern
   **/


  function SyntaxError(message
  /*: string */
  , expected
  /*: ?string */
  , found
  /*: ?string */
  , offset
  /*: number */
  , line
  /*: number */
  , column
  /*: number */
  ) {
    Error.call(this, message);
    this.name = 'SyntaxError';
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.offset = offset;
    this.line = line;
    this.column = column;
  }

  SyntaxError.prototype = Object.create(Error.prototype);
  exports.SyntaxError = SyntaxError;
});

// @flow
var LONG = 'long';
var SHORT = 'short';
var NARROW = 'narrow';
var NUMERIC = 'numeric';
var TWODIGIT = '2-digit';
/**
 * formatting information
 **/

var formatMessageFormats = {
  number: {
    decimal: {
      style: 'decimal'
    },
    integer: {
      style: 'decimal',
      maximumFractionDigits: 0
    },
    currency: {
      style: 'currency',
      currency: 'USD'
    },
    percent: {
      style: 'percent'
    },
    default: {
      style: 'decimal'
    }
  },
  date: {
    short: {
      month: NUMERIC,
      day: NUMERIC,
      year: TWODIGIT
    },
    medium: {
      month: SHORT,
      day: NUMERIC,
      year: NUMERIC
    },
    long: {
      month: LONG,
      day: NUMERIC,
      year: NUMERIC
    },
    full: {
      month: LONG,
      day: NUMERIC,
      year: NUMERIC,
      weekday: LONG
    },
    default: {
      month: SHORT,
      day: NUMERIC,
      year: NUMERIC
    }
  },
  time: {
    short: {
      hour: NUMERIC,
      minute: NUMERIC
    },
    medium: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC
    },
    long: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC,
      timeZoneName: SHORT
    },
    full: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC,
      timeZoneName: SHORT
    },
    default: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC
    }
  },
  duration: {
    default: {
      hours: {
        minimumIntegerDigits: 1,
        maximumFractionDigits: 0
      },
      minutes: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0
      },
      seconds: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 3
      }
    }
  },
  parseNumberPattern: function parseNumberPattern(pattern
  /*: ?string */
  ) {
    if (!pattern) return;
    var options = {};
    var currency = pattern.match(/\b[A-Z]{3}\b/i);
    var syms = pattern.replace(/[^¤]/g, '').length;
    if (!syms && currency) syms = 1;

    if (syms) {
      options.style = 'currency';
      options.currencyDisplay = syms === 1 ? 'symbol' : syms === 2 ? 'code' : 'name';
      options.currency = currency ? currency[0].toUpperCase() : 'USD';
    } else if (pattern.indexOf('%') >= 0) {
      options.style = 'percent';
    }

    if (!/[@#0]/.test(pattern)) return options.style ? options : undefined;
    options.useGrouping = pattern.indexOf(',') >= 0;

    if (/E\+?[@#0]+/i.test(pattern) || pattern.indexOf('@') >= 0) {
      var size = pattern.replace(/E\+?[@#0]+|[^@#0]/gi, '');
      options.minimumSignificantDigits = Math.min(Math.max(size.replace(/[^@0]/g, '').length, 1), 21);
      options.maximumSignificantDigits = Math.min(Math.max(size.length, 1), 21);
    } else {
      var parts = pattern.replace(/[^#0.]/g, '').split('.');
      var integer = parts[0];
      var n = integer.length - 1;

      while (integer[n] === '0') {
        --n;
      }

      options.minimumIntegerDigits = Math.min(Math.max(integer.length - 1 - n, 1), 21);
      var fraction = parts[1] || '';
      n = 0;

      while (fraction[n] === '0') {
        ++n;
      }

      options.minimumFractionDigits = Math.min(Math.max(n, 0), 20);

      while (fraction[n] === '#') {
        ++n;
      }

      options.maximumFractionDigits = Math.min(Math.max(n, 0), 20);
    }

    return options;
  },
  parseDatePattern: function parseDatePattern(pattern
  /*: ?string */
  ) {
    if (!pattern) return;
    var options = {};

    for (var i = 0; i < pattern.length;) {
      var current = pattern[i];
      var n = 1;

      while (pattern[++i] === current) {
        ++n;
      }

      switch (current) {
        case 'G':
          options.era = n === 5 ? NARROW : n === 4 ? LONG : SHORT;
          break;

        case 'y':
        case 'Y':
          options.year = n === 2 ? TWODIGIT : NUMERIC;
          break;

        case 'M':
        case 'L':
          n = Math.min(Math.max(n - 1, 0), 4);
          options.month = [NUMERIC, TWODIGIT, SHORT, LONG, NARROW][n];
          break;

        case 'E':
        case 'e':
        case 'c':
          options.weekday = n === 5 ? NARROW : n === 4 ? LONG : SHORT;
          break;

        case 'd':
        case 'D':
          options.day = n === 2 ? TWODIGIT : NUMERIC;
          break;

        case 'h':
        case 'K':
          options.hour12 = true;
          options.hour = n === 2 ? TWODIGIT : NUMERIC;
          break;

        case 'H':
        case 'k':
          options.hour12 = false;
          options.hour = n === 2 ? TWODIGIT : NUMERIC;
          break;

        case 'm':
          options.minute = n === 2 ? TWODIGIT : NUMERIC;
          break;

        case 's':
        case 'S':
          options.second = n === 2 ? TWODIGIT : NUMERIC;
          break;

        case 'z':
        case 'Z':
        case 'v':
        case 'V':
          options.timeZoneName = n === 1 ? SHORT : LONG;
          break;
      }
    }

    return Object.keys(options).length ? options : undefined;
  }
};

// @flow
// "lookup" algorithm http://tools.ietf.org/html/rfc4647#section-3.4
// assumes normalized language tags, and matches in a case sensitive manner
var lookupClosestLocale = function lookupClosestLocale(locale
/*: string | string[] | void */
, available
/*: { [string]: any } */
)
/*: ?string */
{
  if (typeof locale === 'string' && available[locale]) return locale;
  var locales = [].concat(locale || []);

  for (var l = 0, ll = locales.length; l < ll; ++l) {
    var current = locales[l].split('-');

    while (current.length) {
      var candidate = current.join('-');
      if (available[candidate]) return candidate;
      current.pop();
    }
  }
};

// @flow
/*:: export type Rule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other' */

var zero = 'zero',
    one = 'one',
    two = 'two',
    few = 'few',
    many = 'many',
    other = 'other';
var f = [function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return 0 <= n && n <= 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var n = +s;
  return i === 0 || n === 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 0 ? zero : n === 1 ? one : n === 2 ? two : 3 <= n % 100 && n % 100 <= 10 ? few : 11 <= n % 100 && n % 100 <= 99 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return i === 1 && v === 0 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n % 10 === 1 && n % 100 !== 11 ? one : 2 <= n % 10 && n % 10 <= 4 && (n % 100 < 12 || 14 < n % 100) ? few : n % 10 === 0 || 5 <= n % 10 && n % 10 <= 9 || 11 <= n % 100 && n % 100 <= 14 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n % 10 === 1 && n % 100 !== 11 && n % 100 !== 71 && n % 100 !== 91 ? one : n % 10 === 2 && n % 100 !== 12 && n % 100 !== 72 && n % 100 !== 92 ? two : (3 <= n % 10 && n % 10 <= 4 || n % 10 === 9) && (n % 100 < 10 || 19 < n % 100) && (n % 100 < 70 || 79 < n % 100) && (n % 100 < 90 || 99 < n % 100) ? few : n !== 0 && n % 1000000 === 0 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && i % 10 === 1 && i % 100 !== 11 || f % 10 === 1 && f % 100 !== 11 ? one : v === 0 && 2 <= i % 10 && i % 10 <= 4 && (i % 100 < 12 || 14 < i % 100) || 2 <= f % 10 && f % 10 <= 4 && (f % 100 < 12 || 14 < f % 100) ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return i === 1 && v === 0 ? one : 2 <= i && i <= 4 && v === 0 ? few : v !== 0 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 0 ? zero : n === 1 ? one : n === 2 ? two : n === 3 ? few : n === 6 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var t = +('' + s).replace(/^[^.]*.?|0+$/g, '');
  var n = +s;
  return n === 1 || t !== 0 && (i === 0 || i === 1) ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && i % 100 === 1 || f % 100 === 1 ? one : v === 0 && i % 100 === 2 || f % 100 === 2 ? two : v === 0 && 3 <= i % 100 && i % 100 <= 4 || 3 <= f % 100 && f % 100 <= 4 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  return i === 0 || i === 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && (i === 1 || i === 2 || i === 3) || v === 0 && i % 10 !== 4 && i % 10 !== 6 && i % 10 !== 9 || v !== 0 && f % 10 !== 4 && f % 10 !== 6 && f % 10 !== 9 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 ? one : n === 2 ? two : 3 <= n && n <= 6 ? few : 7 <= n && n <= 10 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 || n === 11 ? one : n === 2 || n === 12 ? two : 3 <= n && n <= 10 || 13 <= n && n <= 19 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return v === 0 && i % 10 === 1 ? one : v === 0 && i % 10 === 2 ? two : v === 0 && (i % 100 === 0 || i % 100 === 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80) ? few : v !== 0 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var n = +s;
  return i === 1 && v === 0 ? one : i === 2 && v === 0 ? two : v === 0 && (n < 0 || 10 < n) && n % 10 === 0 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var t = +('' + s).replace(/^[^.]*.?|0+$/g, '');
  return t === 0 && i % 10 === 1 && i % 100 !== 11 || t !== 0 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 ? one : n === 2 ? two : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 0 ? zero : n === 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var n = +s;
  return n === 0 ? zero : (i === 0 || i === 1) && n !== 0 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var f = +(s + '.').split('.')[1];
  var n = +s;
  return n % 10 === 1 && (n % 100 < 11 || 19 < n % 100) ? one : 2 <= n % 10 && n % 10 <= 9 && (n % 100 < 11 || 19 < n % 100) ? few : f !== 0 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  var n = +s;
  return n % 10 === 0 || 11 <= n % 100 && n % 100 <= 19 || v === 2 && 11 <= f % 100 && f % 100 <= 19 ? zero : n % 10 === 1 && n % 100 !== 11 || v === 2 && f % 10 === 1 && f % 100 !== 11 || v !== 2 && f % 10 === 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && i % 10 === 1 && i % 100 !== 11 || f % 10 === 1 && f % 100 !== 11 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var n = +s;
  return i === 1 && v === 0 ? one : v !== 0 || n === 0 || n !== 1 && 1 <= n % 100 && n % 100 <= 19 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 ? one : n === 0 || 2 <= n % 100 && n % 100 <= 10 ? few : 11 <= n % 100 && n % 100 <= 19 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return i === 1 && v === 0 ? one : v === 0 && 2 <= i % 10 && i % 10 <= 4 && (i % 100 < 12 || 14 < i % 100) ? few : v === 0 && i !== 1 && 0 <= i % 10 && i % 10 <= 1 || v === 0 && 5 <= i % 10 && i % 10 <= 9 || v === 0 && 12 <= i % 100 && i % 100 <= 14 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  return 0 <= i && i <= 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return v === 0 && i % 10 === 1 && i % 100 !== 11 ? one : v === 0 && 2 <= i % 10 && i % 10 <= 4 && (i % 100 < 12 || 14 < i % 100) ? few : v === 0 && i % 10 === 0 || v === 0 && 5 <= i % 10 && i % 10 <= 9 || v === 0 && 11 <= i % 100 && i % 100 <= 14 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var n = +s;
  return i === 0 || n === 1 ? one : 2 <= n && n <= 10 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var f = +(s + '.').split('.')[1];
  var n = +s;
  return n === 0 || n === 1 || i === 0 && f === 1 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return v === 0 && i % 100 === 1 ? one : v === 0 && i % 100 === 2 ? two : v === 0 && 3 <= i % 100 && i % 100 <= 4 || v !== 0 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return 0 <= n && n <= 1 || 11 <= n && n <= 99 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 || n === 5 || n === 7 || n === 8 || n === 9 || n === 10 ? one : n === 2 || n === 3 ? two : n === 4 ? few : n === 6 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  return i % 10 === 1 || i % 10 === 2 || i % 10 === 5 || i % 10 === 7 || i % 10 === 8 || i % 100 === 20 || i % 100 === 50 || i % 100 === 70 || i % 100 === 80 ? one : i % 10 === 3 || i % 10 === 4 || i % 1000 === 100 || i % 1000 === 200 || i % 1000 === 300 || i % 1000 === 400 || i % 1000 === 500 || i % 1000 === 600 || i % 1000 === 700 || i % 1000 === 800 || i % 1000 === 900 ? few : i === 0 || i % 10 === 6 || i % 100 === 40 || i % 100 === 60 || i % 100 === 90 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return (n % 10 === 2 || n % 10 === 3) && n % 100 !== 12 && n % 100 !== 13 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 || n === 3 ? one : n === 2 ? two : n === 4 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 0 || n === 7 || n === 8 || n === 9 ? zero : n === 1 ? one : n === 2 ? two : n === 3 || n === 4 ? few : n === 5 || n === 6 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n % 10 === 1 && n % 100 !== 11 ? one : n % 10 === 2 && n % 100 !== 12 ? two : n % 10 === 3 && n % 100 !== 13 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 ? one : n === 2 || n === 3 ? two : n === 4 ? few : n === 6 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 || n === 5 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 11 || n === 8 || n === 80 || n === 800 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  return i === 1 ? one : i === 0 || 2 <= i % 100 && i % 100 <= 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n % 10 === 6 || n % 10 === 9 || n % 10 === 0 && n !== 0 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var i = Math.floor(Math.abs(+s));
  return i % 10 === 1 && i % 100 !== 11 ? one : i % 10 === 2 && i % 100 !== 12 ? two : (i % 10 === 7 || i % 10 === 8) && i % 100 !== 17 && i % 100 !== 18 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 ? one : n === 2 || n === 3 ? two : n === 4 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return 1 <= n && n <= 4 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 || n === 5 || 7 <= n && n <= 9 ? one : n === 2 || n === 3 ? two : n === 4 ? few : n === 6 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n === 1 ? one : n % 10 === 4 && n % 100 !== 14 ? many : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return (n % 10 === 1 || n % 10 === 2) && n % 100 !== 11 && n % 100 !== 12 ? one : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n % 10 === 6 || n % 10 === 9 || n === 10 ? few : other;
}, function (s
/*: string | number */
)
/*: Rule */
{
  var n = +s;
  return n % 10 === 3 && n % 100 !== 13 ? few : other;
}];
var plurals = {
  af: {
    cardinal: f[0]
  },
  ak: {
    cardinal: f[1]
  },
  am: {
    cardinal: f[2]
  },
  ar: {
    cardinal: f[3]
  },
  ars: {
    cardinal: f[3]
  },
  as: {
    cardinal: f[2],
    ordinal: f[34]
  },
  asa: {
    cardinal: f[0]
  },
  ast: {
    cardinal: f[4]
  },
  az: {
    cardinal: f[0],
    ordinal: f[35]
  },
  be: {
    cardinal: f[5],
    ordinal: f[36]
  },
  bem: {
    cardinal: f[0]
  },
  bez: {
    cardinal: f[0]
  },
  bg: {
    cardinal: f[0]
  },
  bh: {
    cardinal: f[1]
  },
  bn: {
    cardinal: f[2],
    ordinal: f[34]
  },
  br: {
    cardinal: f[6]
  },
  brx: {
    cardinal: f[0]
  },
  bs: {
    cardinal: f[7]
  },
  ca: {
    cardinal: f[4],
    ordinal: f[37]
  },
  ce: {
    cardinal: f[0]
  },
  cgg: {
    cardinal: f[0]
  },
  chr: {
    cardinal: f[0]
  },
  ckb: {
    cardinal: f[0]
  },
  cs: {
    cardinal: f[8]
  },
  cy: {
    cardinal: f[9],
    ordinal: f[38]
  },
  da: {
    cardinal: f[10]
  },
  de: {
    cardinal: f[4]
  },
  dsb: {
    cardinal: f[11]
  },
  dv: {
    cardinal: f[0]
  },
  ee: {
    cardinal: f[0]
  },
  el: {
    cardinal: f[0]
  },
  en: {
    cardinal: f[4],
    ordinal: f[39]
  },
  eo: {
    cardinal: f[0]
  },
  es: {
    cardinal: f[0]
  },
  et: {
    cardinal: f[4]
  },
  eu: {
    cardinal: f[0]
  },
  fa: {
    cardinal: f[2]
  },
  ff: {
    cardinal: f[12]
  },
  fi: {
    cardinal: f[4]
  },
  fil: {
    cardinal: f[13],
    ordinal: f[0]
  },
  fo: {
    cardinal: f[0]
  },
  fr: {
    cardinal: f[12],
    ordinal: f[0]
  },
  fur: {
    cardinal: f[0]
  },
  fy: {
    cardinal: f[4]
  },
  ga: {
    cardinal: f[14],
    ordinal: f[0]
  },
  gd: {
    cardinal: f[15]
  },
  gl: {
    cardinal: f[4]
  },
  gsw: {
    cardinal: f[0]
  },
  gu: {
    cardinal: f[2],
    ordinal: f[40]
  },
  guw: {
    cardinal: f[1]
  },
  gv: {
    cardinal: f[16]
  },
  ha: {
    cardinal: f[0]
  },
  haw: {
    cardinal: f[0]
  },
  he: {
    cardinal: f[17]
  },
  hi: {
    cardinal: f[2],
    ordinal: f[40]
  },
  hr: {
    cardinal: f[7]
  },
  hsb: {
    cardinal: f[11]
  },
  hu: {
    cardinal: f[0],
    ordinal: f[41]
  },
  hy: {
    cardinal: f[12],
    ordinal: f[0]
  },
  io: {
    cardinal: f[4]
  },
  is: {
    cardinal: f[18]
  },
  it: {
    cardinal: f[4],
    ordinal: f[42]
  },
  iu: {
    cardinal: f[19]
  },
  iw: {
    cardinal: f[17]
  },
  jgo: {
    cardinal: f[0]
  },
  ji: {
    cardinal: f[4]
  },
  jmc: {
    cardinal: f[0]
  },
  ka: {
    cardinal: f[0],
    ordinal: f[43]
  },
  kab: {
    cardinal: f[12]
  },
  kaj: {
    cardinal: f[0]
  },
  kcg: {
    cardinal: f[0]
  },
  kk: {
    cardinal: f[0],
    ordinal: f[44]
  },
  kkj: {
    cardinal: f[0]
  },
  kl: {
    cardinal: f[0]
  },
  kn: {
    cardinal: f[2]
  },
  ks: {
    cardinal: f[0]
  },
  ksb: {
    cardinal: f[0]
  },
  ksh: {
    cardinal: f[20]
  },
  ku: {
    cardinal: f[0]
  },
  kw: {
    cardinal: f[19]
  },
  ky: {
    cardinal: f[0]
  },
  lag: {
    cardinal: f[21]
  },
  lb: {
    cardinal: f[0]
  },
  lg: {
    cardinal: f[0]
  },
  ln: {
    cardinal: f[1]
  },
  lt: {
    cardinal: f[22]
  },
  lv: {
    cardinal: f[23]
  },
  mas: {
    cardinal: f[0]
  },
  mg: {
    cardinal: f[1]
  },
  mgo: {
    cardinal: f[0]
  },
  mk: {
    cardinal: f[24],
    ordinal: f[45]
  },
  ml: {
    cardinal: f[0]
  },
  mn: {
    cardinal: f[0]
  },
  mo: {
    cardinal: f[25],
    ordinal: f[0]
  },
  mr: {
    cardinal: f[2],
    ordinal: f[46]
  },
  mt: {
    cardinal: f[26]
  },
  nah: {
    cardinal: f[0]
  },
  naq: {
    cardinal: f[19]
  },
  nb: {
    cardinal: f[0]
  },
  nd: {
    cardinal: f[0]
  },
  ne: {
    cardinal: f[0],
    ordinal: f[47]
  },
  nl: {
    cardinal: f[4]
  },
  nn: {
    cardinal: f[0]
  },
  nnh: {
    cardinal: f[0]
  },
  no: {
    cardinal: f[0]
  },
  nr: {
    cardinal: f[0]
  },
  nso: {
    cardinal: f[1]
  },
  ny: {
    cardinal: f[0]
  },
  nyn: {
    cardinal: f[0]
  },
  om: {
    cardinal: f[0]
  },
  or: {
    cardinal: f[0],
    ordinal: f[48]
  },
  os: {
    cardinal: f[0]
  },
  pa: {
    cardinal: f[1]
  },
  pap: {
    cardinal: f[0]
  },
  pl: {
    cardinal: f[27]
  },
  prg: {
    cardinal: f[23]
  },
  ps: {
    cardinal: f[0]
  },
  pt: {
    cardinal: f[28]
  },
  'pt-PT': {
    cardinal: f[4]
  },
  rm: {
    cardinal: f[0]
  },
  ro: {
    cardinal: f[25],
    ordinal: f[0]
  },
  rof: {
    cardinal: f[0]
  },
  ru: {
    cardinal: f[29]
  },
  rwk: {
    cardinal: f[0]
  },
  saq: {
    cardinal: f[0]
  },
  scn: {
    cardinal: f[4],
    ordinal: f[42]
  },
  sd: {
    cardinal: f[0]
  },
  sdh: {
    cardinal: f[0]
  },
  se: {
    cardinal: f[19]
  },
  seh: {
    cardinal: f[0]
  },
  sh: {
    cardinal: f[7]
  },
  shi: {
    cardinal: f[30]
  },
  si: {
    cardinal: f[31]
  },
  sk: {
    cardinal: f[8]
  },
  sl: {
    cardinal: f[32]
  },
  sma: {
    cardinal: f[19]
  },
  smi: {
    cardinal: f[19]
  },
  smj: {
    cardinal: f[19]
  },
  smn: {
    cardinal: f[19]
  },
  sms: {
    cardinal: f[19]
  },
  sn: {
    cardinal: f[0]
  },
  so: {
    cardinal: f[0]
  },
  sq: {
    cardinal: f[0],
    ordinal: f[49]
  },
  sr: {
    cardinal: f[7]
  },
  ss: {
    cardinal: f[0]
  },
  ssy: {
    cardinal: f[0]
  },
  st: {
    cardinal: f[0]
  },
  sv: {
    cardinal: f[4],
    ordinal: f[50]
  },
  sw: {
    cardinal: f[4]
  },
  syr: {
    cardinal: f[0]
  },
  ta: {
    cardinal: f[0]
  },
  te: {
    cardinal: f[0]
  },
  teo: {
    cardinal: f[0]
  },
  ti: {
    cardinal: f[1]
  },
  tig: {
    cardinal: f[0]
  },
  tk: {
    cardinal: f[0],
    ordinal: f[51]
  },
  tl: {
    cardinal: f[13],
    ordinal: f[0]
  },
  tn: {
    cardinal: f[0]
  },
  tr: {
    cardinal: f[0]
  },
  ts: {
    cardinal: f[0]
  },
  tzm: {
    cardinal: f[33]
  },
  ug: {
    cardinal: f[0]
  },
  uk: {
    cardinal: f[29],
    ordinal: f[52]
  },
  ur: {
    cardinal: f[4]
  },
  uz: {
    cardinal: f[0]
  },
  ve: {
    cardinal: f[0]
  },
  vo: {
    cardinal: f[0]
  },
  vun: {
    cardinal: f[0]
  },
  wa: {
    cardinal: f[1]
  },
  wae: {
    cardinal: f[0]
  },
  xh: {
    cardinal: f[0]
  },
  xog: {
    cardinal: f[0]
  },
  yi: {
    cardinal: f[4]
  },
  zu: {
    cardinal: f[2]
  },
  lo: {
    ordinal: f[0]
  },
  ms: {
    ordinal: f[0]
  },
  vi: {
    ordinal: f[0]
  }
};

var formatMessageInterpret = createCommonjsModule(function (module, exports) {
  /*::
  import type {
    AST,
    SubMessages
  } from '../format-message-parse'
  type Locale = string
  type Locales = Locale | Locale[]
  type Placeholder = any[] // https://github.com/facebook/flow/issues/4050
  export type Type = (Placeholder, Locales) => (any, ?Object) => any
  export type Types = { [string]: Type }
  */

  exports = module.exports = function interpret(ast
  /*: AST */
  , locale
  /*:: ?: Locales */
  , types
  /*:: ?: Types */
  )
  /*: (args?: Object) => string */
  {
    return interpretAST(ast, null, locale || 'en', types || {}, true);
  };

  exports.toParts = function toParts(ast
  /*: AST */
  , locale
  /*:: ?: Locales */
  , types
  /*:: ?: Types */
  )
  /*: (args?: Object) => any[] */
  {
    return interpretAST(ast, null, locale || 'en', types || {}, false);
  };

  function interpretAST(elements
  /*: any[] */
  , parent
  /*: ?Placeholder */
  , locale
  /*: Locales */
  , types
  /*: Types */
  , join
  /*: boolean */
  )
  /*: Function */
  {
    var parts = elements.map(function (element) {
      return interpretElement(element, parent, locale, types, join);
    });

    if (!join) {
      return function format(args) {
        return parts.reduce(function (parts, part) {
          return parts.concat(part(args));
        }, []);
      };
    }

    if (parts.length === 1) return parts[0];
    return function format(args) {
      var message = '';

      for (var e = 0; e < parts.length; ++e) {
        message += parts[e](args);
      }

      return message;
    };
  }

  function interpretElement(element
  /*: Placeholder */
  , parent
  /*: ?Placeholder */
  , locale
  /*: Locales */
  , types
  /*: Types */
  , join
  /*: boolean */
  )
  /*: Function */
  {
    if (typeof element === 'string') {
      var value
      /*: string */
      = element;
      return function format() {
        return value;
      };
    }

    var id = element[0];
    var type = element[1];

    if (parent && element[0] === '#') {
      id = parent[0];
      var offset = parent[2];
      var formatter = (types.number || defaults.number)([id, 'number'], locale);
      return function format(args) {
        return formatter(getArg(id, args) - offset, args);
      };
    } // pre-process children


    var children;

    if (type === 'plural' || type === 'selectordinal') {
      children = {};
      Object.keys(element[3]).forEach(function (key) {
        children[key] = interpretAST(element[3][key], element, locale, types, join);
      });
      element = [element[0], element[1], element[2], children];
    } else if (element[2] && _typeof(element[2]) === 'object') {
      children = {};
      Object.keys(element[2]).forEach(function (key) {
        children[key] = interpretAST(element[2][key], element, locale, types, join);
      });
      element = [element[0], element[1], children];
    }

    var getFrmt = type && (types[type] || defaults[type]);

    if (getFrmt) {
      var frmt = getFrmt(element, locale);
      return function format(args) {
        return frmt(getArg(id, args), args);
      };
    }

    return join ? function format(args) {
      return String(getArg(id, args));
    } : function format(args) {
      return getArg(id, args);
    };
  }

  function getArg(id
  /*: string */
  , args
  /*: ?Object */
  )
  /*: any */
  {
    if (args && id in args) return args[id];
    var parts = id.split('.');
    var a = args;

    for (var i = 0, ii = parts.length; a && i < ii; ++i) {
      a = a[parts[i]];
    }

    return a;
  }

  function interpretNumber(element
  /*: Placeholder */
  , locales
  /*: Locales */
  ) {
    var style = element[2];
    var options = formatMessageFormats.number[style] || formatMessageFormats.parseNumberPattern(style) || formatMessageFormats.number.default;
    return new Intl.NumberFormat(locales, options).format;
  }

  function interpretDuration(element
  /*: Placeholder */
  , locales
  /*: Locales */
  ) {
    var style = element[2];
    var options = formatMessageFormats.duration[style] || formatMessageFormats.duration.default;
    var fs = new Intl.NumberFormat(locales, options.seconds).format;
    var fm = new Intl.NumberFormat(locales, options.minutes).format;
    var fh = new Intl.NumberFormat(locales, options.hours).format;
    var sep = /^fi$|^fi-|^da/.test(String(locales)) ? '.' : ':';
    return function (s, args) {
      s = +s;
      if (!isFinite(s)) return fs(s);
      var h = ~~(s / 60 / 60); // ~~ acts much like Math.trunc

      var m = ~~(s / 60 % 60);
      var dur = (h ? fh(Math.abs(h)) + sep : '') + fm(Math.abs(m)) + sep + fs(Math.abs(s % 60));
      return s < 0 ? fh(-1).replace(fh(1), dur) : dur;
    };
  }

  function interpretDateTime(element
  /*: Placeholder */
  , locales
  /*: Locales */
  ) {
    var type = element[1];
    var style = element[2];
    var options = formatMessageFormats[type][style] || formatMessageFormats.parseDatePattern(style) || formatMessageFormats[type].default;
    return new Intl.DateTimeFormat(locales, options).format;
  }

  function interpretPlural(element
  /*: Placeholder */
  , locales
  /*: Locales */
  ) {
    var type = element[1];
    var pluralType = type === 'selectordinal' ? 'ordinal' : 'cardinal';
    var offset = element[2];
    var children = element[3];
    var pluralRules;

    if (Intl.PluralRules && Intl.PluralRules.supportedLocalesOf(locales).length > 0) {
      pluralRules = new Intl.PluralRules(locales, {
        type: pluralType
      });
    } else {
      var locale = lookupClosestLocale(locales, plurals);
      var select = locale && plurals[locale][pluralType] || returnOther;
      pluralRules = {
        select: select
      };
    }

    return function (value, args) {
      var clause = children['=' + +value] || children[pluralRules.select(value - offset)] || children.other;
      return clause(args);
    };
  }

  function returnOther()
  /*:: n:number */
  {
    return 'other';
  }

  function interpretSelect(element
  /*: Placeholder */
  , locales
  /*: Locales */
  ) {
    var children = element[2];
    return function (value, args) {
      var clause = children[value] || children.other;
      return clause(args);
    };
  }

  var defaults
  /*: Types */
  = {
    number: interpretNumber,
    ordinal: interpretNumber,
    // TODO: support rbnf
    spellout: interpretNumber,
    // TODO: support rbnf
    duration: interpretDuration,
    date: interpretDateTime,
    time: interpretDateTime,
    plural: interpretPlural,
    selectordinal: interpretPlural,
    select: interpretSelect
  };
  exports.types = defaults;
});

// @flow
// "lookup" algorithm http://tools.ietf.org/html/rfc4647#section-3.4
// assumes normalized language tags, and matches in a case sensitive manner
var lookupClosestLocale$1 = function lookupClosestLocale(locale
/*: string | string[] | void */
, available
/*: { [string]: any } */
)
/*: ?string */
{
  if (typeof locale === 'string' && available[locale]) return locale;
  var locales = [].concat(locale || []);

  for (var l = 0, ll = locales.length; l < ll; ++l) {
    var current = locales[l].split('-');

    while (current.length) {
      var candidate = current.join('-');
      if (available[candidate]) return candidate;
      current.pop();
    }
  }
};

// @flow
var LONG$1 = 'long';
var SHORT$1 = 'short';
var NARROW$1 = 'narrow';
var NUMERIC$1 = 'numeric';
var TWODIGIT$1 = '2-digit';
/**
 * formatting information
 **/

var formatMessageFormats$1 = {
  number: {
    decimal: {
      style: 'decimal'
    },
    integer: {
      style: 'decimal',
      maximumFractionDigits: 0
    },
    currency: {
      style: 'currency',
      currency: 'USD'
    },
    percent: {
      style: 'percent'
    },
    default: {
      style: 'decimal'
    }
  },
  date: {
    short: {
      month: NUMERIC$1,
      day: NUMERIC$1,
      year: TWODIGIT$1
    },
    medium: {
      month: SHORT$1,
      day: NUMERIC$1,
      year: NUMERIC$1
    },
    long: {
      month: LONG$1,
      day: NUMERIC$1,
      year: NUMERIC$1
    },
    full: {
      month: LONG$1,
      day: NUMERIC$1,
      year: NUMERIC$1,
      weekday: LONG$1
    },
    default: {
      month: SHORT$1,
      day: NUMERIC$1,
      year: NUMERIC$1
    }
  },
  time: {
    short: {
      hour: NUMERIC$1,
      minute: NUMERIC$1
    },
    medium: {
      hour: NUMERIC$1,
      minute: NUMERIC$1,
      second: NUMERIC$1
    },
    long: {
      hour: NUMERIC$1,
      minute: NUMERIC$1,
      second: NUMERIC$1,
      timeZoneName: SHORT$1
    },
    full: {
      hour: NUMERIC$1,
      minute: NUMERIC$1,
      second: NUMERIC$1,
      timeZoneName: SHORT$1
    },
    default: {
      hour: NUMERIC$1,
      minute: NUMERIC$1,
      second: NUMERIC$1
    }
  },
  duration: {
    default: {
      hours: {
        minimumIntegerDigits: 1,
        maximumFractionDigits: 0
      },
      minutes: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0
      },
      seconds: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 3
      }
    }
  },
  parseNumberPattern: function parseNumberPattern(pattern
  /*: ?string */
  ) {
    if (!pattern) return;
    var options = {};
    var currency = pattern.match(/\b[A-Z]{3}\b/i);
    var syms = pattern.replace(/[^¤]/g, '').length;
    if (!syms && currency) syms = 1;

    if (syms) {
      options.style = 'currency';
      options.currencyDisplay = syms === 1 ? 'symbol' : syms === 2 ? 'code' : 'name';
      options.currency = currency ? currency[0].toUpperCase() : 'USD';
    } else if (pattern.indexOf('%') >= 0) {
      options.style = 'percent';
    }

    if (!/[@#0]/.test(pattern)) return options.style ? options : undefined;
    options.useGrouping = pattern.indexOf(',') >= 0;

    if (/E\+?[@#0]+/i.test(pattern) || pattern.indexOf('@') >= 0) {
      var size = pattern.replace(/E\+?[@#0]+|[^@#0]/gi, '');
      options.minimumSignificantDigits = Math.min(Math.max(size.replace(/[^@0]/g, '').length, 1), 21);
      options.maximumSignificantDigits = Math.min(Math.max(size.length, 1), 21);
    } else {
      var parts = pattern.replace(/[^#0.]/g, '').split('.');
      var integer = parts[0];
      var n = integer.length - 1;

      while (integer[n] === '0') {
        --n;
      }

      options.minimumIntegerDigits = Math.min(Math.max(integer.length - 1 - n, 1), 21);
      var fraction = parts[1] || '';
      n = 0;

      while (fraction[n] === '0') {
        ++n;
      }

      options.minimumFractionDigits = Math.min(Math.max(n, 0), 20);

      while (fraction[n] === '#') {
        ++n;
      }

      options.maximumFractionDigits = Math.min(Math.max(n, 0), 20);
    }

    return options;
  },
  parseDatePattern: function parseDatePattern(pattern
  /*: ?string */
  ) {
    if (!pattern) return;
    var options = {};

    for (var i = 0; i < pattern.length;) {
      var current = pattern[i];
      var n = 1;

      while (pattern[++i] === current) {
        ++n;
      }

      switch (current) {
        case 'G':
          options.era = n === 5 ? NARROW$1 : n === 4 ? LONG$1 : SHORT$1;
          break;

        case 'y':
        case 'Y':
          options.year = n === 2 ? TWODIGIT$1 : NUMERIC$1;
          break;

        case 'M':
        case 'L':
          n = Math.min(Math.max(n - 1, 0), 4);
          options.month = [NUMERIC$1, TWODIGIT$1, SHORT$1, LONG$1, NARROW$1][n];
          break;

        case 'E':
        case 'e':
        case 'c':
          options.weekday = n === 5 ? NARROW$1 : n === 4 ? LONG$1 : SHORT$1;
          break;

        case 'd':
        case 'D':
          options.day = n === 2 ? TWODIGIT$1 : NUMERIC$1;
          break;

        case 'h':
        case 'K':
          options.hour12 = true;
          options.hour = n === 2 ? TWODIGIT$1 : NUMERIC$1;
          break;

        case 'H':
        case 'k':
          options.hour12 = false;
          options.hour = n === 2 ? TWODIGIT$1 : NUMERIC$1;
          break;

        case 'm':
          options.minute = n === 2 ? TWODIGIT$1 : NUMERIC$1;
          break;

        case 's':
        case 'S':
          options.second = n === 2 ? TWODIGIT$1 : NUMERIC$1;
          break;

        case 'z':
        case 'Z':
        case 'v':
        case 'V':
          options.timeZoneName = n === 1 ? SHORT$1 : LONG$1;
          break;
      }
    }

    return Object.keys(options).length ? options : undefined;
  }
};

var formatMessage$1 = createCommonjsModule(function (module, exports) {
  /*::
  import type { Types } from 'format-message-interpret'
  type Locale = string
  type Locales = Locale | Locale[]
  type Message = string | {|
    id?: string,
    default: string,
    description?: string
  |}
  type Translations = { [string]: ?{ [string]: string | Translation } }
  type Translation = {
    message: string,
    format?: (args?: Object) => string,
    toParts?: (args?: Object) => any[],
  }
  type Replacement = ?string | (string, string, locales?: Locales) => ?string
  type GenerateId = (string) => string
  type MissingTranslation = 'ignore' | 'warning' | 'error'
  type FormatObject = { [string]: * }
  type Options = {
    locale?: Locales,
    translations?: ?Translations,
    generateId?: GenerateId,
    missingReplacement?: Replacement,
    missingTranslation?: MissingTranslation,
    formats?: {
      number?: FormatObject,
      date?: FormatObject,
      time?: FormatObject
    },
    types?: Types
  }
  type Setup = {|
    locale: Locales,
    translations: Translations,
    generateId: GenerateId,
    missingReplacement: Replacement,
    missingTranslation: MissingTranslation,
    formats: {
      number: FormatObject,
      date: FormatObject,
      time: FormatObject
    },
    types: Types
  |}
  type FormatMessage = {
    (msg: Message, args?: Object, locales?: Locales): string,
    rich (msg: Message, args?: Object, locales?: Locales): any[],
    setup (opt?: Options): Setup,
    number (value: number, style?: string, locales?: Locales): string,
    date (value: number | Date, style?: string, locales?: Locales): string,
    time (value: number | Date, style?: string, locales?: Locales): string,
    select (value: any, options: Object): any,
    custom (placeholder: any[], locales: Locales, value: any, args: Object): any,
    plural (value: number, offset: any, options: any, locale: any): any,
    selectordinal (value: number, offset: any, options: any, locale: any): any,
    namespace (): FormatMessage
  }
  */

  function assign
  /*:: <T: Object> */
  (target
  /*: T */
  , source
  /*: Object */
  ) {
    Object.keys(source).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }

  function namespace()
  /*: FormatMessage */
  {
    var formats = assign({}, formatMessageFormats$1);
    var currentLocales
    /*: Locales */
    = 'en';
    var translations
    /*: Translations */
    = {};

    var generateId
    /*: GenerateId */
    = function generateId(pattern) {
      return pattern;
    };

    var missingReplacement
    /*: Replacement */
    = null;
    var missingTranslation
    /*: MissingTranslation */
    = 'warning';
    var types
    /*: Types */
    = {};

    function formatMessage(msg
    /*: Message */
    , args
    /*:: ?: Object */
    , locales
    /*:: ?: Locales */
    ) {
      var pattern = typeof msg === 'string' ? msg : msg.default;
      var id = _typeof(msg) === 'object' && msg.id || generateId(pattern);
      var translated = translate(pattern, id, locales || currentLocales);
      var format = translated.format || (translated.format = formatMessageInterpret(formatMessageParse(translated.message), locales || currentLocales, types));
      return format(args);
    }

    formatMessage.rich = function rich(msg
    /*: Message */
    , args
    /*:: ?: Object */
    , locales
    /*:: ?: Locales */
    ) {
      var pattern = typeof msg === 'string' ? msg : msg.default;
      var id = _typeof(msg) === 'object' && msg.id || generateId(pattern);
      var translated = translate(pattern, id, locales || currentLocales);
      var format = translated.toParts || (translated.toParts = formatMessageInterpret.toParts(formatMessageParse(translated.message, {
        tagsType: tagsType
      }), locales || currentLocales, types));
      return format(args);
    };

    var tagsType = '<>';

    function richType(node
    /*: any[] */
    , locales
    /*: Locales */
    ) {
      var style = node[2];
      return function (fn, args) {
        var props = _typeof(style) === 'object' ? mapObject(style, args) : style;
        return typeof fn === 'function' ? fn(props) : fn;
      };
    }

    types[tagsType] = richType;

    function mapObject(object
    /* { [string]: (args?: Object) => any } */
    , args
    /*: ?Object */
    ) {
      return Object.keys(object).reduce(function (mapped, key) {
        mapped[key] = object[key](args);
        return mapped;
      }, {});
    }

    function translate(pattern
    /*: string */
    , id
    /*: string */
    , locales
    /*: Locales */
    )
    /*: Translation */
    {
      var locale = lookupClosestLocale$1(locales, translations) || 'en';
      var messages = translations[locale] || (translations[locale] = {});
      var translated = messages[id];

      if (typeof translated === 'string') {
        translated = messages[id] = {
          message: translated
        };
      }

      if (!translated) {
        var message = 'Translation for "' + id + '" in "' + locale + '" is missing';

        if (missingTranslation === 'warning') {
          /* istanbul ignore else */
          if (typeof console !== 'undefined') console.warn(message);
        } else if (missingTranslation !== 'ignore') {
          // 'error'
          throw new Error(message);
        }

        var replacement = typeof missingReplacement === 'function' ? missingReplacement(pattern, id, locale) || pattern : missingReplacement || pattern;
        translated = messages[id] = {
          message: replacement
        };
      }

      return translated;
    }

    formatMessage.setup = function setup(opt
    /*:: ?: Options */
    ) {
      opt = opt || {};
      if (opt.locale) currentLocales = opt.locale;
      if ('translations' in opt) translations = opt.translations || {};
      if (opt.generateId) generateId = opt.generateId;
      if ('missingReplacement' in opt) missingReplacement = opt.missingReplacement;
      if (opt.missingTranslation) missingTranslation = opt.missingTranslation;

      if (opt.formats) {
        if (opt.formats.number) assign(formats.number, opt.formats.number);
        if (opt.formats.date) assign(formats.date, opt.formats.date);
        if (opt.formats.time) assign(formats.time, opt.formats.time);
      }

      if (opt.types) {
        types = opt.types;
        types[tagsType] = richType;
      }

      return {
        locale: currentLocales,
        translations: translations,
        generateId: generateId,
        missingReplacement: missingReplacement,
        missingTranslation: missingTranslation,
        formats: formats,
        types: types
      };
    };

    formatMessage.number = function (value
    /*: number */
    , style
    /*:: ?: string */
    , locales
    /*:: ?: Locales */
    ) {
      var options = style && formats.number[style] || formats.parseNumberPattern(style) || formats.number.default;
      return new Intl.NumberFormat(locales || currentLocales, options).format(value);
    };

    formatMessage.date = function (value
    /*:: ?: number | Date */
    , style
    /*:: ?: string */
    , locales
    /*:: ?: Locales */
    ) {
      var options = style && formats.date[style] || formats.parseDatePattern(style) || formats.date.default;
      return new Intl.DateTimeFormat(locales || currentLocales, options).format(value);
    };

    formatMessage.time = function (value
    /*:: ?: number | Date */
    , style
    /*:: ?: string */
    , locales
    /*:: ?: Locales */
    ) {
      var options = style && formats.time[style] || formats.parseDatePattern(style) || formats.time.default;
      return new Intl.DateTimeFormat(locales || currentLocales, options).format(value);
    };

    formatMessage.select = function (value
    /*: any */
    , options
    /*: Object */
    ) {
      return options[value] || options.other;
    };

    formatMessage.custom = function (placeholder
    /*: any[] */
    , locales
    /*: Locales */
    , value
    /*: any */
    , args
    /*: Object */
    ) {
      if (!(placeholder[1] in types)) return value;
      return types[placeholder[1]](placeholder, locales)(value, args);
    };

    formatMessage.plural = plural.bind(null, 'cardinal');
    formatMessage.selectordinal = plural.bind(null, 'ordinal');

    function plural(pluralType
    /*: 'cardinal' | 'ordinal' */
    , value
    /*: number */
    , offset
    /*: any */
    , options
    /*: any */
    , locale
    /*: any */
    ) {
      if (_typeof(offset) === 'object' && _typeof(options) !== 'object') {
        // offset is optional
        locale = options;
        options = offset;
        offset = 0;
      }

      var closest = lookupClosestLocale$1(locale || currentLocales, plurals);
      var plural = closest && plurals[closest][pluralType] || returnOther;
      return options['=' + +value] || options[plural(value - offset)] || options.other;
    }

    function returnOther()
    /*:: n:number */
    {
      return 'other';
    }

    formatMessage.namespace = namespace;
    return formatMessage;
  }

  module.exports = exports = namespace();
});

/**
 * Formatter which is used for translating.
 * When it was loaded as a module, 'formatMessage' will be replaced which is used in the runtime.
 * @type {Function}
 */

var formatMessage$2 = formatMessage$1;

var timeoutPromise = function timeoutPromise(timeout) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, timeout);
  });
};

var EXTENSION_ID = 'microbitMore';
/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */

var extensionURL = 'https://yokobond.github.io/scratch-microbit-more/dist/microbitMore.mjs';
/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

var blockIconURI = 'data:image/png;base64,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';
/**
 * Enum for micro:bit BLE command protocol.
 * https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
 * @readonly
 * @enum {number}
 */

var BLECommand = {
  CMD_PIN_CONFIG: 0x80,
  CMD_DISPLAY_TEXT: 0x81,
  CMD_DISPLAY_LED: 0x82,
  CMD_PROTOCOL: 0x90,
  CMD_PIN: 0x91,
  CMD_SHARED_DATA: 0x92,
  CMD_LIGHT_SENSING: 0x93
};
var MBitMorePinCommand = {
  SET_OUTPUT: 0x01,
  SET_PWM: 0x02,
  SET_SERVO: 0x03,
  SET_PULL: 0x04,
  SET_EVENT: 0x05,
  SET_TOUCH: 0x06
};
var MBitMorePinMode = {
  PullNone: 0,
  PullUp: 1,
  PullDown: 2
};
/**
 * Enum for micro:bit BLE command protocol v0.
 * https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
 * @readonly
 * @enum {number}
 */

var BLECommandV0 = {
  CMD_PIN_CONFIG: 0x80,
  CMD_DISPLAY_TEXT: 0x81,
  CMD_DISPLAY_LED: 0x82,
  CMD_PIN_INPUT: 0x90,
  CMD_PIN_OUTPUT: 0x91,
  CMD_PIN_PWM: 0x92,
  CMD_PIN_SERVO: 0x93,
  CMD_SHARED_DATA_SET: 0x94,
  CMD_PROTOCOL_SET: 0xA0
};
var MBitMoreDataFormat = {
  MIX_01: 0x01,
  MIX_02: 0x02,
  MIX_03: 0x03,
  SHARED_DATA: 0x11,
  EVENT: 0x12
};
/**
 * Enum for event type in the micro:bit runtime.
 */

var MicroBitEventType = {
  MICROBIT_PIN_EVENT_NONE: 0,
  MICROBIT_PIN_EVENT_ON_EDGE: 1,
  MICROBIT_PIN_EVENT_ON_PULSE: 2,
  MICROBIT_PIN_EVENT_ON_TOUCH: 3
};
/**
 * Enum for event value in the micro:bit runtime.
 */

var MicroBitEvent = {
  MICROBIT_PIN_EVT_RISE: 2,
  MICROBIT_PIN_EVT_FALL: 3,
  MICROBIT_PIN_EVT_PULSE_HI: 4,
  MICROBIT_PIN_EVT_PULSE_LO: 5
};
/**
 * A time interval to wait (in milliseconds) before reporting to the BLE socket
 * that data has stopped coming from the peripheral.
 */

var BLETimeout = 4500;
/**
 * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
 * @type {number}
 */

var BLESendInterval = 100;
/**
 * A string to report to the BLE socket when the micro:bit has stopped receiving data.
 * @type {string}
 */

var BLEDataStoppedError = 'micro:bit extension stopped receiving data';
/**
 * Enum for micro:bit protocol.
 * https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
 * @readonly
 * @enum {string}
 */

var MICROBIT_SERVICE = {
  ID: 0xf005,
  RX: '5261da01-fa7e-42ab-850b-7c80220097cc',
  TX: '5261da02-fa7e-42ab-850b-7c80220097cc'
};
var MBITMORE_SERVICE = {
  ID: 'a62d574e-1b34-4092-8dee-4151f63b2865',
  EVENT: 'a62d0001-1b34-4092-8dee-4151f63b2865',
  IO: 'a62d0002-1b34-4092-8dee-4151f63b2865',
  ANSLOG_IN: 'a62d0003-1b34-4092-8dee-4151f63b2865',
  SENSORS: 'a62d0004-1b34-4092-8dee-4151f63b2865',
  SHARED_DATA: 'a62d0010-1b34-4092-8dee-4151f63b2865'
};
/**
 * Enum for pin mode menu options.
 * @readonly
 * @enum {string}
 */

var PinMode = {
  PULL_NONE: 'pullNone',
  PULL_UP: 'pullUp',
  PULL_DOWN: 'pullDown'
};
/**
 * The unit-value of the gravitational acceleration from Micro:bit.
 * @type {number}
 */

var G$1 = 1024;
/**
 * Manage communication with a MicroBit peripheral over a Scrath Link client socket.
 */

var MbitMore = /*#__PURE__*/function () {
  /**
   * Construct a MicroBit communication object.
   * @param {Runtime} runtime - the Scratch 3.0 runtime
   * @param {string} extensionId - the id of the extension
   */
  function MbitMore(runtime, extensionId) {
    var _this = this;

    _classCallCheck(this, MbitMore);

    /**
     * The Scratch 3.0 runtime used to trigger the green flag button.
     * @type {Runtime}
     * @private
     */
    this._runtime = runtime;
    /**
     * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
     * @type {BLE}
     * @private
     */

    this._ble = null;

    this._runtime.registerPeripheralExtension(extensionId, this);
    /**
     * The id of the extension this peripheral belongs to.
     */


    this._extensionId = extensionId;
    /**
     * The most recently received value for each sensor.
     * @type {Object.<string, number>}
     * @private
     */

    this._sensors = {
      tiltX: 0,
      tiltY: 0,
      buttonA: 0,
      buttonB: 0,
      touchPins: [0, 0, 0],
      gestureState: 0,
      ledMatrixState: new Uint8Array(5),
      lightLevel: 0,
      temperature: 0,
      compassHeading: 0,
      accelerationX: 0,
      accelerationY: 0,
      accelerationZ: 0,
      accelerationStrength: 0,
      magneticForceX: 0,
      magneticForceY: 0,
      magneticForceZ: 0,
      magneticStrength: 0,
      analogValue: {},
      powerVoltage: 0,
      digitalValue: {},
      sharedData: [0, 0, 0, 0]
    };
    /**
     * The most recently received events for each pin.
     * @type {Object.<number>} - Store of pins which has events.
     * @private
     */

    this._events = {};
    this.analogIn = [0, 1, 2];
    this.analogIn.forEach(function (pinIndex) {
      _this._sensors.analogValue[pinIndex] = 0;
    });
    this.gpio = [0, 1, 2, 8, 13, 14, 15, 16];
    this.gpio.forEach(function (pinIndex) {
      _this._sensors.digitalValue[pinIndex] = 0;
    });
    this.sharedDataLength = this._sensors.sharedData.length;
    /**
     * The most recently received value for each gesture.
     * @type {Object.<string, Object>}
     * @private
     */

    this._gestures = {
      moving: false,
      move: {
        active: false,
        timeout: false
      },
      shake: {
        active: false,
        timeout: false
      },
      jump: {
        active: false,
        timeout: false
      }
    };
    /**
     * Interval ID for data reading timeout.
     * @type {number}
     * @private
     */

    this._timeoutID = null;
    /**
     * A flag that is true while we are busy sending data to the BLE socket.
     * @type {boolean}
     * @private
     */

    this._busy = false;
    /**
     * ID for a timeout which is used to clear the busy flag if it has been
     * true for a long time.
     */

    this._busyTimeoutID = null;
    this.reset = this.reset.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._updateMicrobitService = this._updateMicrobitService.bind(this);
    this._useMbitMoreService = true;
    this.digitalValuesUpdateInterval = 20; // milli-seconds

    this.digitalValuesLastUpdated = Date.now();
    this.analogInUpdateInterval = 200; // milli-seconds

    this.analogInLastUpdated = Date.now();
    this.sensorsUpdateInterval = 20; // milli-seconds

    this.sensorsLastUpdated = Date.now();
    this.bleReadTimelimit = 500;
  }
  /**
   * @param {string} text - the text to display.
   * @return {Promise} - a Promise that resolves when writing to peripheral.
   */


  _createClass(MbitMore, [{
    key: "displayText",
    value: function displayText(text) {
      var output = new Uint8Array(text.length);

      for (var i = 0; i < text.length; i++) {
        output[i] = text.charCodeAt(i);
      }

      return this.send(BLECommand.CMD_DISPLAY_TEXT, output);
    }
    /**
     * @param {Uint8Array} matrix - the matrix to display.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */

  }, {
    key: "displayMatrix",
    value: function displayMatrix(matrix) {
      return this.send(BLECommand.CMD_DISPLAY_LED, matrix);
    }
  }, {
    key: "setPinMode",
    value: function setPinMode(pinIndex, mode, util) {
      if (!this._useMbitMoreService) {
        switch (mode) {
          case PinMode.PULL_UP:
            this.send(BLECommandV0.CMD_PIN_INPUT, new Uint8Array([pinIndex]), util);
            break;

          case PinMode.PULL_DOWN:
            this.send(BLECommandV0.CMD_PIN_INPUT, new Uint8Array([pinIndex]), util);
            break;
        }

        return;
      }

      switch (mode) {
        case PinMode.PULL_NONE:
          this.send(BLECommand.CMD_PIN, new Uint8Array([MBitMorePinCommand.SET_PULL, pinIndex, MBitMorePinMode.PullNone]), util);
          break;

        case PinMode.PULL_UP:
          this.send(BLECommand.CMD_PIN, new Uint8Array([MBitMorePinCommand.SET_PULL, pinIndex, MBitMorePinMode.PullUp]), util);
          break;

        case PinMode.PULL_DOWN:
          this.send(BLECommand.CMD_PIN, new Uint8Array([MBitMorePinCommand.SET_PULL, pinIndex, MBitMorePinMode.PullDown]), util);
          break;
      }
    }
  }, {
    key: "setPinOutput",
    value: function setPinOutput(pinIndex, level, util) {
      if (!this._useMbitMoreService) {
        this.send(BLECommandV0.CMD_PIN_OUTPUT, new Uint8Array([pinIndex, level]), util);
        return;
      }

      this.send(BLECommand.CMD_PIN, new Uint8Array([MBitMorePinCommand.SET_OUTPUT, pinIndex, level]), util);
    }
  }, {
    key: "setPinPWM",
    value: function setPinPWM(pinIndex, level, util) {
      var dataView = new DataView(new ArrayBuffer(2));
      dataView.setUint16(0, level, true);

      if (!this._useMbitMoreService) {
        this.send(BLECommandV0.CMD_PIN_PWM, new Uint8Array([pinIndex, dataView.getUint8(0), dataView.getUint8(1)]), util);
        return;
      }

      this.send(BLECommand.CMD_PIN, new Uint8Array([MBitMorePinCommand.SET_PWM, pinIndex, dataView.getUint8(0), dataView.getUint8(1)]), util);
    }
  }, {
    key: "setPinServo",
    value: function setPinServo(pinIndex, angle, range, center, util) {
      if (!range || range < 0) range = 0;
      if (!center || center < 0) center = 0;
      var dataView = new DataView(new ArrayBuffer(6));
      dataView.setUint16(0, angle, true);
      dataView.setUint16(2, range, true);
      dataView.setUint16(4, center, true);

      if (!this._useMbitMoreService) {
        this.send(BLECommandV0.CMD_PIN_SERVO, new Uint8Array([pinIndex, dataView.getUint8(0), dataView.getUint8(1), dataView.getUint8(2), dataView.getUint8(3), dataView.getUint8(4), dataView.getUint8(5)]), util);
        return;
      }

      this.send(BLECommand.CMD_PIN, new Uint8Array([MBitMorePinCommand.SET_SERVO, pinIndex, dataView.getUint8(0), dataView.getUint8(1), dataView.getUint8(2), dataView.getUint8(3), dataView.getUint8(4), dataView.getUint8(5)]), util);
    }
    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the X axis.
     */

  }, {
    key: "updateAnalogIn",

    /**
     * Update data of the analog input.
     * @return {Promise} - a Promise that resolves sensors which updated data of the analog input.
     */
    value: function updateAnalogIn() {
      var _this2 = this;

      if (Date.now() - this.analogInLastUpdated < this.analogInUpdateInterval) {
        return Promise.resolve(this._sensors);
      }

      var read = this._ble.read(MBITMORE_SERVICE.ID, MBITMORE_SERVICE.ANSLOG_IN, false).then(function (result) {
        if (!result) return _this2._sensors;
        var data = base64Util.base64ToUint8Array(result.message);
        var dataView = new DataView(data.buffer, 0);
        var value1 = dataView.getUint16(0, true);
        var value2 = dataView.getUint16(2, true);
        var value3 = dataView.getUint16(4, true); // This invalid values will come up sometimes but the cause is unknown.

        if (value1 === 255 && value2 === 255 && value3 === 255) {
          return _this2._sensors;
        }

        _this2._sensors.analogValue[_this2.analogIn[0]] = value1;
        _this2._sensors.analogValue[_this2.analogIn[1]] = value2;
        _this2._sensors.analogValue[_this2.analogIn[2]] = value3;
        _this2._sensors.powerVoltage = dataView.getUint16(6, true) / 1000;
        _this2.analogInLastUpdated = Date.now();
        return _this2._sensors;
      });

      return Promise.race([read, timeoutPromise(this.bleReadTimelimit).then(function () {
        return _this2._sensors;
      })]);
    }
    /**
     * Read analog input from the pin [0, 1, 2].
     * @param {number} pin - the pin to read.
     * @return {Promise} - a Promise that resolves analog input value of the pin.
     */

  }, {
    key: "readAnalogIn",
    value: function readAnalogIn(pin) {
      var _this3 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      if (!this._useMbitMoreService) {
        return Promise.resolve(this._sensors.analogValue[pin]);
      }

      return this.updateAnalogIn().then(function () {
        return _this3._sensors.analogValue[pin];
      });
    }
    /**
     * Read voltage of power supply [V].
     * @return {Promise} - a Promise that resolves voltage value.
     */

  }, {
    key: "readPowerVoltage",
    value: function readPowerVoltage() {
      var _this4 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      if (!this._useMbitMoreService) {
        return Promise.resolve(0);
      }

      return this.updateAnalogIn().then(function () {
        return _this4._sensors.powerVoltage;
      });
    }
    /**
     * Update data of all sensors.
     * @return {Promise} - a Promise that resolves sensors which updated data of all sensor.
     */

  }, {
    key: "updateSensors",
    value: function updateSensors() {
      var _this5 = this;

      if (!this._useMbitMoreService) {
        return Promise.resolve(this._sensors);
      }

      if (Date.now() - this.sensorsLastUpdated < this.sensorsUpdateInterval) {
        return Promise.resolve(this._sensors);
      }

      var read = this._ble.read(MBITMORE_SERVICE.ID, MBITMORE_SERVICE.SENSORS, false).then(function (result) {
        if (!result) return _this5._sensors;
        var data = base64Util.base64ToUint8Array(result.message);
        var dataView = new DataView(data.buffer, 0); // Accelerometer

        _this5._sensors.accelerationX = 1000 * dataView.getInt16(0, true) / G$1;
        _this5._sensors.accelerationY = 1000 * dataView.getInt16(2, true) / G$1;
        _this5._sensors.accelerationZ = 1000 * dataView.getInt16(4, true) / G$1;
        _this5._sensors.accelerationStrength = Math.round(Math.sqrt(Math.pow(_this5._sensors.accelerationX, 2) + Math.pow(_this5._sensors.accelerationY, 2) + Math.pow(_this5._sensors.accelerationZ, 2)));
        _this5._sensors.pitch = Math.round(dataView.getInt16(6, true) * 180 / Math.PI / 1000);
        _this5._sensors.roll = Math.round(dataView.getInt16(8, true) * 180 / Math.PI / 1000); // Magnetometer

        _this5._sensors.compassHeading = dataView.getUint16(10, true);
        _this5._sensors.magneticForceX = dataView.getInt16(12, true);
        _this5._sensors.magneticForceY = dataView.getInt16(14, true);
        _this5._sensors.magneticForceZ = dataView.getInt16(16, true);
        _this5._sensors.magneticStrength = Math.round(Math.sqrt(Math.pow(_this5._sensors.magneticForceX, 2) + Math.pow(_this5._sensors.magneticForceY, 2) + Math.pow(_this5._sensors.magneticForceZ, 2))); // Light sensor

        _this5._sensors.lightLevel = dataView.getUint8(18);
        _this5._sensors.temperature = dataView.getUint8(19) - 128;
        _this5.sensorsLastUpdated = Date.now();
        return _this5._sensors;
      });

      return Promise.race([read, timeoutPromise(this.bleReadTimelimit).then(function () {
        return _this5._sensors;
      })]);
    }
    /**
     * Read light level from the light sensor.
     * @return {Promise} - a Promise that resolves light level.
     */

  }, {
    key: "readLightLevel",
    value: function readLightLevel() {
      var _this6 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      if (!this._useMbitMoreService) {
        return Promise.resolve(this._sensors.lightLevel);
      }

      this.send(BLECommand.CMD_LIGHT_SENSING, 10); // 10 times sensor-update (11 ms) for light sensing duration.

      return timeoutPromise(100) // Wait for enough time to finish light sensing.
      .then(function () {
        return _this6.updateSensors().then(function () {
          return _this6._sensors.lightLevel;
        });
      });
    }
    /**
     * Read temperature (integer in celsius) from the micro:bit cpu.
     * @return {Promise} - a Promise that resolves temperature.
     */

  }, {
    key: "readTemperature",
    value: function readTemperature() {
      var _this7 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this7._sensors.temperature;
      });
    }
    /**
     * Read the angle (degrees) of heading direction from the north.
     * @return {Promise} - a Promise that resolves compass heading.
     */

  }, {
    key: "readCompassHeading",
    value: function readCompassHeading() {
      var _this8 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this8._sensors.compassHeading;
      });
    }
    /**
     * Read magnetic field X [micro teslas].
     * @return {Promise} - a Promise that resolves magnetic field strength.
     */

  }, {
    key: "readMagneticForceX",
    value: function readMagneticForceX() {
      var _this9 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this9._sensors.magneticForceX;
      });
    }
    /**
     * Read magnetic field Y [micro teslas].
     * @return {Promise} - a Promise that resolves magnetic field strength.
     */

  }, {
    key: "readMagneticForceY",
    value: function readMagneticForceY() {
      var _this10 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this10._sensors.magneticForceY;
      });
    }
    /**
     * Read magnetic field X [micro teslas].
     * @return {Promise} - a Promise that resolves magnetic field strength.
     */

  }, {
    key: "readMagneticForceZ",
    value: function readMagneticForceZ() {
      var _this11 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this11._sensors.magneticForceZ;
      });
    }
    /**
     * Read magnetic field strength [micro teslas].
     * @return {Promise} - a Promise that resolves magnetic field strength.
     */

  }, {
    key: "readMagneticStrength",
    value: function readMagneticStrength() {
      var _this12 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this12._sensors.magneticStrength;
      });
    }
    /**
     * Read the value of gravitational acceleration [milli-g] for X axis.
     * @return {Promise} - a Promise that resolves acceleration.
     */

  }, {
    key: "readAccelerationX",
    value: function readAccelerationX() {
      var _this13 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this13._sensors.accelerationX;
      });
    }
    /**
     * Read the value of gravitational acceleration [milli-g] for Y axis.
     * @return {Promise} - a Promise that resolves acceleration.
     */

  }, {
    key: "readAccelerationY",
    value: function readAccelerationY() {
      var _this14 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this14._sensors.accelerationY;
      });
    }
    /**
     * Read the value of gravitational acceleration [milli-g] for Z axis.
     * @return {Promise} - a Promise that resolves acceleration.
     */

  }, {
    key: "readAccelerationZ",
    value: function readAccelerationZ() {
      var _this15 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this15._sensors.accelerationZ;
      });
    }
    /**
     * Read acceleration strength [milli-g].
     * @return {Promise} - a Promise that resolves acceleration strength.
     */

  }, {
    key: "readAccelerationStrength",
    value: function readAccelerationStrength() {
      var _this16 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this16._sensors.accelerationStrength;
      });
    }
    /**
     * Read pitch [degrees] is 3D space.
     * @return {Promise} - a Promise that resolves pitch.
     */

  }, {
    key: "readPitch",
    value: function readPitch() {
      var _this17 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this17._sensors.pitch;
      });
    }
    /**
     * Read roll [degrees] is 3D space.
     * @return {Promise} - a Promise that resolves roll.
     */

  }, {
    key: "readRoll",
    value: function readRoll() {
      var _this18 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      return this.updateSensors().then(function () {
        return _this18._sensors.roll;
      });
    }
    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */

  }, {
    key: "scan",
    value: function scan() {
      if (this._ble) {
        this._ble.disconnect();
      }

      this._ble = new ble(this._runtime, this._extensionId, {
        filters: [{
          services: [MICROBIT_SERVICE.ID]
        }],
        optionalServices: [MBITMORE_SERVICE.ID]
      }, this._onConnect, this.reset);
    }
    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */

  }, {
    key: "connect",
    value: function connect(id) {
      if (this._ble) {
        this._ble.connectPeripheral(id);
      }
    }
    /**
     * Disconnect from the micro:bit.
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this._ble) {
        this._ble.disconnect();
      }

      this.reset();
    }
    /**
     * Reset all the state and timeout/interval ids.
     */

  }, {
    key: "reset",
    value: function reset() {
      if (this._timeoutID) {
        window.clearTimeout(this._timeoutID);
        this._timeoutID = null;
      }
    }
    /**
     * Return true if connected to the micro:bit.
     * @return {boolean} - whether the micro:bit is connected.
     */

  }, {
    key: "isConnected",
    value: function isConnected() {
      var connected = false;

      if (this._ble) {
        connected = this._ble.isConnected();
      }

      return connected;
    }
    /**
     * Send a message to the peripheral BLE socket.
     * @param {number} command - the BLE command hex.
     * @param {Uint8Array} message - the message to write
     * @param {object} util - utility object provided by the runtime.
     */

  }, {
    key: "send",
    value: function send(command, message, util) {
      var _this19 = this;

      if (!this.isConnected()) return;

      if (this._busy) {
        if (util) util.yield();
        return;
      } // Set a busy flag so that while we are sending a message and waiting for
      // the response, additional messages are ignored.


      this._busy = true; // Set a timeout after which to reset the busy flag. This is used in case
      // a BLE message was sent for which we never received a response, because
      // e.g. the peripheral was turned off after the message was sent. We reset
      // the busy flag after a while so that it is possible to try again later.

      this._busyTimeoutID = window.setTimeout(function () {
        _this19._busy = false;
      }, 5000);
      var output = new Uint8Array(message.length + 1);
      output[0] = command; // attach command to beginning of message

      for (var i = 0; i < message.length; i++) {
        output[i + 1] = message[i];
      }

      var data = base64Util.uint8ArrayToBase64(output);

      this._ble.write(MICROBIT_SERVICE.ID, MICROBIT_SERVICE.TX, data, 'base64', true).then(function () {
        _this19._busy = false;
        window.clearTimeout(_this19._busyTimeoutID);
      });
    }
    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */

  }, {
    key: "_onConnect",
    value: function _onConnect() {
      var _this20 = this;

      this._ble.startNotifications(MICROBIT_SERVICE.ID, MICROBIT_SERVICE.RX, this._updateMicrobitService); // Test for availability of Microbit More service.


      this._ble.read(MBITMORE_SERVICE.ID, MBITMORE_SERVICE.SHARED_DATA, false).then(function () {
        // Microbit More service is available.
        _this20._useMbitMoreService = true;

        _this20.send(BLECommand.CMD_PROTOCOL, new Uint8Array([1])); // Set protocol ver.1.


        _this20._ble.startNotifications(MBITMORE_SERVICE.ID, MBITMORE_SERVICE.SHARED_DATA, _this20._updateMicrobitService);

        _this20._ble.startNotifications(MBITMORE_SERVICE.ID, MBITMORE_SERVICE.EVENT, _this20._updateMicrobitService);

        _this20.send(BLECommand.CMD_LIGHT_SENSING, 0); // Set continuous light sensing to off.

      }).catch(function () {
        // Microbit More service is NOT available.
        _this20._useMbitMoreService = false;
      });

      this._timeoutID = window.setTimeout(function () {
        return _this20._ble.handleDisconnectError(BLEDataStoppedError);
      }, BLETimeout);
    }
    /**
     * Process the sensor data from the incoming BLE characteristic.
     * @param {string} msg - the incoming BLE data.
     * @private
     */

  }, {
    key: "_updateMicrobitService",
    value: function _updateMicrobitService(msg) {
      var data = base64Util.base64ToUint8Array(msg);
      var dataView = new DataView(data.buffer, 0);
      var dataFormat = dataView.getUint8(19);

      switch (dataFormat) {
        case MBitMoreDataFormat.MIX_01:
          {
            this._sensors.analogValue[this.analogIn[0]] = dataView.getUint16(10, true);
            this._sensors.analogValue[this.analogIn[1]] = dataView.getUint16(12, true);
            this._sensors.analogValue[this.analogIn[2]] = dataView.getUint16(14, true);
            this._sensors.compassHeading = dataView.getUint16(16, true);
            this._sensors.lightLevel = dataView.getUint8(18);
            break;
          }

        case MBitMoreDataFormat.MIX_02:
          {
            this._sensors.sharedData[0] = dataView.getInt16(10, true);
            this._sensors.sharedData[1] = dataView.getInt16(12, true);
            this._sensors.sharedData[2] = dataView.getInt16(14, true);
            this._sensors.sharedData[3] = dataView.getInt16(16, true);
            var gpioData = dataView.getUint8(18);

            for (var i = 0; i < this.gpio.length; i++) {
              this._sensors.digitalValue[this.gpio[i]] = gpioData >> i & 1;
            }

            break;
          }

        case MBitMoreDataFormat.MIX_03:
          {
            this._sensors.magneticStrength = dataView.getUint16(10, true);
            this._sensors.accelerationX = 1000 * dataView.getInt16(12, true) / G$1;
            this._sensors.accelerationY = 1000 * dataView.getInt16(14, true) / G$1;
            this._sensors.accelerationZ = 1000 * dataView.getInt16(16, true) / G$1;
            break;
          }

        case MBitMoreDataFormat.SHARED_DATA:
          {
            this._sensors.sharedData[0] = dataView.getInt16(0, true);
            this._sensors.sharedData[1] = dataView.getInt16(2, true);
            this._sensors.sharedData[2] = dataView.getInt16(4, true);
            this._sensors.sharedData[3] = dataView.getInt16(6, true);
            break;
          }

        case MBitMoreDataFormat.EVENT:
          {
            var pinIndex = dataView.getUint8(0);

            if (!this._events[pinIndex]) {
              this._events[pinIndex] = {};
            }

            var event = dataView.getUint16(1, true);
            this._events[pinIndex][event] = dataView.getUint32(3, true);
            break;
          }

        default:
          // Read original micro:bit data.
          this._sensors.tiltX = data[1] | data[0] << 8;
          if (this._sensors.tiltX > 1 << 15) this._sensors.tiltX -= 1 << 16;
          this._sensors.tiltY = data[3] | data[2] << 8;
          if (this._sensors.tiltY > 1 << 15) this._sensors.tiltY -= 1 << 16;
          this._sensors.buttonA = dataView.getUint8(4);
          this._sensors.buttonB = dataView.getUint8(5);
          this._sensors.touchPins[0] = dataView.getUint8(6);
          this._sensors.touchPins[1] = dataView.getUint8(7);
          this._sensors.touchPins[2] = dataView.getUint8(8);
          this._sensors.gestureState = dataView.getUint8(9);
          break;
      }

      this.resetDisconnectTimeout();
    }
    /**
     * Cancel disconnect timeout and start counting again.
     */

  }, {
    key: "resetDisconnectTimeout",
    value: function resetDisconnectTimeout() {
      var _this21 = this;

      window.clearTimeout(this._timeoutID);
      this._timeoutID = window.setTimeout(function () {
        return _this21._ble.handleDisconnectError(BLEDataStoppedError);
      }, BLETimeout);
    }
    /**
     * Return whether the pin is connected to ground or not.
     * @param {number} pin - the pin to check touch state.
     * @return {boolean} - true if the pin is connected to GND.
     */

  }, {
    key: "isPinOnGrand",
    value: function isPinOnGrand(pin) {
      if (pin > 2) {
        if (!this._useMbitMoreService) {
          return this._sensors.digitalValue[pin];
        }

        if (Date.now() - this.digitalValuesLastUpdated > this.digitalValuesUpdateInterval) {
          // Return the last value immediately and start update for next check.
          this.updateDigitalValue().then();
          this.digitalValuesLastUpdated = Date.now();
        }

        return this._sensors.digitalValue[pin] === 0;
      }

      return this._sensors.touchPins[pin] !== 0;
    }
    /**
     * Update data of the digital input state.
     * @return {Promise} - Promise that resolves sensors which updated data of the ditital input state.
     */

  }, {
    key: "updateDigitalValue",
    value: function updateDigitalValue() {
      var _this22 = this;

      var read = this._ble.read(MBITMORE_SERVICE.ID, MBITMORE_SERVICE.IO, false).then(function (result) {
        if (!result) return _this22._sensors;
        var data = base64Util.base64ToUint8Array(result.message);
        var dataView = new DataView(data.buffer, 0);
        var gpioData = dataView.getUint32(0, true);

        for (var i = 0; i < _this22.gpio.length; i++) {
          _this22._sensors.digitalValue[_this22.gpio[i]] = gpioData >> _this22.gpio[i] & 1;
        }

        _this22.digitalValuesLastUpdated = Date.now();
        return _this22._sensors;
      });

      return Promise.race([read, timeoutPromise(this.bleReadTimelimit).then(function () {
        return _this22._sensors;
      })]);
    }
    /**
     * Read digital input from the pin.
     * @param {number} pin - the pin to read.
     * @return {Promise} - a Promise that resolves digital input value of the pin.
     */

  }, {
    key: "readDigitalValue",
    value: function readDigitalValue(pin) {
      var _this23 = this;

      if (!this.isConnected()) {
        return Promise.resolve(0);
      }

      if (!this._useMbitMoreService) {
        return Promise.resolve(this._sensors.digitalValue[pin]);
      }

      return this.updateDigitalValue().then(function () {
        return _this23._sensors.digitalValue[pin];
      });
    }
    /**
     * Return the value of the shared data.
     * @param {number} index - the shared data index.
     * @return {number} - the latest value received for the shared data.
     */

  }, {
    key: "getSharedData",
    value: function getSharedData(index) {
      return this._sensors.sharedData[index];
    }
  }, {
    key: "setSharedData",
    value: function setSharedData(sharedDataIndex, sharedDataValue, util) {
      var dataView = new DataView(new ArrayBuffer(2));
      dataView.setInt16(0, sharedDataValue, true);
      var command = this._useMbitMoreService ? BLECommand.CMD_SHARED_DATA : BLECommandV0.CMD_SHARED_DATA_SET;
      this.send(command, new Uint8Array([sharedDataIndex, dataView.getUint8(0), dataView.getUint8(1)]), util);
      this._sensors.sharedData[sharedDataIndex] = sharedDataValue;
    }
    /**
     * Return the last timestamp of the pin event or 0 when the event is not sent.
     * @param {number} pinIndex - index of the pin to get the event.
     * @param {MicroBitEvent} event - event to get.
     * @return {number} Timestamp of the last event.
     */

  }, {
    key: "getPinEventTimestamp",
    value: function getPinEventTimestamp(pinIndex, event) {
      if (this._events[pinIndex] && this._events[pinIndex][event]) {
        return this._events[pinIndex][event];
      }

      return 0;
    }
    /**
     * Set event type to be get from the pin.
     * @param {number} pinIndex - Index of the pin to set.
     * @param {MicroBitEventType} eventType - Event type to set.
     * @param {object} util - utility object provided by the runtime.
    */

  }, {
    key: "setPinEventType",
    value: function setPinEventType(pinIndex, eventType, util) {
      if (!this._useMbitMoreService) return;
      this.send(BLECommand.CMD_PIN, new Uint8Array([MBitMorePinCommand.SET_EVENT, pinIndex, eventType]), util);
    }
  }, {
    key: "tiltX",
    get: function get() {
      return this._sensors.tiltX;
    }
    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the Y axis.
     */

  }, {
    key: "tiltY",
    get: function get() {
      return this._sensors.tiltY;
    }
    /**
     * @return {boolean} - the latest value received for the A button.
     */

  }, {
    key: "buttonA",
    get: function get() {
      return this._sensors.buttonA;
    }
    /**
     * @return {boolean} - the latest value received for the B button.
     */

  }, {
    key: "buttonB",
    get: function get() {
      return this._sensors.buttonB;
    }
    /**
     * @return {number} - the latest value received for the motion gesture states.
     */

  }, {
    key: "gestureState",
    get: function get() {
      return this._sensors.gestureState;
    }
    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */

  }, {
    key: "ledMatrixState",
    get: function get() {
      return this._sensors.ledMatrixState;
    }
  }]);

  return MbitMore;
}();
/**
 * Enum for tilt sensor direction.
 * @readonly
 * @enum {string}
 */


var MicroBitTiltDirection = {
  FRONT: 'front',
  BACK: 'back',
  LEFT: 'left',
  RIGHT: 'right',
  ANY: 'any'
};
/**
 * Enum for micro:bit gestures.
 * @readonly
 * @enum {string}
 */

var MicroBitGestures = {
  MOVED: 'moved',
  SHAKEN: 'shaken',
  JUMPED: 'jumped'
};
/**
 * Enum for micro:bit buttons.
 * @readonly
 * @enum {string}
 */

var MicroBitButtons = {
  A: 'A',
  B: 'B',
  ANY: 'any'
};
/**
 * Enum for micro:bit pin states.
 * @readonly
 * @enum {string}
 */

var MicroBitPinState = {
  ON: 'on',
  OFF: 'off'
};
var DigitalValue = {
  LOW: '0',
  HIGH: '1'
};
/**
 * Enum for axis menu options.
 * @readonly
 * @enum {string}
 */

var AxisValues = {
  X: 'x',
  Y: 'y',
  Z: 'z',
  Absolute: 'absolute'
};
/**
 * Scratch 3.0 blocks to interact with a MicroBit peripheral.
 */

var MbitMoreBlocks = /*#__PURE__*/function () {
  _createClass(MbitMoreBlocks, [{
    key: "BUTTONS_MENU",

    /**
     * @return {array} - text and values for each buttons menu element
     */
    get: function get() {
      return [{
        text: 'A',
        value: MicroBitButtons.A
      }, {
        text: 'B',
        value: MicroBitButtons.B
      }, {
        text: formatMessage$2({
          id: 'microbit.buttonsMenu.any',
          default: 'any',
          description: 'label for "any" element in button picker for micro:bit extension'
        }),
        value: MicroBitButtons.ANY
      }];
    }
    /**
     * @return {array} - text and values for each gestures menu element
     */

  }, {
    key: "GESTURES_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'microbit.gesturesMenu.moved',
          default: 'moved',
          description: 'label for moved gesture in gesture picker for micro:bit extension'
        }),
        value: MicroBitGestures.MOVED
      }, {
        text: formatMessage$2({
          id: 'microbit.gesturesMenu.shaken',
          default: 'shaken',
          description: 'label for shaken gesture in gesture picker for micro:bit extension'
        }),
        value: MicroBitGestures.SHAKEN
      }, {
        text: formatMessage$2({
          id: 'microbit.gesturesMenu.jumped',
          default: 'jumped',
          description: 'label for jumped gesture in gesture picker for micro:bit extension'
        }),
        value: MicroBitGestures.JUMPED
      }];
    }
    /**
     * @return {array} - text and values for each pin state menu element
     */

  }, {
    key: "PIN_STATE_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'microbit.pinStateMenu.on',
          default: 'on',
          description: 'label for on element in pin state picker for micro:bit extension'
        }),
        value: MicroBitPinState.ON
      }, {
        text: formatMessage$2({
          id: 'microbit.pinStateMenu.off',
          default: 'off',
          description: 'label for off element in pin state picker for micro:bit extension'
        }),
        value: MicroBitPinState.OFF
      }];
    }
    /**
     * @return {array} - text and values for each tilt direction menu element
     */

  }, {
    key: "TILT_DIRECTION_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'microbit.tiltDirectionMenu.front',
          default: 'front',
          description: 'label for front element in tilt direction picker for micro:bit extension'
        }),
        value: MicroBitTiltDirection.FRONT
      }, {
        text: formatMessage$2({
          id: 'microbit.tiltDirectionMenu.back',
          default: 'back',
          description: 'label for back element in tilt direction picker for micro:bit extension'
        }),
        value: MicroBitTiltDirection.BACK
      }, {
        text: formatMessage$2({
          id: 'microbit.tiltDirectionMenu.left',
          default: 'left',
          description: 'label for left element in tilt direction picker for micro:bit extension'
        }),
        value: MicroBitTiltDirection.LEFT
      }, {
        text: formatMessage$2({
          id: 'microbit.tiltDirectionMenu.right',
          default: 'right',
          description: 'label for right element in tilt direction picker for micro:bit extension'
        }),
        value: MicroBitTiltDirection.RIGHT
      }];
    }
    /**
     * @return {array} - text and values for each tilt direction (plus "any") menu element
     */

  }, {
    key: "TILT_DIRECTION_ANY_MENU",
    get: function get() {
      return [].concat(_toConsumableArray(this.TILT_DIRECTION_MENU), [{
        text: formatMessage$2({
          id: 'microbit.tiltDirectionMenu.any',
          default: 'any',
          description: 'label for any direction element in tilt direction picker for micro:bit extension'
        }),
        value: MicroBitTiltDirection.ANY
      }]);
    }
  }, {
    key: "ANALOG_IN_MENU",
    get: function get() {
      return this._peripheral.analogIn.map(function (pinIndex) {
        return pinIndex.toString();
      });
    }
  }, {
    key: "SHARED_DATA_INDEX_MENU",
    get: function get() {
      var menu = [];

      for (var i = 0; i < this._peripheral.sharedDataLength; i++) {
        menu.push(i.toString());
      }

      return menu;
    }
  }, {
    key: "GPIO_MENU",
    get: function get() {
      return this._peripheral.gpio.map(function (pinIndex) {
        return pinIndex.toString();
      });
    }
  }, {
    key: "DIGITAL_VALUE_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'mbitMore.digitalValueMenu.Low',
          default: '0',
          description: 'label for low value in digital output menu for microbit more extension'
        }),
        value: DigitalValue.LOW
      }, {
        text: formatMessage$2({
          id: 'mbitMore.digitalValueMenu.High',
          default: '1',
          description: 'label for high value in digital output menu for microbit more extension'
        }),
        value: DigitalValue.HIGH
      }];
    }
  }, {
    key: "AXIS_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'mbitMore.axisMenu.x',
          default: 'x',
          description: 'label of X axis.'
        }),
        value: AxisValues.X
      }, {
        text: formatMessage$2({
          id: 'mbitMore.axisMenu.y',
          default: 'y',
          description: 'label of Y axis.'
        }),
        value: AxisValues.Y
      }, {
        text: formatMessage$2({
          id: 'mbitMore.axisMenu.z',
          default: 'z',
          description: 'label of Z axis.'
        }),
        value: AxisValues.Z
      }, {
        text: formatMessage$2({
          id: 'mbitMore.axisMenu.absolute',
          default: 'absolute',
          description: 'label of absolute value.'
        }),
        value: AxisValues.Absolute
      }];
    }
    /**
     * @return {array} - text and values for each pin mode menu element
     */

  }, {
    key: "PIN_MODE_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'mbitMore.pinModeMenu.pullNone',
          default: 'pull none',
          description: 'label for pullNone mode'
        }),
        value: PinMode.PULL_NONE
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinModeMenu.pullUp',
          default: 'pull up',
          description: 'label for pullUp mode'
        }),
        value: PinMode.PULL_UP
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinModeMenu.pullDown',
          default: 'pull down',
          description: 'label for pullDown mode'
        }),
        value: PinMode.PULL_DOWN
      }];
    }
    /**
     * @return {array} - Menu items for event selector.
     */

  }, {
    key: "PIN_EVENT_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'mbitMore.pinEventMenu.pulseLow',
          default: 'low pulse',
          description: 'label for low pulse event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_PULSE_LO
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventMenu.pulseHigh',
          default: 'high pulse',
          description: 'label for high pulse event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_PULSE_HI
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventMenu.fall',
          default: 'fall',
          description: 'label for fall event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_FALL
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventMenu.rise',
          default: 'rise',
          description: 'label for rise event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_RISE
      }];
    }
    /**
     * @return {array} - Menu items for event selector.
     */

  }, {
    key: "PIN_EVENT_TIMESTAMP_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'mbitMore.pinEventTimestampMenu.pulseLow',
          default: 'low pulse',
          description: 'label for low pulse event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_PULSE_LO
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventTimestampMenu.pulseHigh',
          default: 'high pulse',
          description: 'label for high pulse event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_PULSE_HI
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventTimestampMenu.fall',
          default: 'fall',
          description: 'label for fall event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_FALL
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventTimestampMenu.rise',
          default: 'rise',
          description: 'label for rise event'
        }),
        value: MicroBitEvent.MICROBIT_PIN_EVT_RISE
      }];
    }
    /**
     * @return {array} - Menu items for event listening.
     */

  }, {
    key: "PIN_EVENT_TYPE_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'mbitMore.pinEventTypeMenu.none',
          default: 'none',
          description: 'label for remove event listener'
        }),
        value: MicroBitEventType.MICROBIT_PIN_EVENT_NONE
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventTypeMenu.pulse',
          default: 'pulse',
          description: 'label for pulse event type'
        }),
        value: MicroBitEventType.MICROBIT_PIN_EVENT_ON_PULSE
      }, {
        text: formatMessage$2({
          id: 'mbitMore.pinEventTypeMenu.edge',
          default: 'edge',
          description: 'label for edge event type'
        }),
        value: MicroBitEventType.MICROBIT_PIN_EVENT_ON_EDGE
      }];
    }
    /**
     * @return {array} - Menu items for connection state.
     */

  }, {
    key: "CONNECTION_STATE_MENU",
    get: function get() {
      return [{
        text: formatMessage$2({
          id: 'mbitMore.connectionStateMenu.connected',
          default: 'connected',
          description: 'label for connected'
        }),
        value: 'connected'
      }, {
        text: formatMessage$2({
          id: 'mbitMore.connectionStateMenu.disconnected',
          default: 'disconnected',
          description: 'label for disconnected'
        }),
        value: 'disconnected'
      }];
    }
    /**
     * Construct a set of MicroBit blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */

  }], [{
    key: "EXTENSION_NAME",

    /**
     * @return {string} - the name of this extension.
     */
    get: function get() {
      return 'micro:bit more';
    }
    /**
     * @return {string} - the ID of this extension.
     */

  }, {
    key: "EXTENSION_ID",
    get: function get() {
      return EXTENSION_ID;
    }
    /**
     * URL to get this extension.
     * @type {string}
     */

  }, {
    key: "extensionURL",
    get: function get() {
      return extensionURL;
    }
    /**
     * Set URL to get this extension.
     * @param {string} url - URL
     */
    ,
    set: function set(url) {
      extensionURL = url;
    }
    /**
     * @return {number} - the tilt sensor counts as "tilted" if its tilt angle meets or exceeds this threshold.
     */

  }, {
    key: "TILT_THRESHOLD",
    get: function get() {
      return 15;
    }
  }]);

  function MbitMoreBlocks(runtime) {
    _classCallCheck(this, MbitMoreBlocks);

    /**
     * The Scratch 3.0 runtime.
     * @type {Runtime}
     */
    this.runtime = runtime;

    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage$2 = runtime.formatMessage;
    } // Create a new MicroBit peripheral instance


    this._peripheral = new MbitMore(this.runtime, MbitMoreBlocks.EXTENSION_ID);
    /**
     * Event holder of pin events.
     * @type {object.<number>} - list of pins which has events.
     */

    this.lastEvents = {};
  }
  /**
   * @returns {object} metadata for this extension and its blocks.
   */


  _createClass(MbitMoreBlocks, [{
    key: "getInfo",
    value: function getInfo() {
      this.setupTranslations();
      return {
        id: MbitMoreBlocks.EXTENSION_ID,
        name: MbitMoreBlocks.EXTENSION_NAME,
        extensionURL: MbitMoreBlocks.extensionURL,
        blockIconURI: blockIconURI,
        showStatusButton: true,
        blocks: [{
          opcode: 'whenButtonPressed',
          text: formatMessage$2({
            id: 'microbit.whenButtonPressed',
            default: 'when [BTN] button pressed',
            description: 'when the selected button on the micro:bit is pressed'
          }),
          blockType: blockType.HAT,
          arguments: {
            BTN: {
              type: argumentType.STRING,
              menu: 'buttons',
              defaultValue: MicroBitButtons.A
            }
          }
        }, {
          opcode: 'isButtonPressed',
          text: formatMessage$2({
            id: 'microbit.isButtonPressed',
            default: '[BTN] button pressed?',
            description: 'is the selected button on the micro:bit pressed?'
          }),
          blockType: blockType.BOOLEAN,
          arguments: {
            BTN: {
              type: argumentType.STRING,
              menu: 'buttons',
              defaultValue: MicroBitButtons.A
            }
          }
        }, '---', {
          opcode: 'whenGesture',
          text: formatMessage$2({
            id: 'microbit.whenGesture',
            default: 'when [GESTURE]',
            description: 'when the selected gesture is detected by the micro:bit'
          }),
          blockType: blockType.HAT,
          arguments: {
            GESTURE: {
              type: argumentType.STRING,
              menu: 'gestures',
              defaultValue: MicroBitGestures.MOVED
            }
          }
        }, '---', {
          opcode: 'displaySymbol',
          text: formatMessage$2({
            id: 'microbit.displaySymbol',
            default: 'display [MATRIX]',
            description: 'display a pattern on the micro:bit display'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            MATRIX: {
              type: argumentType.MATRIX,
              defaultValue: '0101010101100010101000100'
            }
          }
        }, {
          opcode: 'displayText',
          text: formatMessage$2({
            id: 'microbit.displayText',
            default: 'display text [TEXT]',
            description: 'display text on the micro:bit display'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            TEXT: {
              type: argumentType.STRING,
              defaultValue: formatMessage$2({
                id: 'microbit.defaultTextToDisplay',
                default: 'Hello!',
                description: "default text to display.\n                                IMPORTANT - the micro:bit only supports letters a-z, A-Z.\n                                Please substitute a default word in your language\n                                that can be written with those characters,\n                                substitute non-accented characters or leave it as \"Hello!\".\n                                Check the micro:bit site documentation for details"
              })
            }
          }
        }, {
          opcode: 'displayClear',
          text: formatMessage$2({
            id: 'microbit.clearDisplay',
            default: 'clear display',
            description: 'display nothing on the micro:bit display'
          }),
          blockType: blockType.COMMAND
        }, '---', {
          opcode: 'whenTilted',
          text: formatMessage$2({
            id: 'microbit.whenTilted',
            default: 'when tilted [DIRECTION]',
            description: 'when the micro:bit is tilted in a direction'
          }),
          blockType: blockType.HAT,
          arguments: {
            DIRECTION: {
              type: argumentType.STRING,
              menu: 'tiltDirectionAny',
              defaultValue: MicroBitTiltDirection.ANY
            }
          }
        }, {
          opcode: 'isTilted',
          text: formatMessage$2({
            id: 'microbit.isTilted',
            default: 'tilted [DIRECTION]?',
            description: 'is the micro:bit is tilted in a direction?'
          }),
          blockType: blockType.BOOLEAN,
          arguments: {
            DIRECTION: {
              type: argumentType.STRING,
              menu: 'tiltDirectionAny',
              defaultValue: MicroBitTiltDirection.ANY
            }
          }
        }, {
          opcode: 'getTiltAngle',
          text: formatMessage$2({
            id: 'microbit.tiltAngle',
            default: 'tilt angle [DIRECTION]',
            description: 'how much the micro:bit is tilted in a direction'
          }),
          blockType: blockType.REPORTER,
          arguments: {
            DIRECTION: {
              type: argumentType.STRING,
              menu: 'tiltDirection',
              defaultValue: MicroBitTiltDirection.FRONT
            }
          }
        }, '---', {
          opcode: 'whenPinConnected',
          text: formatMessage$2({
            id: 'microbit.whenPinConnected',
            default: 'when pin [PIN] connected',
            description: 'when the pin detects a connection to Earth/Ground'
          }),
          blockType: blockType.HAT,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            }
          }
        }, {
          opcode: 'isPinConnected',
          text: formatMessage$2({
            id: 'mbitMore.isPinConnected',
            default: '[PIN] pin connected?',
            description: 'is the selected pin connected to Earth/Ground?'
          }),
          blockType: blockType.BOOLEAN,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            }
          }
        }, '---', {
          opcode: 'getLightLevel',
          text: formatMessage$2({
            id: 'mbitMore.lightLevel',
            default: 'light intensity',
            description: 'how much the amount of light falling on the LEDs on micro:bit'
          }),
          blockType: blockType.REPORTER
        }, {
          opcode: 'getTemperature',
          text: formatMessage$2({
            id: 'mbitMore.temperature',
            default: 'temperature',
            description: 'temperature (celsius) on the surface of CPU of micro:bit'
          }),
          blockType: blockType.REPORTER
        }, {
          opcode: 'getCompassHeading',
          text: formatMessage$2({
            id: 'mbitMore.compassHeading',
            default: 'angle with the North',
            description: 'angle from the North to the micro:bit heading direction'
          }),
          blockType: blockType.REPORTER
        }, {
          opcode: 'getPitch',
          text: formatMessage$2({
            id: 'mbitMore.pitch',
            default: 'pitch',
            description: 'nose up movement of the micro:bit from level'
          }),
          blockType: blockType.REPORTER
        }, {
          opcode: 'getRoll',
          text: formatMessage$2({
            id: 'mbitMore.roll',
            default: 'roll',
            description: 'clockwise circular movement of the micro:bit from level'
          }),
          blockType: blockType.REPORTER
        }, {
          opcode: 'getMagneticForce',
          text: formatMessage$2({
            id: 'mbitMore.magneticForce',
            default: 'magnetic force',
            description: 'value of magnetic force (micro tesla)'
          }),
          blockType: blockType.REPORTER,
          arguments: {
            AXIS: {
              type: argumentType.STRING,
              menu: 'axis',
              defaultValue: formatMessage$2({
                id: 'mbitMore.axisMenu.absolute',
                default: 'absolute',
                description: 'label of absolute value.'
              })
            }
          }
        }, {
          opcode: 'getAcceleration',
          text: formatMessage$2({
            id: 'mbitMore.acceleration',
            default: 'acceleration [AXIS]',
            description: 'value of acceleration on the axis (milli-g)'
          }),
          blockType: blockType.REPORTER,
          arguments: {
            AXIS: {
              type: argumentType.STRING,
              menu: 'axis',
              defaultValue: AxisValues.X
            }
          }
        }, {
          opcode: 'getPowerVoltage',
          text: formatMessage$2({
            id: 'mbitMore.powerVoltage',
            default: 'voltage of power',
            description: 'voltage value of power supply in volt'
          }),
          blockType: blockType.REPORTER,
          disableMonitor: true
        }, '---', {
          opcode: 'getAnalogValue',
          text: formatMessage$2({
            id: 'mbitMore.analogValue',
            default: 'analog value of pin [PIN]',
            description: 'analog input value of the pin'
          }),
          blockType: blockType.REPORTER,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'analogIn',
              defaultValue: '0'
            }
          }
        }, {
          opcode: 'getDigitalValue',
          text: formatMessage$2({
            id: 'mbitMore.digitalValue',
            default: 'digital value of pin [PIN]',
            description: 'digital input value of the pin'
          }),
          blockType: blockType.REPORTER,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            }
          }
        }, {
          opcode: 'setPinMode',
          text: formatMessage$2({
            id: 'mbitMore.setPinMode',
            default: 'set pin [PIN] to input [MODE]',
            description: 'set a pin into the mode'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            },
            MODE: {
              type: argumentType.STRING,
              menu: 'pinMode',
              defaultValue: PinMode.PULL_UP
            }
          }
        }, '---', {
          opcode: 'setOutput',
          text: formatMessage$2({
            id: 'mbitMore.setOutput',
            default: 'set [PIN] Digital [LEVEL]',
            description: 'set pin to Digtal Output mode and the level(0 or 1)'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            },
            LEVEL: {
              type: argumentType.STRING,
              menu: 'digitalValue',
              defaultValue: DigitalValue.LOW
            }
          }
        }, {
          opcode: 'setPWM',
          text: formatMessage$2({
            id: 'mbitMore.setPWM',
            default: 'set [PIN] PWM [LEVEL]',
            description: 'set pin to PWM mode and the level(0 to 1023)'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            },
            LEVEL: {
              type: argumentType.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: 'setServo',
          text: formatMessage$2({
            id: 'mbitMore.setServo',
            default: 'set [PIN] Servo [ANGLE]',
            description: 'set pin to Servo mode and the angle(0 to 180)'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            },
            ANGLE: {
              type: argumentType.NUMBER,
              defaultValue: 0
            },
            RANGE: {
              type: argumentType.NUMBER,
              defaultValue: 2000
            },
            CENTER: {
              type: argumentType.NUMBER,
              defaultValue: 1500
            }
          }
        }, '---', {
          opcode: 'setPinEventType',
          text: formatMessage$2({
            id: 'mbitMore.setPinEventType',
            default: 'catch event [EVENT_TYPE] on [PIN]',
            description: 'listen the event on the pin'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            EVENT_TYPE: {
              type: argumentType.NUMBER,
              menu: 'pinEventTypeMenu',
              defaultValue: this.PIN_EVENT_TYPE_MENU[0].value
            },
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            }
          }
        }, {
          opcode: 'whenPinEvent',
          text: formatMessage$2({
            id: 'mbitMore.whenPinEvent',
            default: 'when catch [EVENT] at pin [PIN]',
            description: 'when catch the event at the pin'
          }),
          blockType: blockType.HAT,
          arguments: {
            EVENT: {
              type: argumentType.NUMBER,
              menu: 'pinEventMenu',
              defaultValue: MicroBitEvent.MICROBIT_PIN_EVT_PULSE_LO
            },
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            }
          }
        }, {
          opcode: 'getPinEventTimestamp',
          text: formatMessage$2({
            id: 'mbitMore.getPinEventTimestamp',
            default: 'timestamp of [EVENT] at [PIN]',
            description: 'value of the timestamp of the event'
          }),
          blockType: blockType.REPORTER,
          arguments: {
            EVENT: {
              type: argumentType.NUMBER,
              menu: 'pinEventTimestampMenu',
              defaultValue: MicroBitEvent.MICROBIT_PIN_EVT_PULSE_LO
            },
            PIN: {
              type: argumentType.STRING,
              menu: 'gpio',
              defaultValue: '0'
            }
          }
        }, '---', {
          opcode: 'getSharedData',
          text: formatMessage$2({
            id: 'mbitMore.getSharedData',
            default: 'shared data [INDEX]',
            description: 'value of the shared data'
          }),
          blockType: blockType.REPORTER,
          arguments: {
            INDEX: {
              type: argumentType.STRING,
              menu: 'sharedDataIndex',
              defaultValue: '0'
            }
          }
        }, {
          opcode: 'setSharedData',
          text: formatMessage$2({
            id: 'mbitMore.setSharedData',
            default: 'shared data [INDEX] to [VALUE]',
            description: 'set value into the shared data'
          }),
          blockType: blockType.COMMAND,
          arguments: {
            INDEX: {
              type: argumentType.STRING,
              menu: 'sharedDataIndex',
              defaultValue: '0'
            },
            VALUE: {
              type: argumentType.NUMBER,
              defaultValue: 0
            }
          }
        }, '---', {
          opcode: 'whenConnectionChanged',
          text: formatMessage$2({
            id: 'mbitMore.whenConnectionChanged',
            default: 'when micro:bit [STATE]',
            description: 'when a micro:bit connection state changed'
          }),
          blockType: blockType.HAT,
          arguments: {
            STATE: {
              type: argumentType.STRING,
              menu: 'connectionStateMenu',
              defaultValue: 'connected'
            }
          }
        }],
        menus: {
          buttons: {
            acceptReporters: true,
            items: this.BUTTONS_MENU
          },
          gestures: {
            acceptReporters: true,
            items: this.GESTURES_MENU
          },
          pinState: {
            acceptReporters: true,
            items: this.PIN_STATE_MENU
          },
          tiltDirection: {
            acceptReporters: true,
            items: this.TILT_DIRECTION_MENU
          },
          tiltDirectionAny: {
            acceptReporters: true,
            items: this.TILT_DIRECTION_ANY_MENU
          },
          analogIn: {
            acceptReporters: true,
            items: this.ANALOG_IN_MENU
          },
          digitalValue: {
            acceptReporters: true,
            items: this.DIGITAL_VALUE_MENU
          },
          sharedDataIndex: {
            acceptReporters: true,
            items: this.SHARED_DATA_INDEX_MENU
          },
          gpio: {
            acceptReporters: true,
            items: this.GPIO_MENU
          },
          axis: {
            acceptReporters: true,
            items: this.AXIS_MENU
          },
          pinMode: {
            acceptReporters: false,
            items: this.PIN_MODE_MENU
          },
          pinEventTypeMenu: {
            acceptReporters: false,
            items: this.PIN_EVENT_TYPE_MENU
          },
          pinEventMenu: {
            acceptReporters: false,
            items: this.PIN_EVENT_MENU
          },
          pinEventTimestampMenu: {
            acceptReporters: false,
            items: this.PIN_EVENT_TIMESTAMP_MENU
          },
          connectionStateMenu: {
            acceptReporters: false,
            items: this.CONNECTION_STATE_MENU
          }
        },
        // eslint-disable-next-line no-use-before-define
        translationMap: extensionTranslations
      };
    }
    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */

  }, {
    key: "whenButtonPressed",
    value: function whenButtonPressed(args) {
      if (args.BTN === 'any') {
        return this._peripheral.buttonA | this._peripheral.buttonB;
      } else if (args.BTN === 'A') {
        return this._peripheral.buttonA;
      } else if (args.BTN === 'B') {
        return this._peripheral.buttonB;
      }

      return false;
    }
    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */

  }, {
    key: "isButtonPressed",
    value: function isButtonPressed(args) {
      if (args.BTN === 'any') {
        return (this._peripheral.buttonA | this._peripheral.buttonB) !== 0;
      } else if (args.BTN === 'A') {
        return this._peripheral.buttonA !== 0;
      } else if (args.BTN === 'B') {
        return this._peripheral.buttonB !== 0;
      }

      return false;
    }
    /**
     * Test whether the micro:bit is moving
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the micro:bit is moving.
     */

  }, {
    key: "whenGesture",
    value: function whenGesture(args) {
      var gesture = cast.toString(args.GESTURE);

      if (gesture === 'moved') {
        return this._peripheral.gestureState >> 2 & 1;
      } else if (gesture === 'shaken') {
        return this._peripheral.gestureState & 1;
      } else if (gesture === 'jumped') {
        return this._peripheral.gestureState >> 1 & 1;
      }

      return false;
    }
    /**
     * Display a predefined symbol on the 5x5 LED matrix.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves after a tick.
     */

  }, {
    key: "displaySymbol",
    value: function displaySymbol(args) {
      var symbol = cast.toString(args.MATRIX).replace(/\s/g, '');

      var reducer = function reducer(accumulator, c, index) {
        var value = c === '0' ? accumulator : accumulator + Math.pow(2, index);
        return value;
      };

      var hex = symbol.split('').reduce(reducer, 0);

      if (hex !== null) {
        this._peripheral.ledMatrixState[0] = hex & 0x1F;
        this._peripheral.ledMatrixState[1] = hex >> 5 & 0x1F;
        this._peripheral.ledMatrixState[2] = hex >> 10 & 0x1F;
        this._peripheral.ledMatrixState[3] = hex >> 15 & 0x1F;
        this._peripheral.ledMatrixState[4] = hex >> 20 & 0x1F;

        this._peripheral.displayMatrix(this._peripheral.ledMatrixState);
      }

      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, BLESendInterval);
      });
    }
    /**
     * Display text on the 5x5 LED matrix.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves after the text is done printing.
     * Note the limit is 19 characters
     * The print time is calculated by multiplying the number of horizontal pixels
     * by the default scroll delay of 120ms.
     * The number of horizontal pixels = 6px for each character in the string,
     * 1px before the string, and 5px after the string.
     */

  }, {
    key: "displayText",
    value: function displayText(args) {
      var text = String(args.TEXT).substring(0, 19);
      if (text.length > 0) this._peripheral.displayText(text);
      var yieldDelay = 120 * (6 * text.length + 6);
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, yieldDelay);
      });
    }
    /**
     * Turn all 5x5 matrix LEDs off.
     * @return {Promise} - a Promise that resolves after a tick.
     */

  }, {
    key: "displayClear",
    value: function displayClear() {
      for (var i = 0; i < 5; i++) {
        this._peripheral.ledMatrixState[i] = 0;
      }

      this._peripheral.displayMatrix(this._peripheral.ledMatrixState);

      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, BLESendInterval);
      });
    }
    /**
     * Test whether the tilt sensor is currently tilted.
     * @param {object} args - the block's arguments.
     * @property {TiltDirection} DIRECTION - the tilt direction to test (front, back, left, right, or any).
     * @return {boolean} - true if the tilt sensor is tilted past a threshold in the specified direction.
     */

  }, {
    key: "whenTilted",
    value: function whenTilted(args) {
      return this._isTilted(args.DIRECTION);
    }
    /**
     * Test whether the tilt sensor is currently tilted.
     * @param {object} args - the block's arguments.
     * @property {TiltDirection} DIRECTION - the tilt direction to test (front, back, left, right, or any).
     * @return {boolean} - true if the tilt sensor is tilted past a threshold in the specified direction.
     */

  }, {
    key: "isTilted",
    value: function isTilted(args) {
      return this._isTilted(args.DIRECTION);
    }
    /**
     * @param {object} args - the block's arguments.
     * @property {TiltDirection} DIRECTION - the direction (front, back, left, right) to check.
     * @return {number} - the tilt sensor's angle in the specified direction.
     * Note that getTiltAngle(front) = -getTiltAngle(back) and getTiltAngle(left) = -getTiltAngle(right).
     */

  }, {
    key: "getTiltAngle",
    value: function getTiltAngle(args) {
      return this._getTiltAngle(args.DIRECTION);
    }
    /**
     * Test whether the tilt sensor is currently tilted.
     * @param {TiltDirection} direction - the tilt direction to test (front, back, left, right, or any).
     * @return {boolean} - true if the tilt sensor is tilted past a threshold in the specified direction.
     * @private
     */

  }, {
    key: "_isTilted",
    value: function _isTilted(direction) {
      switch (direction) {
        case MicroBitTiltDirection.ANY:
          return Math.abs(this._peripheral.tiltX / 10) >= MbitMoreBlocks.TILT_THRESHOLD || Math.abs(this._peripheral.tiltY / 10) >= MbitMoreBlocks.TILT_THRESHOLD;

        default:
          return this._getTiltAngle(direction) >= MbitMoreBlocks.TILT_THRESHOLD;
      }
    }
    /**
     * @param {TiltDirection} direction - the direction (front, back, left, right) to check.
     * @return {number} - the tilt sensor's angle in the specified direction.
     * Note that getTiltAngle(front) = -getTiltAngle(back) and getTiltAngle(left) = -getTiltAngle(right).
     * @private
     */

  }, {
    key: "_getTiltAngle",
    value: function _getTiltAngle(direction) {
      switch (direction) {
        case MicroBitTiltDirection.FRONT:
          return Math.round(this._peripheral.tiltY / -10);

        case MicroBitTiltDirection.BACK:
          return Math.round(this._peripheral.tiltY / 10);

        case MicroBitTiltDirection.LEFT:
          return Math.round(this._peripheral.tiltX / -10);

        case MicroBitTiltDirection.RIGHT:
          return Math.round(this._peripheral.tiltX / 10);

        default:
          log.warn("Unknown tilt direction in _getTiltAngle: ".concat(direction));
      }
    }
    /**
     * @param {object} args - the block's arguments.
     * @return {boolean} - the touch pin state.
     * @private
     */

  }, {
    key: "whenPinConnected",
    value: function whenPinConnected(args) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return;
      if (!this.GPIO_MENU.includes(pin.toString())) return false;
      return this._peripheral.isPinOnGrand(pin);
    } // Mbit More extended functions

    /**
     * Test the selected pin is connected to the ground.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the pin is connected.
     */

  }, {
    key: "isPinConnected",
    value: function isPinConnected(args) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return false;
      if (!this.GPIO_MENU.includes(pin.toString())) return false;
      return this._peripheral.isPinOnGrand(pin);
    }
    /**
     * Get amount of light (0 - 255) on the LEDs.
     * @return {Promise} - a Promise that resolves light level.
     */

  }, {
    key: "getLightLevel",
    value: function getLightLevel() {
      return this._peripheral.readLightLevel().then(function (level) {
        return Math.round(level * 1000 / 255) / 10;
      });
    }
    /**
     * Get temperature (integer in celsius) of micro:bit.
     * @return {Promise} - a Promise that resolves temperature.
     */

  }, {
    key: "getTemperature",
    value: function getTemperature() {
      return this._peripheral.readTemperature();
    }
    /**
     * Return angle from the north to the micro:bit heading direction.
     * @return {Promise} - a Promise that resolves compass heading angle from the north (0 - 359 degrees).
     */

  }, {
    key: "getCompassHeading",
    value: function getCompassHeading() {
      return this._peripheral.readCompassHeading();
    }
    /**
     * Return voltage of the power supply [V].
     * @return {Promise} - a Promise that resolves voltage value of the power supply.
     */

  }, {
    key: "getPowerVoltage",
    value: function getPowerVoltage() {
      return this._peripheral.readPowerVoltage();
    }
    /**
     * Return analog value of the pin.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves analog input value of the pin.
     */

  }, {
    key: "getAnalogValue",
    value: function getAnalogValue(args) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return 0;
      if (pin < 0 || pin > 2) return 0;
      return this._peripheral.readAnalogIn(pin).then(function (level) {
        return Math.round(level * 1000 / 1023) / 10;
      });
    }
    /**
     * Return digital value of the pin.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves digital input value of the pin.
     */

  }, {
    key: "getDigitalValue",
    value: function getDigitalValue(args) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return 0;
      if (!this.GPIO_MENU.includes(pin.toString())) return 0;
      return this._peripheral.readDigitalValue(pin);
    }
    /**
     * Return value of the shared data.
     * @param {object} args - the block's arguments.
     * @property {string} args.INDEX - index of the shared data.
     * @return {number} - analog value of the shared data.
     */

  }, {
    key: "getSharedData",
    value: function getSharedData(args) {
      var sharedDataIndex = parseInt(args.INDEX, 10);
      if (Number.isNaN(sharedDataIndex)) return 0;
      if (!this.SHARED_DATA_INDEX_MENU.includes(sharedDataIndex.toString())) return 0;
      return this._peripheral.getSharedData(sharedDataIndex);
    }
    /**
     * Set the shared data value.
     * @param {object} args - the block's arguments.
     * @property {string} args.INDEX - index of the shared data.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */

  }, {
    key: "setSharedData",
    value: function setSharedData(args, util) {
      var sharedDataIndex = parseInt(args.INDEX, 10);
      if (Number.isNaN(sharedDataIndex)) return;
      if (!this.SHARED_DATA_INDEX_MENU.includes(sharedDataIndex.toString())) return;
      var sharedDataValue = parseInt(args.VALUE, 10);
      if (Number.isNaN(sharedDataValue)) return;

      this._peripheral.setSharedData(sharedDataIndex, sharedDataValue, util);
    }
    /**
     * Set mode of the pin.
     * @param {object} args - the block's arguments.
     * @property {string} args.PIN - index of the pin.
     * @property {string} args.MODE - mode to set.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */

  }, {
    key: "setPinMode",
    value: function setPinMode(args, util) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return;
      if (pin < 0 || pin > 20) return;

      this._peripheral.setPinMode(pin, args.MODE, util);
    }
    /**
     * Set the pin to Output mode and level.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */

  }, {
    key: "setOutput",
    value: function setOutput(args, util) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return;
      if (pin < 0 || pin > 20) return;
      var level = parseInt(args.LEVEL, 10);
      if (isNaN(level)) return;
      level = Math.max(0, level);
      level = Math.min(level, 1);

      this._peripheral.setPinOutput(pin, level, util);
    }
    /**
     * Set the pin to PWM mode and level.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */

  }, {
    key: "setPWM",
    value: function setPWM(args, util) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return;
      if (pin < 0 || pin > 20) return;
      var level = parseInt(args.LEVEL, 10);
      if (isNaN(level)) return;
      level = Math.max(0, level);
      level = Math.min(level, 1023);

      this._peripheral.setPinPWM(pin, level, util);
    }
    /**
     * Set the pin to Servo mode and angle.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */

  }, {
    key: "setServo",
    value: function setServo(args, util) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return;
      if (pin < 0 || pin > 20) return;
      var angle = parseInt(args.ANGLE, 10);
      if (isNaN(angle)) return;
      angle = Math.max(0, angle);
      angle = Math.min(angle, 180); // let range = parseInt(args.RANGE, 10);
      // if (isNaN(range)) range = 0;
      // range = Math.max(0, range);
      // let center = parseInt(args.CENTER, 10);
      // if (isNaN(center)) range = 0;
      // center = Math.max(0, center);

      this._peripheral.setPinServo(pin, angle, null, null, util);
    }
    /**
     * Return the value of magnetic force [micro tesla] on axis.
     * @param {object} args - the block's arguments.
     * @property {AxisValues} AXIS - the axis (X, Y, Z, Absolute).
     * @return {Promise} -  a Promise that resolves value of magnetic force.
     */

  }, {
    key: "getMagneticForce",
    value: function getMagneticForce(args) {
      switch (args.AXIS) {
        case AxisValues.X:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.X;
        }).text:
          return this._peripheral.readMagneticForceX();

        case AxisValues.Y:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.Y;
        }).text:
          return this._peripheral.readMagneticForceY();

        case AxisValues.Z:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.Z;
        }).text:
          return this._peripheral.readMagneticForceZ();

        case AxisValues.Absolute:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.Absolute;
        }).text:
          return this._peripheral.readMagneticStrength();

        default:
          log.warn("Unknown axis in getMagneticForce: ".concat(args.AXIS));
      }
    }
    /**
     * Return the value of acceleration on the specified axis.
     * @param {object} args - the block's arguments.
     * @property {AxisValues} AXIS - the axis (X, Y, Z).
     * @return {Promise} - a Promise that resolves acceleration on the axis [milli-g].
     */

  }, {
    key: "getAcceleration",
    value: function getAcceleration(args) {
      switch (args.AXIS) {
        case AxisValues.X:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.X;
        }).text:
          return this._peripheral.readAccelerationX();

        case AxisValues.Y:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.Y;
        }).text:
          return this._peripheral.readAccelerationY();

        case AxisValues.Z:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.Z;
        }).text:
          return this._peripheral.readAccelerationZ();

        case AxisValues.Absolute:
        case this.AXIS_MENU.find(function (item) {
          return item.value === AxisValues.Absolute;
        }).text:
          return this._peripheral.readAccelerationStrength();

        default:
          log.warn("Unknown axis in getAcceleration: ".concat(args.AXIS));
      }
    }
    /**
     * Return pitch [degrees] of the micro:bit heading direction.
     * @return {Promise} - a Promise that resolves pitch.
     */

  }, {
    key: "getPitch",
    value: function getPitch() {
      return this._peripheral.readPitch();
    }
    /**
     * Return roll [degrees] of the micro:bit heading direction.
     * @return {Promise} - a Promise that resolves roll.
     */

  }, {
    key: "getRoll",
    value: function getRoll() {
      return this._peripheral.readRoll();
    }
    /**
     * Set listening event type at the pin.
     * @param {object} args - the block's arguments.
     * @property {string} args.PIN - index of the pin.
     * @property {string} args.EVENT_TYPE - event to listen.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves the setting.
    */

  }, {
    key: "setPinEventType",
    value: function setPinEventType(args, util) {
      var pin = parseInt(args.PIN, 10);
      if (isNaN(pin)) return;
      if (pin < 0 || pin > 20) return;
      var eventType = parseInt(args.EVENT_TYPE, 10);
      if (isNaN(eventType)) return 0;
      return this._peripheral.setPinEventType(pin, eventType, util);
    }
    /**
     * Rerutn timestamp value (micro senonds) of the event.
     * @param {object} args - the block's arguments.
     * @property {string} args.PIN - index of the pin.
     * @property {string} args.EVENT - event value to get.
     * @param {object} util - utility object provided by the runtime.
     * @return {number} - timestamp of the event.
     */

  }, {
    key: "getPinEventTimestamp",
    value: function getPinEventTimestamp(args) {
      var pinIndex = parseInt(args.PIN, 10);
      if (isNaN(pinIndex)) return 0;
      if (pinIndex < 0 || pinIndex > 20) return 0;
      var event = parseInt(args.EVENT, 10);
      if (isNaN(event)) return 0;
      return this._peripheral.getPinEventTimestamp(pinIndex, event);
    }
    /**
     * Test whether the event rose at the pin.
     * @param {object} args - the block's arguments.
     * @property {string} args.EVENT - event to catch.
     * @return {boolean} - true if the event rose.
     */

  }, {
    key: "whenPinEvent",
    value: function whenPinEvent(args) {
      var pinIndex = parseInt(args.PIN, 10);
      if (isNaN(pinIndex)) return false;
      var event = parseInt(args.EVENT, 10);
      if (isNaN(event)) return 0;
      var prevTimestamp = this.getLastEventTimestamp(pinIndex, event);

      var lastTimestamp = this._peripheral.getPinEventTimestamp(pinIndex, event);

      this.setLastEventTimestamp(pinIndex, event, lastTimestamp);
      if (lastTimestamp === 0) return false;
      return prevTimestamp !== lastTimestamp;
    }
    /**
     * Return timestamp of the event at the pin.
     * @param {number} pinIndex - index of the pin.
     * @param {number} event - event to get timestamp.
     * @return {number} - timestamp of the event.
     */

  }, {
    key: "getLastEventTimestamp",
    value: function getLastEventTimestamp(pinIndex, event) {
      if (this.lastEvents[pinIndex] && this.lastEvents[pinIndex][event]) {
        return this.lastEvents[pinIndex][event];
      }

      return 0;
    }
    /**
     * Hold timestamp of the event at the pin.
     * @param {number} pinIndex - index of the pin.
     * @param {number} event - event to be save.
     * @param {number} timestamp - timestamp value of the event.
     */

  }, {
    key: "setLastEventTimestamp",
    value: function setLastEventTimestamp(pinIndex, event, timestamp) {
      if (!this.lastEvents[pinIndex]) this.lastEvents[pinIndex] = {};
      this.lastEvents[pinIndex][event] = timestamp;
    }
    /**
     * Test whether a micro:bit connected.
     * @param {object} args - the block's arguments.
     * @property {string} args.STATE - the state of connection to check.
     * @return {boolean} - true if the state is matched.
     */

  }, {
    key: "whenConnectionChanged",
    value: function whenConnectionChanged(args) {
      var state = args.STATE === 'connected';
      return state === this._peripheral.isConnected();
    }
    /**
     * Setup format-message for this extension.
     */

  }, {
    key: "setupTranslations",
    value: function setupTranslations() {
      var localeSetup = formatMessage$2.setup();

      if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(localeSetup.translations[localeSetup.locale], // eslint-disable-next-line no-use-before-define
        extensionTranslations[localeSetup.locale]);
      }
    }
  }]);

  return MbitMoreBlocks;
}();

var extensionTranslations = {
  'ja': {
    'mbitMore.isPinConnected': 'ピン [PIN] がつながった',
    'mbitMore.lightLevel': '明るさ',
    'mbitMore.temperature': '温度',
    'mbitMore.compassHeading': '北からの角度',
    'mbitMore.magneticForce': '磁力 [AXIS]',
    'mbitMore.acceleration': '加速度 [AXIS]',
    'mbitMore.pitch': 'ピッチ',
    'mbitMore.roll': 'ロール',
    'mbitMore.analogValue': 'ピン [PIN] のアナログレベル',
    'mbitMore.powerVoltage': '電源電圧',
    'mbitMore.digitalValue': 'ピン [PIN] のデジタルレベル',
    'mbitMore.getSharedData': '共有データ [INDEX]',
    'mbitMore.setSharedData': '共有データ [INDEX] を [VALUE] にする',
    'mbitMore.setPinMode': 'ピン [PIN] を [MODE] 入力にする',
    'mbitMore.setOutput': 'ピン [PIN] をデジタルレベル [LEVEL] にする',
    'mbitMore.setPWM': 'ピン [PIN] をアナログレベル [LEVEL] にする',
    'mbitMore.setServo': 'ピン [PIN] をサーボ [ANGLE] 度にする',
    'mbitMore.digitalValueMenu.Low': '0',
    'mbitMore.digitalValueMenu.High': '1',
    'mbitMore.axisMenu.x': 'x',
    'mbitMore.axisMenu.y': 'y',
    'mbitMore.axisMenu.z': 'z',
    'mbitMore.axisMenu.absolute': '大きさ',
    'mbitMore.pinModeMenu.pullNone': '開放',
    'mbitMore.pinModeMenu.pullUp': 'プルアップ',
    'mbitMore.pinModeMenu.pullDown': 'プルダウン',
    'mbitMore.setPinEventType': 'ピン [PIN] で [EVENT_TYPE] ',
    'mbitMore.pinEventTypeMenu.none': 'イベントを受けない',
    'mbitMore.pinEventTypeMenu.edge': 'エッジタイプのイベントを受ける',
    'mbitMore.pinEventTypeMenu.pulse': 'パルスタイプのイベントを受ける',
    'mbitMore.whenPinEvent': 'ピン [PIN] で [EVENT] イベントが上がった',
    'mbitMore.pinEventMenu.rise': 'ライズ',
    'mbitMore.pinEventMenu.fall': 'フォール',
    'mbitMore.pinEventMenu.pulseHigh': 'ハイパルス',
    'mbitMore.pinEventMenu.pulseLow': 'ローパルス',
    'mbitMore.getPinEventTimestamp': 'ピン [PIN] の [EVENT]',
    'mbitMore.pinEventTimestampMenu.rise': 'ライズの時刻',
    'mbitMore.pinEventTimestampMenu.fall': 'フォールの時刻',
    'mbitMore.pinEventTimestampMenu.pulseHigh': 'ハイパルスの期間',
    'mbitMore.pinEventTimestampMenu.pulseLow': 'ローパルスの期間',
    'mbitMore.connectionStateMenu.connected': 'つながった',
    'mbitMore.connectionStateMenu.disconnected': '切れた',
    'mbitMore.whenConnectionChanged': 'micro:bit と[STATE]とき'
  },
  'ja-Hira': {
    'mbitMore.isPinConnected': 'ピン [PIN] がつながった',
    'mbitMore.lightLevel': 'あかるさ',
    'mbitMore.temperature': 'おんど',
    'mbitMore.compassHeading': 'きたからのかくど',
    'mbitMore.magneticForce': 'じりょく [AXIS]',
    'mbitMore.acceleration': 'かそくど [AXIS]',
    'mbitMore.pitch': 'ピッチ',
    'mbitMore.roll': 'ロール',
    'mbitMore.analogValue': 'ピン [PIN] のアナログレベル',
    'mbitMore.powerVoltage': 'でんげんでんあつ',
    'mbitMore.digitalValue': 'ピン [PIN] のデジタルレベル',
    'mbitMore.getSharedData': 'きょうゆうデータ [INDEX]',
    'mbitMore.setSharedData': 'きょうゆうデータ [INDEX] を [VALUE] にする',
    'mbitMore.setPinMode': 'ピン [PIN] を [MODE] にゅうりょくにする',
    'mbitMore.setOutput': 'ピン [PIN] をデジタルレベル [LEVEL] にする',
    'mbitMore.setPWM': 'ピン [PIN] をアナログレベル [LEVEL] にする',
    'mbitMore.setServo': 'ピン [PIN] をサーボ [ANGLE] どにする',
    'mbitMore.digitalValueMenu.Low': '0',
    'mbitMore.digitalValueMenu.High': '1',
    'mbitMore.axisMenu.x': 'x',
    'mbitMore.axisMenu.y': 'y',
    'mbitMore.axisMenu.z': 'z',
    'mbitMore.axisMenu.absolute': 'おおきさ',
    'mbitMore.pinModeMenu.pullNone': 'かいほう',
    'mbitMore.pinModeMenu.pullUp': 'プルアップ',
    'mbitMore.pinModeMenu.pullDown': 'プルダウン',
    'mbitMore.setPinEventType': 'ピン [PIN] で [EVENT_TYPE]',
    'mbitMore.pinEventTypeMenu.none': 'イベントをうけない',
    'mbitMore.pinEventTypeMenu.edge': 'エッジタイプのイベントをうける',
    'mbitMore.pinEventTypeMenu.pulse': 'パルスタイプのイベントをうける',
    'mbitMore.whenPinEvent': 'ピン [PIN] で [EVENT] イベントがあがった',
    'mbitMore.pinEventMenu.rise': 'ライズ',
    'mbitMore.pinEventMenu.fall': 'フォール',
    'mbitMore.pinEventMenu.pulseHigh': 'ハイパルス',
    'mbitMore.pinEventMenu.pulseLow': 'ローパルス',
    'mbitMore.getPinEventTimestamp': 'ピン [PIN] の [EVENT]',
    'mbitMore.pinEventTimestampMenu.rise': 'ライズのじかん',
    'mbitMore.pinEventTimestampMenu.fall': 'フォールのじかん',
    'mbitMore.pinEventTimestampMenu.pulseHigh': 'ハイパルスのきかん',
    'mbitMore.pinEventTimestampMenu.pulseLow': 'ローパルスのきかん',
    'mbitMore.connectionStateMenu.connected': 'つながった',
    'mbitMore.connectionStateMenu.disconnected': 'きれた',
    'mbitMore.whenConnectionChanged': 'micro:bit と[STATE]とき'
  },
  'pt-br': {
    'mbitMore.isPinConnected': 'O Pino[PIN] está conectado?',
    'mbitMore.lightLevel': 'Intensidade da Luz',
    'mbitMore.compassHeading': 'Está em direção ao Norte',
    'mbitMore.magneticForce': 'Força Magnética [AXIS]',
    'mbitMore.acceleration': 'Aceleração no Eixo[AXIS]',
    'mbitMore.analogValue': 'Ler Pino Analógico [PIN]',
    'mbitMore.getSharedData': 'Dados compartilhados [INDEX]',
    'mbitMore.setSharedData': 'Definir dados compartilhados [INDEX] com valor [VALUE]',
    'mbitMore.setInput': 'Definir Pino[PIN] como entrada',
    'mbitMore.setOutput': 'Definir pino digital[PIN] como:[LEVEL]',
    'mbitMore.setPWM': 'Definir pino PWM[PIN]com[LEVEL]',
    'mbitMore.setServo': 'Definir Servo no pino [PIN]com ângulo de [ANGLE]॰',
    'mbitMore.digitalValueMenu.Low': 'desligado',
    'mbitMore.digitalValueMenu.High': 'ligado'
  },
  'pt': {
    'mbitMore.isPinConnected': 'O Pino[PIN] está conectado?',
    'mbitMore.lightLevel': 'Intensidade da Luz',
    'mbitMore.compassHeading': 'Está em direção ao Norte',
    'mbitMore.magneticForce': 'Força Magnética [AXIS]',
    'mbitMore.acceleration': 'Aceleração no Eixo[AXIS]',
    'mbitMore.analogValue': 'Ler Pino Analógico [PIN]',
    'mbitMore.getSharedData': 'Dados compartilhados [INDEX]',
    'mbitMore.setSharedData': 'Definir dados compartilhados [INDEX] com valor [VALUE]',
    'mbitMore.setInput': 'Definir Pino[PIN] como entrada',
    'mbitMore.setOutput': 'Definir pino digital[PIN] como:[LEVEL]',
    'mbitMore.setPWM': 'Definir pino PWM[PIN]com[LEVEL]',
    'mbitMore.setServo': 'Definir Servo no pino [PIN]com ângulo de [ANGLE]॰',
    'mbitMore.digitalValueMenu.Low': 'desligado',
    'mbitMore.digitalValueMenu.High': 'ligado'
  }
};
var blockClass = MbitMoreBlocks; // loadable-extension needs this line.

var _microbitMore = MbitMoreBlocks;
_microbitMore.blockClass = blockClass;

export { _microbitMore as __moduleExports, blockClass, entry };
