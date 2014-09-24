var expect = require('expect.js');
var drey   = require('../lib/drey.js');

describe('drey', function() {
  // if (global.mocha && ieDetected) {
  //   global.mocha.globals(['CrossStorageClient-*']);
  // }
  var object = {foo: {bar: {baz: 'test'}}};

  describe('getIn', function() {
    it('returns the value if the keys exist', function() {
      var expected = [
        {keys: ['foo'], res: object.foo},
        {keys: ['foo', 'bar'], res: object.foo.bar},
        {keys: ['foo', 'bar', 'baz'], res: object.foo.bar.baz}
      ];

      expected.forEach(function(exp) {
        var res = drey.getIn(object, exp.keys);
        expect(res).to.be(exp.res);
      });
    });

    it('returns undefined, by default, if the keys do not exist', function() {
      var keys = [
        ['bar'],
        ['foo', 'invalid'],
        ['foo', 'bar', 'invalid']
      ];

      keys.forEach(function(array) {
        var res = drey.getIn(object, array);
        expect(res).to.be(undefined);
      });
    });

    it('returns the given defaultVal when the keys do not exist', function() {
      var keys = [
        ['bar'],
        ['foo', 'invalid'],
        ['foo', 'bar', 'invalid']
      ];

      keys.forEach(function(array) {
        var res = drey.getIn(object, array, 'test');
        expect(res).to.be('test');
      });
    });

    it('accepts dot delimited properties for keys', function() {
      var expected = [
        {keys: 'foo', res: object.foo},
        {keys: 'foo.bar', res: object.foo.bar},
        {keys: 'foo.bar.baz', res: object.foo.bar.baz}
      ];

      expected.forEach(function(exp) {
        var res = drey.getIn(object, exp.keys);
        expect(res).to.be(exp.res);
      });
    });
  });

  describe('isIn', function() {
    it('returns true if the keys exist', function() {
      var keys = [
        ['foo'],
        ['foo', 'bar'],
        ['foo', 'bar', 'baz']
      ];

      keys.forEach(function(array) {
        var res = drey.isIn(object, array);
        expect(res).to.be(true);
      });
    });

    it('returns false if the keys do not exist', function() {
      var keys = [
        ['bar'],
        ['foo', 'invalid'],
        ['foo', 'bar', 'invalid']
      ];

      keys.forEach(function(array) {
        var res = drey.isIn(object, array);
        expect(res).to.be(false);
      });
    });

    it('accepts dot delimited properties for keys', function() {
      var keys = ['foo', 'foo.bar', 'foo.bar.baz'];

      keys.forEach(function(array) {
        var res = drey.isIn(object, array);
        expect(res).to.be(true);
      });
    });
  });

  describe('callIn', function() {
    var count;

    beforeEach(function() {
      count = 0;

      // Adding some nested methods
      var fn = function() {
        count++;
      };

      object.fn = fn;
      object.foo.fn = fn;
      object.foo.bar.fn = fn;
    });

    afterEach(function() {
      delete object.fn;
      delete object.foo.fn;
      delete object.foo.bar.fn;
    });

    it('invokes the function at the given key if it exists', function() {
      var keys, i, res;

      keys = [
        ['fn'],
        ['foo', 'fn'],
        ['foo', 'bar', 'fn']
      ];

      for (i = 0; i < keys.length; i++) {
        res = drey.callIn(object, keys[i]);
        expect(count).to.be(i + 1);
        expect(res).to.be(object);
      }
    });

    it('throws an exception if the key does not correspond to a fn', function() {
      var fn = function() {
        drey.callIn(object, ['foo', 'bar']);
      };

      var error = 'Could not find fn to call in object path: foo,bar';

      expect(fn).to.throwException(function(err) {
        expect(err.message).to.be(error);
      });
    });

    it('accepts a variable number of arguments to pass to the fn', function() {
      var keys, i, res, x;

      object.foo.bar.fn = function(y, z) {
        x = y + z;
      };

      res = drey.callIn(object, ['foo', 'bar', 'fn'], 10, 5);
      expect(x).to.be(15);
      expect(res).to.be(object);
    });

    it('accepts dot delimited properties for keys', function() {
      var keys, i, res;

      keys = [
        'fn',
        'foo.fn',
        'foo.bar.fn'
      ];

      for (i = 0; i < keys.length; i++) {
        res = drey.callIn(object, keys[i]);
        expect(count).to.be(i + 1);
        expect(res).to.be(object);
      }
    });
  });
});
