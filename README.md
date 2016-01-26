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
request#done(onSuccess: Function, onFail = new Function)

request#del(Options.url)
request#del#done(onSuccess: Function, onFail = new Function)
request#del#query(Options.parameters)
request#del#query#done(onSuccess: Function, onFail = new Function)

request#head(Options.url)
request#head#done(onSuccess: Function, onFail = new Function)
request#head#query(Options.parameters)
request#head#query#done(onSuccess: Function, onFail = new Function)

request#get(Options.url)
request#get#done(onSuccess: Function, onFail = new Function)
request#get#query(Options.parameters)
request#get#query#done(onSuccess: Function, onFail = new Function)

request#patch(Options.url)
request#patch#done(onSuccess: Function, onFail = new Function)
request#patch#body(Options.body)
request#patch#body#done(onSuccess: Function, onFail = new Function)

request#post(Options.url)
request#post#done(onSuccess: Function, onFail = new Function)
request#post#body(Options.body)
request#post#body#done(onSuccess: Function, onFail = new Function)

request#put(Options.url)
request#put#done(onSuccess: Function, onFail = new Function)
request#put#body(Options.body)
request#put#body#done(onSuccess: Function, onFail = new Function)
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
