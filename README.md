![min+gzip size](https://img.shields.io/bundlephobia/minzip/cb-fetch.svg)
![min size](https://img.shields.io/bundlephobia/min/cb-fetch.svg)
![Flow](https://badgen.net/badge/_/≥0.37.0/3F6EFB?icon=flow&label)
![TypeScript](https://badgen.net/badge/_/≥2.3.0/1E7ACC?icon=typescript&label)
<a href="http://www.npmjs.com/package/cb-fetch">
  <img alt="npm version" align="right" src="https://badge.fury.io/js/cb-fetch.svg" />
</a><br/>
<a href="https://libraries.io/subscribe/1164538">
  <img alt="libraries.io" align="right" src="https://badgen.net/badge/_/subscribe/50AB50?icon=libraries&label" />
</a>

# cb-fetch

A truly **c**ross-**b**rowser and forward-compatible library to do asynchronous HTTP requests that follows the **c**all**b**ack pattern.

## Table of Contents

- [Usage](#usage)
  - [Installation](#installation)
  - [Importation](#importation)
  - [Examples](#examples)
- [Support](#support)
- [Methods](#methods)
- [Properties](#properties)
- [Gotchas](#gotchas)
- [License](#license)

## Usage

### Installation

#### npm

~~~sh
npm install --save cb-fetch
~~~

#### yarn

~~~sh
yarn add cb-fetch
~~~

#### jspm

~~~sh
jspm install cb-fetch
~~~

#### bower

~~~sh
bower install --save cb-fetch
~~~

#### jsDelivr

~~~xml
<script src="//cdn.jsdelivr.net/combine/npm/@string/isstring/isString.min.js,npm/cb-fetch/index.min.js" type="text/javascript"></script>
~~~

### Importation

<details>
  <summary><abbr title="Asynchronous Module Definition">AMD</abbr></summary>
  <pre><code>
  define(function (require) {
    var request = require('cb-fetch');
  });
  </code></pre>
</details>

<details>
<summary><abbr title="CommonJS">CJS</abbr></summary>
  <h4>standard compliant</h4>
  <pre><code>
  var request = require('cb-fetch')['default'];
  </code></pre>

  <h4>Node.js compatible</h4>
  <pre><code>
  var request = require('cb-fetch');
  </code></pre>
</details>

<details>
  <summary><abbr title="Yahoo! User Interface">YUI</abbr></summary>
  <pre><code>
  YUI({
    modules: { 'is-string': 'path/to/@string/isstring.js' }
  }).use('is-string', 'cb-fetch', function (Y) {
    var request = Y['default'];
  });
  </code></pre>
</details>

<details>
  <summary><abbr title="TypeScript">TS</abbr></summary>
  <pre><code>
  import request = require('cb-fetch');
  </code></pre>
</details>

<details open="open">
  <summary>Global Namespace</summary>
  <p>If none of the previously listed module registration methods are supported, a global variable named <code>request</code> will be exposed.</p>
</details>

### Examples

~~~js
// here's your typical request
request('http://www.example.com?key1=value1&key2=value2')
  .done(response => { /* … */ });

// taking a comprehensive approach is encouraged though
request()
  .get('http://www.example.com')
  .query('key1=value1&key2=value2')
  .done(onSuccessCallback, onErrorCallback);

// passing an object offers options not available otherwise
let abort = request({
  url:          new URL('http://www.example.com'),
  parameters:   new URLSearchParams('_csrf=TOKEN'),
  mode:         'cors',
  credentials:  'include',
  responseType: 'json'
}).get('/segment')
  .query({ foo: ['bar', 'qux'] })
  .pass('Content-Type', 'application/json')
  .hook('download', e => { /* … */ })
  .done({
    success: onSuccessCallback,
    error:   onErrorCallback,
    abort:   onAbortCallback
  });

// forcefully aborts the request
abort();
~~~

## Support

- [x] `fetch`
- [x] `XMLHttpRequest`
- [x] `XDomainRequest`
- [x] Universal Module Definition
- [x] WebDAV
- [x] TypeScript
- [x] Flow

## Methods

### get / head / delete / post / patch / put

~~~
(Options.url?) => Object
~~~

### query

~~~
(Options.parameters?) => Object
~~~

### send

~~~
(Options.body?) => Object
~~~

### hook

#### loadstart

~~~
('loadstart', () => Boolean | Void) => Object
~~~

<h4>download<img align="right" src="https://badges.herokuapp.com/browsers?firefox=%E2%89%A50.9.3&opera=%E2%89%A512&iexplore=%E2%89%A58&googlechrome=%E2%89%A51&safari=%E2%89%A54&labels=none&line=true" /></h4>

~~~
('download', Object => Any) => Object
~~~

#### loadend

~~~
('loadend', () => Any) => Object
~~~

### pass

~~~
{
  (name: String, value: String),
  (headers: Object | Headers)
} => Object
~~~

~~~js
  // assigns
  .pass(new Headers({ key: 'value' }))

  // appends
  .pass({ key: 'value' })

  // sets
  .pass('key', 'value')
~~~

### done

~~~
{
  (onSuccess?: Function, onError?: Function),
  ({
    success?:  Function,
    error?:    Function,
    timeout?:  Function,
    abort?:    Function
  })
} => () => Void,
  throws: TypeError
~~~

## Properties

### Request Options

Property     | Default       | Value(s)
--------     | -------       | --------
body         | null          | BufferSource, Blob, Document², FormData, String, URLSearchParams, ReadableStream
credentials  | 'same‑origin' | 'include', 'omit'⁶, 'same-origin'
headers      | {}            | Object, Headers³
method       | 'GET'         | String
mode         | 'same‑origin' | 'cors', 'no-cors'¹, 'same-origin'
password     | null          | String
parameters   |               | URLSearchParams, Object, String
responseMediaType² |         | String
responseType |               | 'text', 'json', 'blob', 'document', 'arraybuffer', 'formdata'¹, 'moz-blob', 'moz-chunked-arraybuffer', 'moz-chunked-text', 'msxml-document'
timeout      | 0             | ℕ
username     | null          | String
url          | location.href | String, URL
multipart⁷   | false         | Boolean
tunneling⁵   | false         | Boolean
XSLPattern⁴  | false         | Boolean

### Progress Event

Property         | Type
--------         | ----
chunk            | String, ArrayBuffer, Blob, Uint8Array, null
aggregate        | String, ArrayBuffer, Blob, Uint8Array, null
loaded           | ℕ
total            | ℕ
lengthComputable | Boolean

### Response

Property   | Type
--------   | ----
body       | Object, String, Document, ArrayBuffer, Blob, FormData¹, ReadableStream¹, null
headers    | Object
instance   | XMLHttpRequest, XDomainRequest, Response, AnonXMLHttpRequest
statusCode | ℕ
statusText | String
url        | String

<sub><sup>¹ fetch only<br/>
² XHR only<br/>
³ except Gecko 34–43<br/>
⁴ MSXML 3.0 only<br/>
⁵ method override<br/>
⁶ fetch, Gecko 16+, Presto/2.10.232–2.12.423<br/>
⁷ Gecko 1.7β–22</sup></sub>

## Gotchas

### `delete` reserved keyword

In pre-ES5 environments, the delete method requires the use of the bracket notation.

### Gecko

For the browsers powered by Gecko 1.9.1–20 to have the exposed response headers
populated into the `headers` property, the following conditions must be met:

- `Access-Control-Expose-Headers` response header exposes itself
- `Access-Control-Expose-Headers` field value is not `*`
- `mode` set to `cors`

### Trident

#### `XDomainRequest` intrinsic limitations

- only support GET and POST methods
- cannot set request headers
- no credentials
- same scheme restriction
- the informational and redirection status code classes are considered errors
- the response's status code and status text are not supplied
- same-origin requests _also_ require the server to respond with an `Access-Control-Allow-Origin` header of either `*`
or the exact URL of the requesting document

#### Platform for Privacy Preferences

Internet Explorer’s default settings restrict the use of 3<sup>rd</sup> party cookies unless a P3P compact policy
declaration has been included through a custom HTTP response header; hence, the `"include"` credentials mode cannot be
fully honored if a cookie has been deemed unsatisfactory.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMouvedia%2Fcb-fetch.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FMouvedia%2Fcb-fetch?ref=badge_large)
