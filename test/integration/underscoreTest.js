var expect = require('expect.js');
var _      = require('underscore');
var hoops   = require('../../lib/hoops');
_.mixin(hoops);

describe('underscore with hoops as a mixin', function() {
  var object;

  beforeEach(function() {
    object = {foo: {bar: {baz: 'test'}}};
  });

  it('has direct access to getIn', function() {
    var res = _.getIn(object, 'foo.bar.baz');
    expect(res).to.eql('test');
  });

  it('can chain getIn', function() {
    var res = _(object).chain().getIn('foo.bar.baz').value();
    expect(res).to.eql('test');
  });

  it('has direct access to isIn', function() {
    var res = _.isIn(object, 'foo.bar.baz');
    expect(res).to.be(true);
  });

  it('can chain isIn', function() {
    var res = _(object).chain().isIn('foo.bar.baz').value();
    expect(res).to.eql(true);
  });

  it('has direct access to invokeIn', function() {
    var invoked;
    object.foo.bar.baz = function() {
      invoked = true;
    };

    var res = _.invokeIn(object, 'foo.bar.baz');
    expect(res).to.be(object);
    expect(invoked).to.be(true);
  });

  it('can chain invokeIn', function() {
    var invoked;
    object.foo.bar.baz = function() {
      invoked = true;
    };

    var res = _(object).chain().invokeIn('foo.bar.baz').value();
    expect(res).to.eql(object);
    expect(invoked).to.be(true);
  });

  it('has direct access to updateIn', function() {
    var res = _.updateIn(object, 'foo.bar.baz', 'updated');
    expect(res.foo.bar.baz).to.eql('updated');
  });

  it('can chain updateIn', function() {
    var res = _(object).chain().updateIn('foo.bar.baz', 'updated').value();
    expect(res.foo.bar.baz).to.eql('updated');
  });

  it('has direct access to setIn', function() {
    var res = _.setIn(object, 'test.nested.prop', 'new');
    expect(res.test.nested.prop).to.be('new');
    expect(res.foo).to.eql(object.foo);
  });

  it('can chain setIn', function() {
    var res = _(object).chain().setIn('test.nested.prop', 'new').value();
    expect(res.test.nested.prop).to.be('new');
    expect(res.foo).to.eql(object.foo);
  });
});
