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
╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                              Options                                              ║
╠═══════════════╦══════════════╦════════════════════════════════════════════════════════════════════╣
║    Default    ║   Property   ║                               Value                                ║
╠═══════════════╬══════════════╬════════════════════════════════════════════════════════════════════╣
║ ''            ║ body         ║ ArrayBuffer | Blob | Document | FormData | String                  ║
║ 'same-origin' ║ credentials  ║ 'include' | 'omit' | 'same-origin'                                 ║
║               ║ headers      ║ Headers | Object                                                   ║
║               ║ mediaType    ║ String                                                             ║
║ 'GET'         ║ method       ║ /^(delete|get|head|patch|post|put)$/i                              ║
║ 'same-origin' ║ mode         ║ 'cors' | 'no-cors' | 'same-origin'                                 ║
║               ║ parameters   ║ URLSearchParams | Object | String                                  ║
║               ║ responseType ║ 'text' | 'json' | 'blob' | 'document' | 'arraybuffer' | 'formdata' ║
║               ║ timeout      ║ ℕ                                                                  ║
║ location.href ║ url          ║ String                                                             ║
╚═══════════════╩══════════════╩════════════════════════════════════════════════════════════════════╝

done(onSuccess: Function, onFail?: Function) => Void
verb(Options.url) => Void
query(Options.parameters) => Void
send(Options.body) => Void

request(?: Options | Request)
  .done
  .verb: delete, head, get
    .done
    .query
      .done
  .verb: patch, post, put
    .done
    .send
      .done
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
