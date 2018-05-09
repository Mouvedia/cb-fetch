<a href="http://www.npmjs.com/package/cb-fetch">
  <img alt="npm version" align="right" height="18" src="https://badge.fury.io/js/cb-fetch.svg" />
</a>

# cb-fetch

A truly **c**ross-**b**rowser and forward-compatible library to do asynchronous HTTP requests that follows the **c**all**b**ack pattern.

## Table of Contents
  - [Installation](#installation)
  - [Features](#features)
  - [Importation](#importation)
  - [Examples](#examples)
  - [API](#api)
  - [Properties](#properties)
  - [Gotchas](#gotchas)
  - [License](#license)

## Installation
```sh
npm install --save cb-fetch
```

## Features
- [x] fetch
- [x] XMLHttpRequest
- [x] XDomainRequest
- [x] [Universal Module Definition](#importation)
- [x] [fluent API](#map)
- [x] [normalized response](#normalized-response)
- [x] WebDAV
- [ ] [caching](../../issues/4)
- [ ] [progress monitoring](../../issues/8)
- [ ] [HAR](../../issues/12)

## Importation

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
  YUI().use('cb-fetch', function (Y) {
    var request = Y['default'];
  });
  </code></pre>
</details>

<details open="open">
  <summary>Global Namespace</summary>
  <p>If none of the previously listed module registration methods are supported, a global variable named <code>request</code> will be exposed.</p>
</details>

## Examples
```js
// this looks too easy
request('http://www.example.com?key1=value1&key2=value2')
  .done(onSuccessCallback);

// being more expressive won't hurt though
request()
  .get('http://www.example.com?key1=value1&key2=value2')
  .done(onSuccessCallback);

// chaining methods helps separating concerns
request()
  .get('http://www.example.com')
  .query('key1=value1&key2=value2')
  .done(onSuccessCallback, onFailCallback);

// passing an object offers more granularity
request({
  url:          new URL('http://www.example.com'),
  parameters:   new URLSearchParams('_csrf=USER_TOKEN_GOES_HERE'),
  method:       'get',
  headers:      {'Accept-Language': 'en-us, en-gb;q=0.9, en;q=0.8, *;q=0.5'},
  mode:         'cors',
  credentials:  'include',
  responseType: 'json'
}).done({
  success: onSuccessCallback,
  error:   onFailCallback
});
```

## API

### Map

```
(?: Options | Request | Options.url)
=> Object ┬──● done
          ├──● loading
          │  └─● done
          │  ┌────────┐
          ├──┤ get    │
          │  │ head   │
          │  │ delete │
          │  └─┬──────┘
          │    ├─● done
          │    ├─● loading
          │    │ └─● done
          │    └─● query
          │      ├─● done
          │      └─● loading
          │        └─● done
          │  ┌───────┐
          └──┤ patch │
             │ post  │
             │ put   │
             └─┬─────┘
               ├─● done
               ├─● loading
               │ └─● done
               └─● send
                 ├─● done
                 └─● loading
                   └─● done
```

### Method Signatures

#### HTTP verbs

```
(Options.url) => Object
```

#### query

```
(Options.parameters) => Object
```

#### send

```
(Options.body) => Object
```

#### loading

```
(onProgress: Function) => Object
```

#### done

```
{
  (onSuccess: Function, onFail?: Function),
  ({
    success:   Function,
    error?:    Function,
    timeout?:  Function,
    settings?: Object
  })
} => Void, throws: TypeError
```

## Properties

### Request Options
Property     | Default       | Value(s)
--------     | -------       | --------
body         | null          | BufferSource, Blob, Document², FormData, String, URLSearchParams
cache        | 'default'     | 'default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'
credentials  | 'same‑origin' | 'include', 'omit'¹, 'same-origin'
headers      | {}            | Object, Headers³
method       | 'GET'         | String
mode         | 'same‑origin' | 'cors', 'no-cors'¹, 'same-origin'
password     | null          | String
parameters        |          | URLSearchParams, Object, String
responseMediaType²|          | String
responseType      |          | 'text', 'json', 'blob', 'document', 'arraybuffer', 'formdata'¹, 'moz-blob', 'moz-chunked-arraybuffer', 'moz-chunked-text', 'ms-stream', 'msxml-document'
timeout      | 0             | ℕ
username     | null          | String
url          | location.href | String, URL

### Normalized Response
Property   | Type
--------   | ----
body       | Object, String, Document, BufferSource, Blob, FormData¹, ReadableStream¹, null
headers    | Object
instance   | XMLHttpRequest, XDomainRequest, Response
statusCode | ℕ
statusText | String
url        | String

### Advanced Settings
Property           | Default | Type
--------           | ------- | ----
mozAnon            | false   | Boolean
mozSystem          | false   | Boolean
XSLPattern⁴        | false   | Boolean
tunneling⁵         | false   | Boolean

<sup>¹ fetch only<br/>
² XHR only<br/>
³ except Firefox 34–43<br/>
⁴ MSXML 3.0 only<br/>
⁵ method override</sup>

## Gotchas

#### `delete` reserved keyword
In pre-ES5 environments, the delete method requires the use of the bracket notation.

#### Property override
- passing an URL to one of the HTTP verb methods resets the `url` property
- passing parameters to the query method resets the `parameters` property
- passing a body to the send method resets the `body` property

#### XDR intrinsic limitations
- only support GET and POST methods
- cannot set request headers
- no credentials
- same scheme restriction
- the informational and redirection status code classes are considered errors
- the response's status code and status text are not supplied

#### Exposed headers
For the browsers powered by Gecko ≤20 to have the exposed response headers
populated into the `headers` property, the following conditions must be met:

- `Access-Control-Expose-Headers` response header exposes itself
- `Access-Control-Expose-Headers` field value is not `*`
- `mode` set to `cors`

## License
This project is licensed under the terms of the MIT license.
