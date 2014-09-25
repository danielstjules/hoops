;(function(root) {
  'use strict';

  /**
   * The drey object to be exported by the lib. If available, it is exported
   * using underscore/lodash mixins, or via CommonJS or an AMD loader.
   *
   * @var {object} Object on which all library functions exist
   */
  var drey = {};

  /**
   * Returns the value at the nested property, if it exists. Keys may either be
   * an array, or a dot-delimited string of properties. If the value does not
   * exist, the function returns undefined, or the defaultValue if supplied.
   *
   * @parma   {Object}       object       The target object
   * @param   {array|string} keys         List of keys to traverse
   * @param   {*}            defaultValue The value to return if not defined
   * @returns {*}            The value at the nested property
   */
  drey.getIn = function(object, keys, defaultValue) {
    var i, length;

    if (typeof keys === 'undefined') {
      return object;
    }

    if (!(keys instanceof Array)) {
      keys = ('' + keys).split('.');
    }

    length = keys.length;
    for (i = 0; i < length; i++) {
      if (!(keys[i] in object)) return defaultValue;

      object = object[keys[i]];
    }

    return object;
  };

  /**
   * Returns whether or not the nested property is defined. Keys may be an
   * array, or a dot-delimited string of properties.
   *
   * @parma   {Object}       object The target object
   * @param   {array|string} keys   List of keys to traverse
   * @returns {boolean}      Whether or not the nested property is defined
   */
  drey.isIn = function(object, keys) {
    var i, length;

    if (typeof keys === 'undefined') {
      return false;
    }

    if (!(keys instanceof Array)) {
      keys = ('' + keys).split('.');
    }

    length = keys.length;
    for (i = 0; i < length; i++) {
      if (!(keys[i] in object)) return false;

      object = object[keys[i]];
    }

    return true;
  };

  /**
   * Invokes the function nested at the provided path of keys, if it exists,
   * and returns the object. The given keys may be an array, or a dot-delimited
   * string of properties. invokeIn accepts a variable number of arguments to
   * be passed. If the value at the key does not exist, or is not a function,
   * an error is thrown.
   *
   * @parma   {Object}       object The target object
   * @param   {array|string} keys   List of keys to traverse
   * @param   {...*}         args   Arguments to pass to the function
   * @returns {Object}       The supplied object
   * @throws  {Error}        If the key does not contain a function
   */
  drey.invokeIn = function(object, keys) {
    var i, fn, args;

    if (typeof keys === 'undefined') {
      return object;
    }

    fn = drey.getIn(object, keys);

    if (typeof fn !== 'function') {
      throw new Error('Could not find fn to invoke in object path: ' + keys);
    }

    // Handle variable number of arguments
    if (arguments.length > 2) {
      args = [];
      for (i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }

    fn.apply(null, args);

    return object;
  };

  /**
   * Updates the nested key with the given value, if it exists, and returns the
   * object. Keys may either be an array, or a dot-delimited string of
   * properties. If a key does not exist, an error is thrown.
   *
   * @parma   {Object}       object The target object
   * @param   {array|string} keys   List of keys to traverse
   * @param   {*}            value  Value to set
   * @returns {Object}       The supplied object
   * @throws  {Error}        If the key does not contain a function
   */
  drey.updateIn = function(object, keys, value) {
    var i, length, current;

    if (typeof keys === 'undefined') {
      return object;
    }

    if (!(keys instanceof Array)) {
      keys = ('' + keys).split('.');
    }

    current = object;
    length = keys.length;

    // Iterate and throw if a property is undefined
    for (i = 0; i < length; i++) {
      if (!(keys[i] in current)) {
        throw new Error('Could not find path in object to update: ' + keys);
      }

      if (i < length - 1) {
        current = current[keys[i]];
      }
    }

    current[keys[i - 1]] = value;

    return object;
  };

  /**
   * Sets the nested key to the provided value, creating objects for any
   * non-existent properties, and returns the supplied object. Keys may be
   * supplied an array, or a dot-delimited string of properties.
   *
   * @parma   {Object}       object The target object
   * @param   {array|string} keys   List of keys to traverse
   * @param   {*}            value  Value to set
   * @returns {Object}       The supplied object
   */
  drey.setIn = function(object, keys, value) {
    var i, length, current;

    if (typeof keys === 'undefined') {
      return object;
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

    current[keys[i - 1]] = value;

    return object;
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
    // underscore/lodash integration
    root._.mixin(drey);
  } else {
    // export default drey object
    root.drey = drey;
  }
}(this));
