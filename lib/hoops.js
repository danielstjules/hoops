;(function(root) {
  'use strict';

  /**
   * The hoops object to be exported by the lib. If available, it is exported
   * using underscore/lodash mixins, or via CommonJS or an AMD loader.
   *
   * @var {object} Object on which all library functions exist
   */
  var hoops = {};

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
  hoops.getIn = function(object, keys, defaultValue) {
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
  hoops.isIn = function(object, keys) {
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
   * be passed. If a function at the key does not exist, the object is simply
   * returned.
   *
   * @parma   {Object}       object The target object
   * @param   {array|string} keys   List of keys to traverse
   * @param   {...*}         args   Arguments to pass to the function
   * @returns {Object}       The supplied object
   */
  hoops.invokeIn = function(object, keys) {
    var i, fn, args;

    if (typeof keys === 'undefined') {
      return object;
    }

    fn = hoops.getIn(object, keys);
    if (typeof fn !== 'function') {
      return object;
    }

    // Handle variable number of arguments
    args = [];
    if (arguments.length > 2) {
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
   * properties. If a key does not exist, the object is simply returned.
   *
   * @parma   {Object}       object The target object
   * @param   {array|string} keys   List of keys to traverse
   * @param   {*}            value  Value to set
   * @returns {Object}       The supplied object
   */
  hoops.updateIn = function(object, keys, value) {
    var i, length, current;

    if (typeof keys === 'undefined') {
      return object;
    }

    if (!(keys instanceof Array)) {
      keys = ('' + keys).split('.');
    }

    current = object;
    length = keys.length;

    // Iterate and return if a property is undefined
    for (i = 0; i < length; i++) {
      if (!(keys[i] in current)) return object;

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
  hoops.setIn = function(object, keys, value) {
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
      if (!(current[keys[i]] instanceof Object)) {
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
      module.exports = hoops;
    } else {
      exports.hoops = hoops;
    }
  }

  // Register with AMD
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define('hoops', [], function() {
      return hoops;
    });
  }

  if (root._ && root._.mixin) {
    // underscore/lodash integration
    root._.mixin(hoops);
  } else {
    // export default hoops object
    root.hoops = hoops;
  }
}(this));
