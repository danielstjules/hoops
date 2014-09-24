var expect = require('expect.js');
var drey   = require('../lib/drey.js');

describe('drey', function() {
  // if (global.mocha && ieDetected) {
  //   global.mocha.globals(['CrossStorageClient-*']);
  // }
  var object = {foo: {bar: {baz: 'test'}}};

  describe('isIn', function() {
    describe('given an array of keys', function() {
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
    });

    describe('given a string of keys', function() {
      it('returns true if the keys exist', function() {
        var keys = ['foo', 'foo.bar', 'foo.bar.baz'];

        keys.forEach(function(array) {
          var res = drey.isIn(object, array);
          expect(res).to.be(true);
        });
      });

      it('returns false if the keys do not exist', function() {
        var keys = ['bar', 'foo.invalid', 'foo.bar.invalid'];

        keys.forEach(function(array) {
          var res = drey.isIn(object, array);
          expect(res).to.be(false);
        });
      });
    });
  });
});
