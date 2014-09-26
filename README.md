![hoops](http://danielstjules.com/github/hoopslogo.png)

Nested property access and manipulation library for node and the browser.
Available as a standalone module, and integrates with underscore and lodash.
Tested in all modern browsers, and IE6+. Inspired by igorw/get-in.

[![Build Status](https://travis-ci.org/danielstjules/hoops.svg?branch=master)](https://travis-ci.org/danielstjules/hoops)

* [Overview](#overview)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [hoops.getIn(object, keys, \[defaultValue\])](#hoopsgetinobject-keys-defaultvalue)
  * [hoops.isIn(object, keys)](#hoopsisinobject-keys)
  * [hoops.invokeIn(object, keys, \[...args\])](#hoopsinvokeinobject-keys-args)
  * [hoops.updateIn(object, keys, value)](#hoopsupdateinobject-keys-value)
  * [hoops.setIn(object, keys, value)](#hoopssetinobject-keys-value)

## Overview

hoops is a library for traversing and manipulating deeply nested properties in
JavaScript. It's a set of convenience functions to help reduce some of the
repetition faced in these scenarios. For example, to retrieve a deeply nested
configuration value from an object, you may have:

``` javascript
var namespace;
if (app.environment && app.environment.redis && app.environment.redis.namespace) {
  namespace = app.environment.redis.namespace;
}
```

All this to avoid a TypeError resulting from trying to access a property of
an undefined value: `TypeError: Cannot read property 'redis' of undefined`.
How can hoops help? You can achieve the same as the previous example using:

``` javascript
var namespace = hoops.getIn(app, 'environment.redis.namespace');
```

Keys may be accessed via a dot-delimited string as seen above, or by providing
an array of strings. The library also integrates nicely with both underscore
and lodash, allowing you to do:

``` javascript
_(object).getIn('some.nested.property').pick('id', 'name');
```

It may not offer the convenience of monads, but it certainly helps reduce
friction in dealing with these objects. Some may also wonder how this compares
to underscore-contrib or lodash-contrib:

* The contrib repos only offer getPath and hasPath (getIn, isIn)
* The libs cannot be used standalone, as they require underscore/lodash

## Installation

The library can be installed via npm:

``` bash
npm install hoops
```

Or using bower:

``` bash
bower install hoops
```

**NodeJS**

``` javascript
// Standalone
var hoops = require('hoops');

// With underscore
var _     = require('underscore');
var hoops = require('hoops');
_.mixin(hoops);

// With lodash
var _     = require('lodash').runInContext();
var hoops = require('hoops');
_.mixin(hoops);
```

**Browser**

Simply load `hoops.min.js`. For automatic integration with underscore or lodash,
the file should be loaded after either script. It can also be loaded via
CommonJS and AMD.

## Usage

**Standalone**

Chaining is not available when using hoops on its own.

``` javascript
hoops.getIn(object, 'foo.bar.baz');
```

**Underscore**

Underscore chaining requires chain() and value() calls.

``` javascript
_.getIn(object, 'foo.bar.baz');
_(object).chain().getIn('foo.bar.baz').value();
```

**Lodash**

Lodash chaining only requires a value call.

``` javascript
_.getIn(object, 'foo.bar.baz');
_(object).getIn('foo.bar.baz').value();
```

## API

#### hoops.getIn(object, keys, \[defaultValue\])

Returns the value at the nested property, if it exists. Keys may either be
an array, or a dot-delimited string of properties. If the value does not
exist, the function returns undefined, or the defaultValue if supplied.

``` javascript
var object = {foo: {bar: {baz: 'example'}}};
hoops.getIn(object, 'foo.bar.baz'); // => 'example'
hoops.getIn(object, ['foo', 'bar', 'baz']); // => 'example'
```

#### hoops.isIn(object, keys)

Returns whether or not the nested property is defined. Keys may be an
array, or a dot-delimited string of properties.

``` javascript
var object = {foo: {bar: {baz: 'example'}}};
hoops.isIn(object, 'foo.bar.baz'); // => true
hoops.isIn(object, ['foo', 'bar', 'baz']); // => true
```

#### hoops.invokeIn(object, keys, \[...args\])

Invokes the function nested at the provided path of keys, if it exists,
and returns the object. The given keys may be an array, or a dot-delimited
string of properties. invokeIn accepts a variable number of arguments to
be passed. If a function at the key does not exist, the object is simply
returned.

``` javascript
var y, object;
object = {foo: {bar: function(x, z) {
  y = x + z;
}}};

hoops.invokeIn(object, 'foo.bar', 10, 5); // => object
console.log(y); // 15
```

#### hoops.updateIn(object, keys, value)

Updates the nested key with the given value, if it exists, and returns the
object. Keys may either be an array, or a dot-delimited string of
properties. If a key does not exist, the object is simply returned.

``` javascript
var object = {foo: {bar: { baz: 'test'}}};
hoops.updateIn(object, 'foo.bar.baz.invalid', 'updatedValue'); // => object
```

#### hoops.setIn(object, keys, value)

Sets the nested key to the provided value, creating objects for any
non-existent properties, and returns the supplied object. Keys may be
supplied an array, or a dot-delimited string of properties.

``` javascript
var object = {foo: {}};
hoops.setIn(object, 'foo.bar.baz', 'example');
// {foo: {bar: {baz: 'example'}}}
```
