# drey

Nested property access for underscore and lodash. Also usable as a standalone
library, and available in the browser as well as for node. Inspired by igorw/get-in.

[![Build Status](https://travis-ci.org/danielstjules/drey.svg?branch=master)](https://travis-ci.org/danielstjules/drey)

* [Overview](#overview)
* [Installation](#installation)
* [API](#api)
  * [drey.getIn(object, keys, \[defaultValue\])](#dreygetinobject-keys-defaultvalue)
  * [drey.isIn(object, keys)](#dreyisinobject-keys)
  * [drey.invokeIn(object, keys, \[...args\])](#dreyinvokeinobject-keys-args)
  * [drey.updateIn(object, keys, value)](#dreyupdateinobject-keys-value)
  * [drey.setIn(object, keys, value)](#dreysetinobject-keys-value)
* [Other](#other)

## Overview

> define: drey
>
> 1. the nest of a squirrel
>
> 2. seemingly never-ending nested objects

drey is a library for traversing and manipulating deeply nested properties in
JavaScript. It's a set of convenience functions to help reduce some repetition.
For example, to retrieve a deeply nested configuration value from an object,
you may have:

``` javascript
var namespace;
if (app.environment && app.environment.redis && app.environment.redis.namespace) {
  namespace = app.environment.redis.namespace;
}
```

All this to avoid a TypeError resulting from trying to access a property of
an undefined value: `TypeError: Cannot read property 'redis' of undefined`.
How does drey help? You get can achieve the same as the previous example using:

``` javascript
var namespace = drey.getIn('app.environment.redis.namespace');
```

Keys may be accessed via a dot-delimited string as seen above, or by providing
an array of strings. The library also integrates nicely with both underscore
and lodash, allowing you to do:

``` javascript
_.getIn(object, 'some.nested.property').pick('id', 'name');
```

It may not offer the convenience of monads, but it certainly helps reduce
friction in dealing with these objects. Some may also wonder how this compares
to underscore-contrib or lodash-contrib:

* The contrib repos only offer getPath and hasPath (getIn, isIn)
* The libs cannot be used standalone, as they require underscore/lodash

Also, thanks to Redwall and Spencer for the name.

## Installation

The library can be installed via bower:

``` bash
bower install drey
```

Or using npm:

``` bash
npm install drey
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
and returns the object. invokeIn accepts a variable number of arguments to
be passed. If the value at the key does not exist, or is not a function,
an error is thrown.

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
object. If the key does not exist, an error is thrown.

``` javascript
var object = {foo: {bar: { baz: 'test'}}};

try {
  drey.updateIn(object, 'foo.bar.baz.invalid', 'updatedValue');
} catch (e) {
  // Could not update value
}
```

#### drey.setIn(object, keys, value)

Sets the nested key to the provided value, creating objects for any
non-existent properties, and returns the supplied object.

``` javascript
var object = {foo: {}};
drey.setIn(object, 'foo.bar.baz', 'example');
// {foo: {bar: {baz: 'example'}}}
```