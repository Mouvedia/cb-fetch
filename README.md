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
  - [Interceptors](#interceptors)
  - [Gotchas](#gotchas)
  - [License](#license)

## Installation
#### npm
```sh
npm install --save cb-fetch
```
#### jspm
```sh
jspm install cb-fetch
```

## Features
- [x] fetch
- [x] XMLHttpRequest
- [x] XDomainRequest
- [x] [Universal Module Definition](#importation)
- [x] [fluent API](#map)
- [x] [normalized response](#normalized-response)
- [x] WebDAV
- [ ] caching [#4](../../issues/4)

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
  .done(onSuccessCallback, onErrorCallback);

// chaining methods helps separating concerns
request()
  .get('http://www.example.com')
  .query('key1=value1&key2=value2')
  .done({
    success: onSuccessCallback,
    error:   onErrorCallback
  });

// passing an object offers additional options
let { done } = request({
  url:          new URL('http://www.example.com'),
  parameters:   new URLSearchParams('_csrf=TOKEN'),
  method:       'get',
  mode:         'cors',
  credentials:  'include',
  responseType: 'json'
});

// performs the actual request
let abort = done(onSuccessCallback);

// immediately aborts it
abort();

// performs another request reusing the same config
done(onSuccessCallback);
```

## API

### Map

<pre><code>(?: Options | Options.url)
=> Object ┬─────────────────────○ done
          ├─● download ─────────○ done
          │  ┌────────┐
          ├──┤ get    │
          │  │ head   │
          │  │ delete │
          │  └─┬──────┘
          │    ├────────────────○ done
          │    ├─● download ────○ done
          │    └─● query ───────○ done
          │      └─● download ──○ done
          │  ┌───────┐
          └──┤ patch │
             │ post  │
             │ put   │
             └─┬─────┘
               ├────────────────○ done
               ├─● download ────○ done
               └─● send ────────○ done
                 └─● download ──○ done
</pre></code>

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

#### download

```
({
   target:           XMLHttpRequest | XDomainRequest,
   loaded:           Number,
   total:            Number,
   lengthComputable: Boolean
}) => Object
```

#### done

```
{
  (onSuccess: Function, onError?: Function),
  ({
    success:   Function,
    error?:    Function,
    timeout?:  Function
  })
} => abort:  Function,
     throws: TypeError
```

## Properties

### Request Options
Property     | Default       | Value(s)
--------     | -------       | --------
body         | null          | BufferSource, Blob, Document², FormData, String, URLSearchParams
credentials  | 'same‑origin' | 'include', 'omit'⁶, 'same-origin'
headers      | {}            | Object, Headers³
method       | 'GET'         | String
mode         | 'same‑origin' | 'cors', 'no-cors'¹, 'same-origin'
password     | null          | String
parameters   |               | URLSearchParams, Object, String
responseMediaType² |         | String
responseType |               | 'text', 'json', 'blob', 'document', 'arraybuffer', 'formdata'¹, 'moz-blob', 'moz-chunked-arraybuffer', 'moz-chunked-text', 'moz-json', 'ms-stream', 'msxml-document'
timeout      | 0             | ℕ
username     | null          | String
url          | location.href | String, URL
multipart⁷   | false         | Boolean
hooks        |               | Object
tunneling⁵   | false         | Boolean
XSLPattern⁴  | false         | Boolean

### Normalized Response
Property   | Type
--------   | ----
body       | Object, String, Document, BufferSource, Blob, FormData¹, ReadableStream¹, null
headers    | Object
instance   | XMLHttpRequest, XDomainRequest, Response
statusCode | ℕ
statusText | String
url        | String

<sup>¹ fetch only<br/>
² XHR only<br/>
³ except Firefox 34–43<br/>
⁴ MSXML 3.0 only<br/>
⁵ method override<br/>
⁶ fetch, Firefox 16+, Presto/2.10.232–2.12.423<br/>
⁷ Gecko 1.7b–22</sup>

## Interceptors

### Before Hook

```
before() => Boolean | Void
```

### After Hook

```
after() => Void
```

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

#### Platform for Privacy Preferences

Internet Explorer’s default settings restrict the use of 3<sup>rd</sup> party cookies unless a P3P compact policy
declaration has been included through a custom HTTP response header; hence, the `"include"` credentials mode cannot be
fully honored if a cookie has been deemed unsatisfactory.

## License
This project is licensed under the terms of the MIT license.
