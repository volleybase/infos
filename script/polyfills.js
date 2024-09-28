/**
 * Number.isFinite(value)
 */
Number.isFinite = Number.isFinite || function(value) {
  return typeof value === "number" && isFinite(value);
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

// line endings for old ie - pre still not working <= ie8
window.NL = '\n';
if (window.attachEvent && !window.addEventListener) {
  // "bad" IE (<= IE8)
  window.NL = '<br>';
}

// IE detection
var ie = (function () {
  if (window.ActiveXObject === undefined) return 0; // Not IE
  if (!window.XMLHttpRequest) return 6;
  if (!document.querySelector) return 7;
  if (!document.addEventListener) return 8;
  if (!window.atob) return 9;
  if (!document.__proto__) return 10;
  return 11;
})();

// html extension for dom parser (if it exist)
if (window.DOMParser) {
  (function(DOMParser) {
  	'use strict';

  	var proto = DOMParser.prototype,
          nativeParse = proto.parseFromString;

  	// Firefox/Opera/IE throw errors on unsupported types
  	try {
  		// WebKit returns null on unsupported types
  		if ((new DOMParser()).parseFromString('', 'text/html')) {
  			// text/html parsing is natively supported
  			return;
  		}
  	} catch (ex) {}

    proto.parseFromString = function(markup, type) {
      if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
        var doc = document.implementation.createHTMLDocument('');
        if (markup.toLowerCase().indexOf('<!doctype') > -1) {
          doc.documentElement.innerHTML = markup;
        } else {
          doc.body.innerHTML = markup;
        }
        return doc;
      } else {
        return nativeParse.apply(this, arguments);
      }
    };

  }(DOMParser));
}


if (!Array.prototype.filter){
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if (!((typeof func === 'Function' || typeof func === 'function') && this))
        throw new TypeError();

    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;
    if (thisArg === undefined){
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          if (func(t[i], i, t)){
            res[c++] = t[i];
          }
        }
      }
    }
    else{
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          if (func.call(thisArg, t[i], i, t)){
            res[c++] = t[i];
          }
        }
      }
    }

    // shrink down array to proper size
    res.length = c;

    return res;
  };
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Array.prototype.indexOf)  Array.prototype.indexOf = (function(Object, max, min){
  "use strict";
  return function indexOf(member, fromIndex) {
    if(this===null||this===undefined)throw TypeError("Array.prototype.indexOf called on null or undefined");

    var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
    if (i < 0) i = max(0, Len+i); else if (i >= Len) return -1;

    if(member===void 0) {          for(; i !== Len; ++i) if(that[i]===void 0 && i in that) return i; // undefined
    } else if(member !== member) { for(; i !== Len; ++i) if(that[i] !== that[i]) return i; // NaN
    } else                         for(; i !== Len; ++i) if(that[i] === member) return i; // all else

    return -1; // if the value was not found, then return -1
  };
})(Object, Math.max, Math.min);


// animation frame
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());
