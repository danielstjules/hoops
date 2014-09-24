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
});
