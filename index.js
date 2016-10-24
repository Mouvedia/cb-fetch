;(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define([], factory);
  else if (typeof exports === 'object' && !!exports && !exports.nodeType) {
    if (typeof module === 'object' && !!module && module.exports)
        module.exports = factory();
    else
        exports.default = factory();
  } else if (typeof YUI === 'function' && YUI.add)
    YUI.add('request', factory, '0.9.0-alpha.8');
  else
    root.request = factory();
})((function () {
  try {
    return Function('return this')() || (42, eval)('this');
  } catch (e) {
    return self;
  }
})(), function () {

  function XHR() {
    if (self.XMLHttpRequest
    /*@cc_on@if(@_jscript_version<9)
      && options.method !== 'PATCH'
    @else
      && options.method !== 'PATCH' && document.documentMode >= 9
    @end@*/)
      return new self.XMLHttpRequest();
    /*@cc_on@if(@_jscript_version>=5)else {
      var progIDs = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];

      for (var i = 0; i < progIDs.length; ++i) {
        try { return new self.ActiveXObject(progIDs[i]) }
        catch (e) {}
      }
    } @end@*/
  }

  function setQueryString() {
    while (options.url.endsWith('?'))
      options.url = options.url.substring(0, options.url.length - 1);
    var prefix  = options.url.has('?') ? '&' : '?',
        EURIC   = self.encodeURIComponent;

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
      /*@cc_on@if(@_jscript_version>=5)@*/
      throw new TypeError();
      /*@end@*/
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

  function setRequestHeaders(xhr) {
    var headers = {},
        key, entries, pair, name, value, separator;

    if (self.Headers && Object.prototype.toString.call(options.headers) === '[object Headers]') {
      // exclude Firefox 34–43
      if (options.headers.entries) {
        entries = options.headers.entries();
        while (!(pair = entries.next()).done) {
          name      = pair.value[0];
          value     = pair.value[1];
          separator = name === 'Cookie' ? '; ' : ', ';
          if (value)
            headers[name] = headers[name] ? headers[name] + separator + value : value;
        }
      }
    } else
      for (key in options.headers) {
        separator = key === 'Cookie' ? '; ' : ', ';
        if (options.headers[key])
          headers[key] = (headers[key] ? headers[key] + separator : '') + options.headers[key];
      }
    for (key in headers) xhr.setRequestHeader(key, headers[key]);

    // https://bugs.chromium.org/p/chromium/issues/detail?id=128323#c3
    // https://technet.microsoft.com/library/security/ms04-004
    if (!headers.Authorization && options.username)
      xhr.setRequestHeader('Authorization', 'Basic ' + self.btoa(options.username + ':' + (options.password || '')));
  }

  function hasResponse(xhr) {
    if (typeof xhr.responseType === 'string') {
      if (xhr.responseType === 'text')
        return !!xhr.responseText;
      if (xhr.responseType === 'document' || xhr.responseType === 'msxml-document')
        return !!xhr.responseXML;
      return !!xhr.response;
    }
    if (typeof xhr.responseText === 'string')
      return !!xhr.responseText;
    if (typeof xhr.responseXML === 'object')
      return !!xhr.responseXML;
    return false;
  }

  function errorHandler(error) {
    self.console && self.console.error && self.console.error(error);
  }

  function xhrPath(onSuccess, onFail) {
    var xhr = XHR(),
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

          /*@cc_on@if(@_jscript_version>=5)@*/
          try {
            if ((xhr.status >= 200 && xhr.status < 300) ||
                (xhr.status == 304 || xhr.status == 1223) ||
                // Android status 206
                // applicationCache IDLE
                // Opera status 304
                (xhr.status === 0 && hasResponse(xhr)))
              onSuccess(xhr);
            else if (onFail)
              onFail(xhr);
          // Firefox status 408
          // IE9 error c00c023f
          } catch (e) {
            errorHandler(e);
            onFail && onFail(xhr);
          }
          /*@end@*/

          xhr = null;
        }
    };

    xhr.open(options.method, options.url, true, options.username, options.password);

    if (options.responseType) {
        /*@cc_on@if(@_jscript_version>=5)@*/
        try {
          xhr.responseType = options.responseType;
        } catch (e) {
          errorHandler(e);
        }
        /*@end@*/
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
        if (self.Response.prototype.blob)
          return response.blob();
      case 'formdata':
        // https://bugs.chromium.org/p/chromium/issues/detail?id=455103
        if (self.Response.prototype.formData)
          return response.formData();
      default:
        return response;
    }
  }

  function processURL(url) {
    options.url = url.href;
    options.username = options.username || url.username;
    options.password = options.password || url.password;
  }

  function processInput(input) {
    if (String.isString(input))
      options.url = input;
    else if (self.URL && Object.prototype.toString.call(input) === '[object URL]')
      processURL(input);
    else if (typeof input === 'object' && !!input) {
      options = input;
      if (self.URL && Object.prototype.toString.call(options.url) === '[object URL]')
        processURL(options.url);
    } else
      /*@cc_on@if(@_jscript_version>=5)@*/
      throw new TypeError();
      /*@end@*/
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
    var cfg = typeof onSuccess === 'object' && !!onSuccess ? onSuccess : {
      success: onSuccess,
      error:   onFail
    };

    /*@cc_on@if(@_jscript_version>=5)@*/
    if (typeof cfg.success !== 'function')
      throw new TypeError('A success callback must be provided.');
    if (typeof cfg.error !== 'undefined' && typeof cfg.error !== 'function')
      throw new TypeError('The failure callback must be a function.');
    /*@end@*/

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
      xhrPath(cfg.success, cfg.error);
  };

  function addVerb(verb) {
    request[verb] = function (url) {
      var supportBody = /^(patch|post|put)$/.test(verb),
          action  = supportBody ? 'send' : 'query',
          payload = supportBody ? 'body' : 'parameters',
          context = {};

      options.url = url || options.url;
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