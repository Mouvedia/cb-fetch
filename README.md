# cb-fetch <sup><small style="font-size:small">0.9.0 α4</small></sup>

A truly **c**ross-**b**rowser and forward-compatible library to do asynchronous HTTP requests that follows the **c**all**b**ack pattern.

## Table of Contents
  - [Installation](#installation)
  - [Examples](#examples)
  - [Signatures](#signatures)
  - [Options](#options)
  - [Gotchas](#gotchas)
  - [Features](#features)
  - [License](#license)

## Installation
#### NPM
```sh
npm install --save cb-fetch
```
#### JSPM
```sh
jspm install cb-fetch=npm:cb-fetch
```

## Examples
```js
var request = require('cb-fetch');

// this looks too easy
request('http://www.example.com?key1=value1&key2=value2')
  .done(onSuccessCallback);

// being more expressive won't hurt though
request()
  .get('http://www.example.com?key1=value1&key2=value2')
  .done(onSuccessCallback);

// is it explicit enough?
request()
  .get('http://www.example.com')
  .query('key1=value1&key2=value2')
  .done(onSuccessCallback);

// granularity overkill!
request({
  url:        'http://www.example.com',
  parameters: new URLSearchParams('key1=value1&key2=value2'),
  method:     'get',
  credentials:'same-origin',
  cache:      'default',
  timeout:    0,
  etc:        '…'
}).done(onSuccessCallback, onFailCallback);
```

## Signatures
```
(?: Options | Request | Options.url) => Object
  .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
  .get(Options.url) => Object
    .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
    .query(Options.parameters) => Object
      .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
  .head(Options.url) => Object
    .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
    .query(Options.parameters) => Object
      .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
  ['delete'](Options.url) => Object
    .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
    .query(Options.parameters) => Object
      .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
  .patch(Options.url) => Object
    .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
    .send(Options.body) => Object
      .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
  .post(Options.url) => Object
    .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
    .send(Options.body) => Object
      .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
  .put(Options.url) => Object
    .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
    .send(Options.body) => Object
      .done(onSuccess: Function, onFail?: Function) => Void, throws: TypeError
```

## Options
Property | Default | Value(s)
-------- | ------- | --------
body         | null          | ArrayBuffer, Blob, Document², FormData, String, URLSearchParams¹
cache        | 'default'     | 'default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'
credentials  | 'same-origin' | 'include', 'omit'¹, 'same-origin'
headers      | {}            | Headers, Object
mediaType²   |               | String
method       | 'GET'         | String
mode¹        | 'same-origin' | 'cors', 'no-cors', 'same-origin'
password     | null          | String
parameters   |               | URLSearchParams, Object, String
responseType |               | 'text', 'json', 'blob', 'document'², 'arraybuffer', 'formdata'¹
timeout      | 0             | ℕ
username     | null          | String
url          | location.href | String

<sup>¹ fetch only
² XHR only</sup>

## Gotchas
#### Delete reserved keyword
In pre-ES5 environments, the delete method requires the use of the bracket notation.
#### URL override
By passing an URL to one of the HTTP verb methods you can effectively reset the `url` property.
#### XDR limitations
- only support GET and POST methods
- cannot set request headers
- no credentials
- same scheme restriction

## Features
- [x] fetch
- [x] XHR
- [ ] [XDR](../../issues/2)
- [ ] [Request](../../issues/5)
- [x] URLSearchParams
- [ ] [FormData](../../issues/3)
- [x] Headers
- [x] Universal Module Definition
- [x] fluent API
- [ ] [caching](../../issues/4)
- [ ] [normalized response](../../issues/9)

## License
This project is licensed under the terms of the MIT license.