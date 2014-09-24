;(function(root) {
  'use strict';

  /**
   * The drey object to be exported by the library. If available, it is exported
   * using underscore/Lo-Dash mixins, or via CommonJS or and AMD loader.
   *
   * @var {object} Object on which all library functions exist
   */
  var drey = {};

  drey.getIn = function(object, keys, defaultVal) {
    var i, length;

    if (typeof keys === 'undefined') {
      return object;
    }

    if (typeof defaultVal === 'undefined') {
      defaultVal = null;
    }

    if (!(keys instanceof Array)) {
      keys = ('' + keys).split('.');
    }

    length = keys.length;
    for (i = 0; i < length; i++) {
      if (!(keys[i] in object)) {
        return defaultVal;
      }

      object = object[keys[i]];
    }

    return object;
  };

  drey.updateIn = function(object, keys, fn, args) {
    var i, length, current;

    if (typeof keys === 'undefined') {
      return object;
    }

    // Handle variable number of arguments
    if (arguments.length > 3) {
      args = [];
      for (i = 3; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }

    if (typeof defaultVal === 'undefined') {
      defaultVal = null;
    }

    if (!(keys instanceof Array)) {
      keys = ('' + keys).split('.');
    }

    current = object;
    length = keys.length;

    // Iterate and throw if a property is undefined
    for (i = 0; i < length; i++) {
      if (!(keys[i] in current)) {
        throw new Error('Could not find path in object: ' + keys);
      }

      current = current[keys[i]];
    }

    args = [current].concat(args);
    current = fn.apply(args);

    return object;
  };

  drey.setIn = function(object, keys, val) {
    var i, length, current;

    if (typeof keys === 'undefined') {
      return object;
    }

    if (typeof defaultVal === 'undefined') {
      defaultVal = null;
    }

    if (!(keys instanceof Array)) {
      keys = ('' + keys).split('.');
    }

    current = object;
    length = keys.length;

    // Iterate and set undefined keys to an empty object along the path
    for (i = 0; i < length; i++) {
      if (typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      }

      if (i < length - 1) {
        current = current[keys[i]];
      }
    }

    current[keys[i]] = val;
  };

  /**
   * Export for various environments.
   */

  // Export CommonJS
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = drey;
    } else {
      exports.drey = drey;
    }
  }

  // Register with AMD
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define('drey', [], function() {
      return drey;
    });
  }

  if (root._ && root._.mixin) {
    // underscore/Lo-Dash integration
    root._.mixin(drey);
  } else {
    // export default drey object
    root.drey = drey;
  }
}(this));
