# cb-fetch

A truly **c**ross-**b**rowser and forward-compatible library to do asynchronous HTTP requests that follows the **c**all**b**ack pattern.

## Table of Contents
  - [Installation](#installation)
  - [Examples](#examples)
  - [API](#api)
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
## API
#### Options
Property | Default | Value(s)
-------- | ------- | --------
body         | ''            | ArrayBuffer, Blob, Document², FormData, String, URLSearchParams¹
cache        | 'default'     | 'default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'
credentials  | 'same-origin' | 'include', 'omit'¹, 'same-origin'
headers      | {}            | Headers, Object
mediaType²   |               | String
method       | 'GET'         | `/^(delete|get|head|patch|post|put)$/i`
mode¹        | 'same-origin' | 'cors', 'no-cors', 'same-origin'
parameters   |               | URLSearchParams, Object, String
responseType |               | 'text', 'json', 'blob', 'document'², 'arraybuffer', 'formdata'¹
timeout      | 0             | ℕ
url          | location.href | String

<sup>¹ fetch only
² XHR only</sup>
#### Signatures
```
request(?: Options | Request) => Object
done(onSuccess: Function, onFail?: Function) => Void
verb(Options.url) => Object
query(Options.parameters) => Object
send(Options.body) => Object

request
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
## Gotchas
#### Delete
In pre-ES5 environments, the delete method requires the use of the bracket notation.
#### XDR limitations
- only support GET and POST methods
- cannot set request headers
- no credentials
- same scheme restriction

## Features
- [x] [fetch](https://fetch.spec.whatwg.org/#fetch-method)
- [x] XHR
- [ ] XDR
- [ ] Request
- [x] URLSearchParams
- [ ] FormData
- [x] Headers
- [x] Universal Module Definition
- [x] chained methods
- [ ] caching

## License
This project is licensed under the terms of the MIT license.