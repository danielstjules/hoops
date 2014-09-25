# drey

Nested property access for underscore and lodash. Also usable as a standalone
library, and available in the browser as well as for node. Tested in all
modern browsers as well as IE6+. Inspired by igorw/get-in.

[![Build Status](https://travis-ci.org/danielstjules/drey.svg?branch=master)](https://travis-ci.org/danielstjules/drey)

* [Overview](#overview)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [drey.getIn(object, keys, \[defaultValue\])](#dreygetinobject-keys-defaultvalue)
  * [drey.isIn(object, keys)](#dreyisinobject-keys)
  * [drey.invokeIn(object, keys, \[...args\])](#dreyinvokeinobject-keys-args)
  * [drey.updateIn(object, keys, value)](#dreyupdateinobject-keys-value)
  * [drey.setIn(object, keys, value)](#dreysetinobject-keys-value)

## Overview

> define: drey
>
> 1. the nest of a squirrel
>
> 2. seemingly never-ending nested objects

drey is a library for traversing and manipulating deeply nested properties in
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
How can drey help? You can achieve the same as the previous example using:

``` javascript
var namespace = drey.getIn(app, 'environment.redis.namespace');
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

Also, shout-out to Redwall and Spencer for the name.

## Installation

The library can be installed via npm:

``` bash
npm install drey
```

Or using bower:

``` bash
bower install drey
```

**NodeJS**

``` javascript
// Standalone
var drey = require('drey');

// With underscore
var _    = require('underscore');
var drey = require('drey');
_.mixin(drey);

// With lodash
var _    = require('lodash');
var drey = require('drey');
_.mixin(drey);
```

**Browser**

Simply load `drey.min.js`. For automatic integration with underscore or lodash,
the file should be loaded after either script.

## Usage

**Standalone**

Chaining is not available when using drey on its own.

``` javascript
drey.getIn(object, 'foo.bar.baz');
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

#### drey.getIn(object, keys, \[defaultValue\])

Returns the value at the nested property, if it exists. Keys may either be
an array, or a dot-delimited string of properties. If the value does not
exist, the function returns undefined, or the defaultValue if supplied.

``` javascript
var object = {foo: {bar: {baz: 'example'}}};
drey.getIn(object, 'foo.bar.baz'); // => 'example'
drey.getIn(object, ['foo', 'bar', 'baz']); // => 'example'
```

#### drey.isIn(object, keys)

Returns whether or not the nested property is defined. Keys may be an
array, or a dot-delimited string of properties.

``` javascript
var object = {foo: {bar: {baz: 'example'}}};
drey.isIn(object, 'foo.bar.baz'); // => true
drey.isIn(object, ['foo', 'bar', 'baz']); // => true
```

#### drey.invokeIn(object, keys, \[...args\])

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

drey.invokeIn(object, 'foo.bar', 10, 5); // => object
console.log(y); // 15
```

#### drey.updateIn(object, keys, value)

Updates the nested key with the given value, if it exists, and returns the
object. Keys may either be an array, or a dot-delimited string of
properties. If a key does not exist, the object is simply returned.

``` javascript
var object = {foo: {bar: { baz: 'test'}}};

drey.updateIn(object, 'foo.bar.baz.invalid', 'updatedValue'); // => object
```

#### drey.setIn(object, keys, value)

Sets the nested key to the provided value, creating objects for any
non-existent properties, and returns the supplied object. Keys may be
supplied an array, or a dot-delimited string of properties.

``` javascript
var object = {foo: {}};
drey.setIn(object, 'foo.bar.baz', 'example');
// {foo: {bar: {baz: 'example'}}}
```
