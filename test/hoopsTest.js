var expect = require('expect.js');
var hoops  = require('../lib/hoops.js');

describe('hoops', function() {
  var object;

  beforeEach(function() {
    object = {foo: {bar: {baz: 'test'}}};
  });

  describe('getIn', function() {
    it('returns the value if the keys exist', function() {
      var expected, i, res;

      expected = [
        {keys: ['foo'], res: object.foo},
        {keys: ['foo', 'bar'], res: object.foo.bar},
        {keys: ['foo', 'bar', 'baz'], res: object.foo.bar.baz}
      ];

      for (i = 0; i < expected.length; i++) {
        res = hoops.getIn(object, expected[i].keys);
        expect(res).to.be(expected[i].res);
      }
    });

    it('returns undefined, by default, if the keys do not exist', function() {
      var keys, i, res;

      keys = [
        ['bar'],
        ['foo', 'invalid'],
        ['foo', 'bar', 'invalid']
      ];

      for (i = 0; i < keys.length; i++) {
        res = hoops.getIn(object, keys[i]);
        expect(res).to.be(undefined);
      }
    });

    it('returns the given defaultVal when the keys do not exist', function() {
      var keys, i, res;

      keys = [
        ['bar'],
        ['foo', 'invalid'],
        ['foo', 'bar', 'invalid']
      ];

      for (i = 0; i < keys.length; i++) {
        res = hoops.getIn(object, keys[i], 'test');
        expect(res).to.be('test');
      }
    });

    it('accepts dot delimited strings for keys', function() {
      var expected, i, res;

      expected = [
        {keys: 'foo', res: object.foo},
        {keys: 'foo.bar', res: object.foo.bar},
        {keys: 'foo.bar.baz', res: object.foo.bar.baz}
      ];

      for (i = 0; i < expected.length; i++) {
        res = hoops.getIn(object, expected[i].keys);
        expect(res).to.be(expected[i].res);
      }
    });
  });

  describe('isIn', function() {
    it('returns true if the keys exist', function() {
      var keys, i, res;

      keys = [
        ['foo'],
        ['foo', 'bar'],
        ['foo', 'bar', 'baz']
      ];

      for (i = 0; i < keys.length; i++) {
        res = hoops.isIn(object, keys[i]);
        expect(res).to.be(true);
      }
    });

    it('returns false if the keys do not exist', function() {
      var keys, i, res;

      keys = [
        ['bar'],
        ['foo', 'invalid'],
        ['foo', 'bar', 'invalid']
      ];

      for (i = 0; i < keys.length; i++) {
        res = hoops.isIn(object, keys[i]);
        expect(res).to.be(false);
      }
    });

    it('accepts dot delimited strings for keys', function() {
      var keys, i, res;

      keys = ['foo', 'foo.bar', 'foo.bar.baz'];

      for (i = 0; i < keys.length; i++) {
        res = hoops.isIn(object, keys[i]);
        expect(res).to.be(true);
      }
    });
  });

  describe('invokeIn', function() {
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
        res = hoops.invokeIn(object, keys[i]);
        expect(count).to.be(i + 1);
        expect(res).to.be(object);
      }
    });

    it('returns the object if the key does not correspond to a fn', function() {
      var res = hoops.invokeIn(object, ['foo', 'bar']);
      expect(res).to.be(object);
    });

    it('accepts a variable number of arguments to pass to the fn', function() {
      var keys, i, res, x;

      object.foo.bar.fn = function(y, z) {
        x = y + z;
      };

      res = hoops.invokeIn(object, ['foo', 'bar', 'fn'], 10, 5);
      expect(x).to.be(15);
      expect(res).to.be(object);
    });

    it('accepts dot delimited strings for keys', function() {
      var keys, i, res;

      keys = [
        'fn',
        'foo.fn',
        'foo.bar.fn'
      ];

      for (i = 0; i < keys.length; i++) {
        res = hoops.invokeIn(object, keys[i]);
        expect(count).to.be(i + 1);
        expect(res).to.be(object);
      }
    });
  });

  describe('updateIn', function() {
    it('updates the value at the given key if it exists', function() {
      var res = hoops.updateIn(object, ['foo', 'bar'], 'updateInTest');
      expect(res).to.be(object);
      expect(object.foo.bar).to.be('updateInTest');
    });

    it('returns the object if the key does not exist', function() {
      var res = hoops.updateIn(object, ['foo', 'invalid'], 'updateInTest');
      expect(res).to.be(object);
    });

    it('accepts dot delimited strings for keys', function() {
      var res = hoops.updateIn(object, 'foo.bar', 'updateInTest');
      expect(res).to.be(object);
      expect(object.foo.bar).to.be('updateInTest');
    });
  });

  describe('setIn', function() {
    it('sets the value at the given key, creating objects if necessary', function() {
      var res = hoops.setIn(object, ['foo', 'newprop', 'another'], 'setInTest');
      expect(res).to.be(object);
      expect(object.foo.newprop.another).to.be('setInTest');
    });

    it('accepts dot delimited strings for keys', function() {
      var res = hoops.setIn(object, 'foo.newprop.another', 'setInTest');
      expect(res).to.be(object);
      expect(object.foo.newprop.another).to.be('setInTest');
    });
  });
});
