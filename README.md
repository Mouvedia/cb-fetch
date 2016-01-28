# cb-fetch

A truly **c**ross-**b**rowser and forward-compatible library to do asynchronous HTTP requests that follows the **c**all**b**ack pattern.

## Table of Contents
  - [Installation](#installation)
    - [NPM](#npm)
    - [JSPM](#jspm)
  - [Examples](#examples)
  - [API](#api)
  - [Features](#features)
  - [License](#license)

## Installation
###NPM
```sh
npm install --save cb-fetch
```
###JSPM
```sh
jspm install cb-fetch=npm:cb-fetch
```
## Examples
```js
var request = require('cb-fetch');

// this looks too easy
request()
  .get('http://www.example.com?key1=value1&key2=value2')
  .done(onSuccessCallback);

// chain those methods!
request()
  .get('http://www.example.com')
  .query('key1=value1&key2=value2')
  .done(onSuccessCallback);

// is it explicit enough?
request({
          url:        'http://www.example.com',
          parameters: new URLSearchParams('key1=value1&key2=value2'),
          method:     'get',
          headers:    {},
          credentials:'same-origin',
          etc:        '…'
        }).done(onSuccessCallback, onFailCallback);
```
## API
```
interface Options {
  body = '': ArrayBuffer | Blob | Document | FormData | String,
  credentials = 'same-origin': 'include' | 'omit' | 'same-origin',
  headers: Headers | Object,
  mediaType: String,
  method = 'GET': /^(delete|get|head|patch|post|put)$/i,
  mode = 'same-origin': 'cors' | 'no-cors' | 'same-origin',
  parameters: URLSearchParams | Object | String,
  responseType: 'text' | 'json' | 'blob' | 'document' | 'arraybuffer' | 'formdata',
  timeout: ℕ,
  url = location.href: String
}

request(?: Options | Request)
  .done(onSuccess: Function, onFail?: Function) => Void
  .del|head|get(Options.url)
    .done(onSuccess: Function, onFail?: Function) => Void
    .query(Options.parameters)
      .done(onSuccess: Function, onFail?: Function) => Void
  .patch|post|put(Options.url)
    .done(onSuccess: Function, onFail?: Function) => Void
    .body(Options.body)
      .done(onSuccess: Function, onFail?: Function) => Void
```
## Features
- [x] [fetch](https://fetch.spec.whatwg.org/#fetch-method)
- [x] XHR
- [ ] XDR
- [ ] Request
- [x] URLSearchParams
- [ ] FormData
- [ ] Headers
- [x] UMD
- [x] chained methods
- [ ] caching

## License
This project is licensed under the terms of the MIT license.
