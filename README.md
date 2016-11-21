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
  var request = require('cb-fetch').default;
  </code></pre>
</details>

<details>
  <summary>YUI</summary>
  <pre><code>
  YUI().use('cb-fetch', function (Y) {
    var request = Y.default;
  });
  </code></pre>
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
  timeout:    0,
  etc:        '…'
}).done({
  success: onSuccessCallback,
  error:   onFailCallback,
  process: true
});
```

## API

### Map

```
(?: Options | Request | Options.url) => Object
                                        ├── done
                                        ├── get
                                        │   ├─ done
                                        │   └─ query
                                        │      └─ done
                                        ├── head
                                        │   ├─ done
                                        │   └─ query
                                        │      └─ done
                                        ├── delete
                                        │   ├─ done
                                        │   └─ query
                                        │      └─ done
                                        ├── patch
                                        │   ├─ done
                                        │   └─ send
                                        │      └─ done
                                        ├── post
                                        │   ├─ done
                                        │   └─ send
                                        │      └─ done
                                        └── put
                                            ├─ done
                                            └─ send
                                               └─ done
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

#### done

```
{
  (onSuccess: Function, onFail?: Function),
  ({success: Function, error?: Function, process = true: Boolean, XHR?: Settings})
} => Void, throws: TypeError
```

## Properties

### Request Options
Property     | Default       | Value(s)
--------     | -------       | --------
body         | null          | ArrayBuffer, Blob, Document[²](#XHR), FormData, String, URLSearchParams[¹](#fetch)
cache        | 'default'     | 'default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'
credentials  | 'same-origin' | 'include', 'omit'[¹](#fetch), 'same-origin'
headers      | {}            | Headers, Object
mediaType[²](#XHR)|          | String
method       | 'GET'         | String
mode[¹](#fetch)|'same-origin'| 'cors', 'no-cors', 'same-origin'
password     | null          | String
parameters   |               | URLSearchParams, Object, String
responseType |               | 'text', 'json', 'blob', 'document'[²](#XHR), 'arraybuffer', 'formdata'[¹](#fetch)
timeout      | 0             | ℕ
username     | null          | String
url          | location.href | String, URL

### Normalized Response
Property   | Type
--------   | ----
body       | Object, String, Document[²](#XHR), ArrayBuffer, Blob, FormData[¹](#fetch), ReadableStream, null
headers    | Object
instance   | XMLHttpRequest, XDomainRequest, Response
statusCode | ℕ
statusText | String
url        | String

### XHR Settings
Property     | Default       | Type
--------     | -------       | ----
mozAnon      | false         | Boolean
mozSystem    | false         | Boolean

<sup><a name="fetch">¹</a> fetch only<br/>
<a name="XHR">²</a> XHR only</sup>

## Gotchas
#### Delete reserved keyword
In pre-ES5 environments, the delete method requires the use of the bracket notation.
#### URL override
By passing an URL to one of the HTTP verb methods you effectively reset the `url` property.
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
- [x] URL
- [ ] [FormData](../../issues/3)
- [x] Headers
- [x] Universal Module Definition
- [x] fluent API
- [ ] [caching](../../issues/4)
- [ ] [normalized response](../../issues/9)

## License
This project is licensed under the terms of the MIT license.