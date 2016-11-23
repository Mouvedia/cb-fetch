;(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define([], factory);
  else if (typeof exports === 'object' && !!exports && !exports.nodeType) {
    if (typeof module === 'object' && !!module && module.exports)
        module.exports = factory();
    else
        exports.default = factory();
  } else if (typeof YUI === 'function' && YUI.add)
    YUI.add('cb-fetch', function (Y) { Y.default = factory(); }, '0.9.0-alpha.9');
  else if (root.request)
    self.console &&
    self.console.warn &&
    self.console.warn('Module registration aborted! %O already exists.', root.request);
  else
    root.request = factory();
})((function () {
  try {
    return Function('return this')() || (42, eval)('this');
  } catch (e) {
    return self;
  }
})(), function () {

  function errorHandler(error) {
    self.console && self.console.error && self.console.error(error.message || error.description);
  }

  function raiseException(msg, type) {
    type = type || 'TypeError';

    throw new (self[type] || self.Error)(msg);
  }

  function XHR(flags) {
    if (self.XMLHttpRequest
    /*@cc_on@if(@_jscript_version<9)
      && options.method !== 'PATCH'
    @else
      && options.method !== 'PATCH' && document.documentMode >= 9
    @end@*/)
      return new self.XMLHttpRequest(flags);
    /*@cc_on@if(@_jscript_version>=5)else {
      var progIDs = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];

      for (var i = 0; i < progIDs.length; ++i) {
        try { return new self.ActiveXObject(progIDs[i]) }
        catch (e) {}
      }
    } @end@*/
  }

  function setQueryString() {
    var prefix = (/^[^#?]+\?/).test(options.url) ? '&' : '?',
        EURIC  = self.encodeURIComponent;

    // https://github.com/w3c/web-platform-tests/commit/d9d33e2
    options.url = options.url.split('#')[0];

    if (self.URLSearchParams && Object.prototype.toString.call(options.parameters) === '[object URLSearchParams]')
      options.parameters = options.parameters.toString();
    if (String.isString(options.parameters)) {
      var pairs  = options.parameters.split('&'),
          len    = pairs.length,
          pair, i;

      for (i = 0; i < len; ++i) {
        pair = pairs[i].split('=');
        options.url += (i ? '&' : prefix) + EURIC(pair[0]) + '=' + EURIC(pair[1]);
      }
    } else if (typeof options.parameters === 'object') {
      for (var key in options.parameters) {
          options.url += prefix + EURIC(key) + '=' + EURIC(options.parameters[key]);
          prefix = '&';
      }
    } else
      raiseException();
  }

  function setRequestMediaType() {
    var headers = options.headers,
        key;

    if (self.Headers && Object.prototype.toString.call(headers) === '[object Headers]')
      headers.get('content-type') || headers.set('Content-Type', 'application/x-www-form-urlencoded');
    else {
      for (key in headers) {
        if (key.toLowerCase() === 'content-type' && headers[key])
          return;
      }
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  function HeadersToObject(instance) {
    var headers = {},
        entries, pair, name, value, separator;

    // exclude Firefox 34–43
    if (instance.entries) {
      entries = instance.entries();
      while (!(pair = entries.next()).done) {
        name      = pair.value[0];
        value     = pair.value[1];
        separator = name === 'Cookie' ? '; ' : ', ';
        if (value)
          headers[name] = headers[name] ? headers[name] + separator + value : value;
      }
    }
    return headers;
  }

  function setRequestHeaders(xhr) {
    var headers, key, separator;

    if (self.Headers && Object.prototype.toString.call(options.headers) === '[object Headers]')
      headers = headersToObject(options.headers);
    else {
      headers = {};
      for (key in options.headers) {
        separator = key === 'Cookie' ? '; ' : ', ';
        if (options.headers[key])
          headers[key] = (headers[key] ? headers[key] + separator : '') + options.headers[key];
      }
    }
    for (key in headers) xhr.setRequestHeader(key, headers[key]);

    // https://bugs.chromium.org/p/chromium/issues/detail?id=128323#c3
    // https://technet.microsoft.com/library/security/ms04-004
    if (!headers.Authorization && options.username)
      xhr.setRequestHeader('Authorization', 'Basic ' + self.btoa(options.username + ':' + (options.password || '')));
  }

  function getResponse(xhr) {
    if (typeof xhr.responseType === 'string') {
      if (xhr.responseType === 'text')
        return xhr.responseText;
      if (xhr.responseType === 'document' || xhr.responseType === 'msxml-document')
        return xhr.responseXML;
      return xhr.response;
    }
    if (typeof xhr.responseText === 'string')
      return xhr.responseText;
    if (typeof xhr.responseXML === 'object')
      return xhr.responseXML;
  }

  function xhrPath(cfg) {
    var xhr     = XHR(cfg.XHR),
        success = cfg.success,
        fail    = cfg.error,
        cleanExit;

    // https://support.microsoft.com/en-us/kb/2856746
    if (self.attachEvent) {
      cleanExit = function () {
        xhr.onreadystatechange = function () {};
        xhr.abort();
      };
      self.attachEvent('onunload', cleanExit);
    }

    // since the XHR instance won't be reused
    // the handler can be placed before open
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          self.detachEvent && self.detachEvent('onunload', cleanExit);
          xhr.onreadystatechange = function () {};

          try {
            if ((xhr.status >= 200 && xhr.status < 300) ||
                (xhr.status == 304 || xhr.status == 1223) ||
                // Android status 206
                // applicationCache IDLE
                // Opera status 304
                (xhr.status === 0 && getResponse(xhr)))
              success(xhr);
            else if (fail)
              fail(xhr);
          // Firefox status 408
          // IE9 error c00c023f
          } catch (e) {
            errorHandler(e);
            fail && fail(xhr);
          }

          xhr = null;
        }
    };

    xhr.open(options.method, options.url, true, options.username, options.password);

    if (options.responseType) {
        try {
          xhr.responseType = options.responseType;
        } catch (e) {
          errorHandler(e);
        }
    }

    if (options.credentials === 'include' && typeof xhr.withCredentials === 'boolean')
      xhr.withCredentials = true;

    if (options.timeout && typeof xhr.timeout === 'number')
      xhr.timeout = options.timeout;

    if (options.mediaType && xhr.overrideMimeType)
      xhr.overrideMimeType(options.mediaType);

    if (xhr.setRequestHeader)
      setRequestHeaders(xhr);

    xhr.send(/^(POST|PUT|PATCH)$/.test(options.method) ? (options.body || '') : null);
  }

  function processStatus(response) {
    return Promise[(response.ok || response.status == 304) ? 'resolve' : 'reject'](response);
  }

  function consumeBody(response) {
    switch (options.responseType) {
      case 'text':
      case 'moz-chunked-text':
      case '':
        return response.text();
      case 'json':
        return response.json();
      case 'arraybuffer':
      case 'moz-chunked-arraybuffer':
        return response.arrayBuffer();
      case 'blob':
      case 'moz-blob':
        // PhantomJS didn't support blobs until version 2.0
        return response[self.Response.prototype.blob ? 'blob' : 'valueOf']();
      case 'formdata':
        // https://bugs.chromium.org/p/chromium/issues/detail?id=455103
        if (self.Response.prototype.formData)
          return response.formData();
      default:
        return response;
    }
  }

  // https://support.microsoft.com/en-us/kb/834489
  function stripAuth(url) {
    var credentials;

    if ((/^([^#?]+:)?\/\/[^\/]+@/).test(url)) {
      credentials      = url.split('//')[1].split('@')[0].split(':');
      if (!options.username) {
        options.username = credentials[0];
        options.password = credentials[1];
      }
      return url.replace(/\/\/[^\/]+@/, '//');
    }
    return url;
  }

  function processURL(url) {
    if (String.isString(url.href)) {
      if (!options.username) {
        options.username = url.username;
        options.password = url.password;
      }
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1195820
      url.username = url.password = '';
      options.url = url.href;
    } else
      raiseException();
  }

  function processInput(input) {
    if (String.isString(input))
      options.url = stripAuth(input);
    else if (self.URL && Object.prototype.toString.call(input) === '[object URL]')
      processURL(input);
    else if (typeof input === 'object' && !!input) {
      options = input;
      if (self.URL && Object.prototype.toString.call(options.url) === '[object URL]')
        processURL(options.url);
      else if (String.isString(options.url))
        options.url = stripAuth(options.url);
    } else
      raiseException();
  }

  var request = {},
      options = {},
      init = function (input) {
    processInput(input);

    // https://bugzilla.mozilla.org/show_bug.cgi?id=484396
    options.url         = options.url || self.location.href;
    options.method      = (options.method && options.method.toUpperCase()) || 'GET';
    options.mode        = options.mode || 'same-origin';
    options.credentials = options.credentials || 'same-origin';
    options.headers     = options.headers || {};
    options.username    = options.username || null;
    options.password    = options.password || null;
    options.mediaType   = options.mediaType || options.contentType || options.MIMEType;

    return request;
  };

  request.done = function (onSuccess, onFail) {
    var cfg = typeof onSuccess === 'object' && onSuccess || {
      success: onSuccess,
      error:   onFail
    };

    if (typeof cfg.success !== 'function')
      raiseException('A success callback must be provided.');
    if (typeof cfg.error !== 'undefined' && typeof cfg.error !== 'function')
      raiseException('The failure callback must be a function.');

    if (/^(POST|PUT|PATCH)$/.test(options.method))
      setRequestMediaType();
    else if (options.parameters)
      setQueryString();

    if (self.fetch && !self.fetch.nodeType)
      self.fetch(options.url, options)
        .then(processStatus)
        .then(consumeBody)
        .then(cfg.success, cfg.error);
    else
      xhrPath(cfg);
  };

  function addVerb(verb) {
    request[verb] = function (url) {
      var supportBody = /^(patch|post|put)$/.test(verb),
          action  = supportBody ? 'send' : 'query',
          payload = supportBody ? 'body' : 'parameters',
          context = {};

      if (self.URL && Object.prototype.toString.call(url) === '[object URL]')
        processURL(url);
      else if (String.isString(url))
        options.url = stripAuth(url);
      options.method = verb.toUpperCase();

      context[action] = function (data) {
        options[payload] = data || options[payload];
        return { done: request.done };
      };
      context.done = request.done;

      return context;
    };
  }

  addVerb('post');
  addVerb('put');
  addVerb('patch');
  addVerb('get');
  addVerb('head');
  addVerb('delete');

  return init;
});