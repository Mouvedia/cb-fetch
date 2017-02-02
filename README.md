# cb-fetch

A truly **c**ross-**b**rowser and forward-compatible library to do asynchronous HTTP requests that follows the **c**all**b**ack pattern.

## Table of Contents
  - [Installation](#installation)
  - [Importation](#importation)
  - [Examples](#examples)
  - [API](#api)
  - [Properties](#properties)
  - [Gotchas](#gotchas)
  - [Features](#features)
  - [License](#license)

## Installation
```sh
npm install --save cb-fetch
```

## Importation

<details>
  <summary>AMD</summary>
  <pre><code>
  define(function (require) {
    var request = require('cb-fetch');
  });
  </code></pre>
</details>

<details>
  <summary>Node.js</summary>
  <pre><code>
  var request = require('cb-fetch');
  </code></pre>
</details>

<details>
  <summary>CJS</summary>
  <pre><code>
  var request = require('cb-fetch')['default'];
  </code></pre>
</details>

<details>
  <summary>YUI</summary>
  <pre><code>
  YUI().use('cb-fetch', function (Y) {
    var request = Y['default'];
  });
  </code></pre>
</details>

<details open>
  <summary>Global Namespace</summary>
  <p>If all four of the module registration methods fail, a global variable named `request` will be exposed.</p>
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

// is it explicit enough?
request()
  .get('http://www.example.com')
  .query('key1=value1&key2=value2')
  .done(onSuccessCallback, onFailCallback);

// granularity overkill!
request({
  url:        new URL('http://www.example.com'),
  parameters: new URLSearchParams('key1=value1&key2=value2'),
  method:     'get',
  credentials:'same-origin',
  cache:      'default',
  mode:       'same-origin',
  timeout:    0,
  etc:        '…'
}).done({
  success: onSuccessCallback,
  error:   onFailCallback
});
```

## API

### Map

```
(?: Options | Request | Options.url) => Object
                                        ├──● done
                                        ├──● progress
                                        │  └─● done
                                        │  ┌────────┐
                                        ├──┤ get    │
                                        │  │ head   │
                                        │  │ delete │
                                        │  └─┬──────┘
                                        │    ├─● done
                                        │    ├─● progress
                                        │    │ └─● done
                                        │    └─● query
                                        │      ├─● done
                                        │      └─● progress
                                        │        └─● done
                                        │  ┌───────┐
                                        └──┤ patch │
                                           │ post  │
                                           │ put   │
                                           └─┬─────┘
                                             ├─● done
                                             ├─● progress
                                             │ └─● done
                                             └─● send
                                               ├─● done
                                               └─● progress
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

#### progress

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
body         | null          | ArrayBuffer, Blob, Document², FormData, String, URLSearchParams
cache        | 'default'     | 'default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'
credentials  | 'same‑origin' | 'include', 'omit'¹, 'same-origin'
headers      | {}            | Object, Headers³
method       | 'GET'         | String
mode         | 'same‑origin' | 'cors', 'no-cors'¹, 'same-origin'
password     | null          | String
parameters                  || URLSearchParams, Object, String
responseMediaType²          || String
responseType                || 'text', 'json', 'blob', 'document', 'arraybuffer', 'formdata'¹, 'moz-blob', 'moz-chunked-arraybuffer', 'moz-chunked-text', 'ms-stream', 'msxml-document'
timeout      | 0             | ℕ
username     | null          | String
url          | location.href | String, URL

### Normalized Response
Property   | Type
--------   | ----
body       | Object, String, Document, ArrayBuffer, Blob, FormData¹, ReadableStream¹, null
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

<sup>¹ fetch only<br/>
² XHR only<br/>
³ except Firefox 34–43<br/>
⁴ MSXML 3.0 only</sup>

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
You will have to manually extract the exposed headers from the instance if **all** of the following conditions are met:

- browser powered by Gecko ≤20
- `mode` set to `cors`
- `credentials` set to `same-origin`
- [`Access-Control-Expose-Headers` set to `*`](https://github.com/whatwg/fetch/issues/252)

## Features
- [x] fetch
- [x] XHR
- [x] XDR
- [x] Universal Module Definition
- [x] fluent API
- [ ] [caching](../../issues/4)
- [x] normalized response
- [ ] [HAR](../../issues/12)
- [x] WebDAV

## License
This project is licensed under the terms of the MIT license.