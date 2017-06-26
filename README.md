<a href="http://www.npmjs.com/package/cb-fetch">
  <img alt="npm version" align="right" height="18" src="https://badge.fury.io/js/cb-fetch.svg" />
</a>

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

// passing options objects enables immediate additions
request({
  url:        new URL('http://www.example.com'),
  parameters: new URLSearchParams('key1=value1&key2=value2'),
  method:     'get'
}).done({
  success: onSuccessCallback,
  error:   onFailCallback
});

// once a default config is set
var init = {
  mode:              'cors',
  credentials:       'include',
  responseType:      'json',
  responseMediaType: 'application/json',
  parameters: {
    _csrf: 'USER_TOKEN_GOES_HERE'
  }
};

// it can be shared by ensuing requests
request('http://www.example.com', init)
  .done(onSuccessCallback);
```

## API

### Map

```
(?: Options | Request | Options.url, defaults?: Options)
=> Object ┬──● done
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
parameters        |          | URLSearchParams, Object, String
responseMediaType²|          | String
responseType      |          | 'text', 'json', 'blob', 'document', 'arraybuffer', 'formdata'¹, 'moz-blob', 'moz-chunked-arraybuffer', 'moz-chunked-text', 'ms-stream', 'msxml-document'
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
