;(function (root, factory) {
  if (typeof define == 'function' && define.amd)
    define(['@string/isstring'], factory);
  else if (typeof exports == 'object' && !!exports && !exports.nodeType) {
    require('@string/isstring');
    if (typeof module == 'object' && !!module && module.exports)
      module.exports = factory();
    else
      exports['default'] = factory();
  } else if (typeof YUI == 'function' && YUI.add)
    YUI.add('cb-fetch', function (Y) { Y['default'] = factory(); }, '1.11.0');
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
  return function (input) {
    var request           = {},
        options           = {},
        processedResponse = {},
        hooks             = {},
        HAS_SIGNAL             = self.Request && Request.prototype.hasOwnProperty('signal'),
        HAS_BODY               = self.Response && Response.prototype.hasOwnProperty('body'),
        SUPPORT_MSXML_DOCUMENT = self.hasOwnProperty && self.hasOwnProperty('ActiveXObject') && self.navigator.msPointerEnabled,
        SUPPORT_MOZ_JSON       = self.document && typeof self.document.mozFullScreen == 'boolean' && !IDBIndex.prototype.count,
        cbs;

    function errorHandler(error) {
      self.console &&
      self.console.error &&
      self.console.error(error.message || error.description || error);
    }

    function raiseException(msg, type) {
      type = type || 'TypeError';

      throw new (self[type] || self.Error)(msg);
    }

    function XHR() {
      var subset = /^(GET|POST|HEAD|PUT|DELETE|MOVE|PROPFIND|PROPPATCH|MKCOL|COPY|LOCK|UNLOCK|OPTIONS)$/,
          anon   = options.credentials === 'omit' ? { mozAnon: true } : void 0;

      if (self.XMLHttpRequest
      /*@cc_on@if(@_jscript_version<9)
        && subset.test(options.method)
      @else
        && (self.WorkerGlobalScope || document.documentMode >= 9 || subset.test(options.method))
      @end@*/) {
        if (anon && self.AnonXMLHttpRequest)
          return new AnonXMLHttpRequest();
        try {
          return new XMLHttpRequest(anon);
        } catch (e) {
          return new XMLHttpRequest();
        }
      }/*@cc_on@if(@_jscript_version>=5)else {
        var progIDs = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];

        for (var i = 0; i < progIDs.length; ++i) {
          try { return new ActiveXObject(progIDs[i]) }
          catch (e) {}
        }
      } @end@*/
    }

    function appendField(name, value) {
      options.url += self.encodeURIComponent(name);
      if (value !== null) options.url += '=' + self.encodeURIComponent(value);
    }

    function getAppender() {
      var prefix = /^[^?]+\?/.test(options.url) ? '&' : '?';

      return function (name, value) {
        if (typeof value === 'undefined') return;
        options.url += prefix;
        if (value && value.constructor === Array) {
          for (var len = value.length, i = 0, j = 0; i < len; ++i) {
            if (typeof value[i] === 'undefined') continue;
            if (j) options.url += '&';
            appendField(name + '[' + j++ + ']', value[i]);
          }
        } else
          appendField(name, value);
        prefix = '&';
      }
    }

    function isHeaders(instance) {
      return self.Headers && Object.prototype.toString.call(instance) === '[object Headers]';
    }

    function addQueryString(parameters) {
      var append = getAppender();

      if (self.URLSearchParams && Object.prototype.toString.call(parameters) === '[object URLSearchParams]')
        parameters = parameters.toString();
      if (parameters && String.isString(parameters)) {
        var pairs = parameters.split('&'),
            len   = pairs.length,
            pair, i;

        for (i = 0; i < len; ++i) {
          pair = pairs[i].split('=');
          append(pair[0], pair[1]);
        }
      } else if (typeof parameters == 'object')
        for (var key in parameters) append(key, parameters[key]);
    }

    function overrideMethod() {
      var headers     = options.headers,
          verb        = options.method,
          isSafe      = /^(HEAD|OPTIONS|PROPFIND|REPORT|SEARCH)$/.test(verb),
          XHTTPMethod = /^(PUT|MERGE|PATCH|DELETE)$/.test(verb);

      options.method = isSafe ? 'GET' : 'POST';

      if (isHeaders(headers)) {
        headers.set('X-HTTP-Method-Override', verb);
        headers.set('X-METHOD-OVERRIDE', verb);
        XHTTPMethod && headers.set('X-HTTP-Method', verb);
      } else {
        setHeader('X-HTTP-Method-Override', verb);
        setHeader('X-METHOD-OVERRIDE', verb);
        XHTTPMethod && setHeader('X-HTTP-Method', verb);
      }
    }

    function getHeader(headers, name) {
      var key = name.toLowerCase();

      for (var k in headers) {
        if (k.toLowerCase() === key && headers[k])
          return headers[k];
      }
    }

    function setHeader(name, value) {
      var headers = options.headers,
          key     = name.toLowerCase();

      for (var k in headers) {
        if (k.toLowerCase() === key)
          delete headers[k];
      }
      headers[name] = value;
    }

    function setRequestHeader(name, value) {
      var headers = options.headers;

      if (isHeaders(headers))
        headers.get(name) || headers.set(name, value);
      else if (!getHeader(headers, name))
        headers[name] = value;
    }

    function assignHeaders(target, source) {
      var keys = {};

      for (var key in source) {
        var k = key.toLowerCase(),
            v = source[key];

        if (keys[k]) key = keys[k];
        else keys[k] = key;

        appendHeader(target, key, v);
      }
      return target;
    }

    function appendHeader(headers, name, value) {
      var separator = name.toLowerCase() === 'cookie' ? '; ' : ', ';

      if (value)
        headers[name] = headers[name] ? headers[name] + separator + value : value;
      else if (!headers[name])
        headers[name] = '';
    }

    function HeadersToObject(instance) {
      var headers = {},
          entries, pair;

      // https://bugzilla.mozilla.org/show_bug.cgi?id=1108181
      if (instance.entries) {
        entries = instance.entries();
        while (!(pair = entries.next()).done) appendHeader(headers, pair.value[0], pair.value[1]);
      } else
        errorHandler('The Header instance is not iterable.');
      return headers;
    }

    function setRequestHeaders(xhr) {
      var headers = {};

      if (options.mode !== 'cors')
        setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      if (self.URLSearchParams && Object.prototype.toString.call(options.body) === '[object URLSearchParams]')
        setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      if (isHeaders(options.headers))
        headers = HeadersToObject(options.headers);
      else
        assignHeaders(headers, options.headers);

      for (var key in headers) xhr.setRequestHeader(key, headers[key]);
    }

    function getXML(XML) {
      if (XML) {
        // <= IE9
        if (XML.parseError && XML.parseError != 0)
          errorHandler('XML Parsing Error: ' + XML.parseError.reason);
        // <= Gecko 50
        else if (XML.documentElement && XML.documentElement.tagName === 'parsererror')
          errorHandler(XML.documentElement.firstChild.data.split('\n', 1)[0]);
        else if (XML.documentElement)
          return XML;
      }
      return null;
    }

    function concatBufferSource(accumulator, current) {
      var array = new Uint8Array(accumulator.byteLength + current.byteLength);

      array.set(accumulator);
      array.set(current, accumulator.byteLength);
      return current.length ? array : array.buffer;
    }

    function concatResponse(response, aggregate) {
      if (response.byteLength)
        return concatBufferSource(aggregate, response);
      if (response.length)
        return aggregate + response;
    }

    function sliceResponse(response, aggregate) {
      if (response.length)
        return response.slice(aggregate.length);
      if (response.slice)
        return response.slice(aggregate.size);
      if (response.mozSlice)
        return response.mozSlice(aggregate.size);
    }

    function setDownloadHandlers(xhr) {
      var loaded, total, hasContentLength, chunked, chunk, aggregate;

      if (self.AnonXMLHttpRequest && !options.responseMediaType)
        options.responseMediaType = 'application/octet-stream';

      function convertEvent(e) {
        if (typeof hasContentLength != 'boolean')
          hasContentLength = e.totalSize ? e.totalSize !== 0xffffffffffffffff : !!e.lengthComputable;

        return {
          chunk: chunk,
          aggregate: aggregate,
          loaded: e.loaded || e.position,
          total: hasContentLength ? e.total || e.totalSize : 0,
          lengthComputable: hasContentLength
        };
      }

      xhr.onprogress = function (e) {
        var response = typeof xhr.response == 'undefined' ? xhr.responseText : xhr.response;

        if (typeof chunked != 'boolean')
          chunked = typeof xhr.responseType == 'string' && ~xhr.responseType.indexOf('chunked');
        if (aggregate) {
          chunk = chunked ? response : sliceResponse(response, aggregate);
          aggregate = chunked ? concatResponse(response, aggregate) : response;
        } else
          chunk = aggregate = response;

        if (e.loaded || e.position) {
          hooks.download(convertEvent(e));
          loaded = e.loaded;
          total = e.total;
        }
      };

      // https://bugzilla.mozilla.org/show_bug.cgi?id=687087#c1
      // https://bugzilla.mozilla.org/show_bug.cgi?id=614352
      xhr.onload = function (e) {
        var response = typeof xhr.response == 'undefined' ? xhr.responseText : xhr.response,
            length   = e.loaded || total ||
                       response && response.size ||
                       +getExposedHeader('content-length');

        if (typeof e.loaded != 'number' || length <= loaded)
          return;

        hooks.download({
          chunk: aggregate ? response.slice(aggregate.length) : response,
          aggregate: response,
          loaded: length,
          total: length,
          lengthComputable: !!length
        });
      };
    }

    function reportDownload(chunk, aggregate, length) {
      hooks.download({
        chunk: chunk,
        aggregate: aggregate,
        loaded: aggregate.length,
        total: length || 0,
        lengthComputable: !!length
      });
    }

    function qualifyURL(url) {
      var a = self.document.createElement('a');

      a.href = url;
      return self.location.protocol + a.href.replace(/^https?:/, '');
    }

    function isAbsolute(url) {
      if (self.URL && Object.prototype.toString.call(url) === '[object URL]')
        url = url.href;
      return /^([a-z][-a-z\d+.]+:)?\/\//i.test(url);
    }

    function xdrPath() {
      var xdr = XDomainRequest.create(),
          abort, length;

      function fireHandler(name, arg) {
        cbs[name] && cbs[name](arg);
        hooks.loadend && hooks.loadend();
        abort = function () {};
      }

      abort = function () {
        xdr.abort();
        fireHandler('abort');
      };
      xdr.ontimeout = function () {
        fireHandler('timeout');
      };
      xdr.onerror = function () {
        fireHandler('error', { instance: xdr });
      };
      xdr.onprogress = hooks.download ? function () {
        var response = xdr.responseText,
            chunk    = length ? response.slice(length) : response;

        reportDownload(chunk, response);
        length = response.length;
      } : function () {};
      xdr.onload = function () {
        if (cbs.success) {
          processedResponse.headers = { 'Content-Type': xdr.contentType };
          processedResponse.body = getBody(xdr);
        }
        fireHandler('success', processedResponse);
      };
      if (options.timeout)
        xdr.timeout = options.timeout;
      xdr.open(options.method, qualifyURL(options.url));
      // prevents premature garbage collection
      processedResponse.instance = xdr;
      xdr.send();
      return function () { abort(); };
    }

    function getResponse(xhr) {
      if (typeof xhr.responseType == 'string') {
        switch (xhr.responseType) {
          case 'text':
          case '':
            return xhr.responseText;
          case 'document':
          case 'msxml-document':
            return getXML(xhr.responseXML);
          default:
            return typeof xhr.response == 'undefined' ?
                          xhr.responseText :
                          xhr.response;
        }
      }
      if (typeof xhr.responseXML == 'object' && xhr.responseXML)
        return getXML(xhr.responseXML);
      if (typeof xhr.responseText == 'string')
        return xhr.responseText;
    }

    function processStatus(xhr) {
      if (xhr.status >= 200 && xhr.status < 300 || (xhr.status == 304 || xhr.status == 1223) ||
          // Android status 206 // applicationCache IDLE // Opera // Firefox 3.5
          xhr.status == 0 && getResponse(xhr) ||
          // Firefox 3.6
          xhr.statusText === 'NOT MODIFIED')
        return 'success';
      return 'error';
    }

    function xhrPath() {
      var xhr           = XHR(),
          HAS_ONABORT   = typeof xhr.onabort != 'undefined',
          HAS_ONLOADEND = typeof xhr.onloadend != 'undefined',
          timeoutID;

      function fireHandler(name, arg) {
        cbs[name] && cbs[name](arg);
        !HAS_ONLOADEND && hooks.loadend && hooks.loadend();
      }

      function abort(e) {
        timeoutID && clearTimeout(timeoutID);
        if (xhr) {
          if (e && e.type === 'timeout')
            cbs.timeout && cbs.timeout();
          else if (!HAS_ONABORT)
            cbs.abort && cbs.abort();
          xhr.onreadystatechange = function () {};
          xhr.abort();
          // https://bugs.webkit.org/show_bug.cgi?id=40952
          if (!HAS_ONLOADEND && !HAS_ONABORT)
            hooks.loadend && hooks.loadend();
        }
      }

      // https://support.microsoft.com/en-us/kb/2856746
      self.attachEvent && attachEvent('onunload', abort);

      // since the XHR instance won't be reused
      // the handler can be placed before open
      xhr.onreadystatechange = function () {
        var category, response;

        if (xhr.readyState == 4) {
          timeoutID && clearTimeout(timeoutID);
          self.detachEvent && detachEvent('onunload', abort);
          xhr.onreadystatechange = function () {};

          try {
            category = processStatus(xhr);
            response = processXHR(xhr);
          // https://bugzilla.mozilla.org/show_bug.cgi?id=596634
          // Firefox status 408 // IE9 error c00c023f on abort
          } catch (e) {
            errorHandler(e);
          } finally {
            if (response)
              fireHandler(category, response);
            else
              fireHandler('error', { instance: xhr });
          }

          xhr = null;
        }
      };

      if (hooks.download && typeof xhr.onprogress != 'undefined')
        setDownloadHandlers(xhr);

      if (HAS_ONABORT)
        xhr.onabort = function () { fireHandler('abort'); };

      if (hooks.loadend && HAS_ONLOADEND)
        xhr.onloadend = hooks.loadend;

      if (options.multipart && typeof xhr.multipart == 'boolean')
        xhr.multipart = true;

      // https://bugs.chromium.org/p/chromium/issues/detail?id=128323#c3
      // https://technet.microsoft.com/library/security/ms04-004
      xhr.open(options.method, options.url, true);

      if (options.responseType) {
        try {
          xhr.responseType = options.responseType;
        } catch (e) {
          errorHandler(e);
        }
      }

      if (options.credentials === 'include' && typeof xhr.withCredentials == 'boolean')
        xhr.withCredentials = true;

      if (options.responseMediaType && xhr.overrideMimeType)
        xhr.overrideMimeType(options.responseMediaType);

      if (typeof xhr.setRequestHeader != 'undefined')
        setRequestHeaders(xhr);

      if (options.timeout) {
        if (typeof xhr.timeout == 'number') {
          xhr.timeout = options.timeout;
          xhr.ontimeout = function () { fireHandler('timeout'); };
        } else
          timeoutID = setTimeout(function () {
            abort({ type: 'timeout' });
          }, options.timeout);
      }

      xhr.send(/^(HEAD|GET)$/.test(options.method) ? null : options.body || '');
      return abort;
    }

    function initiateRequest(ctrl) {
      if (ctrl) {
        cbs.abort && ctrl.signal.addEventListener('abort', cbs.abort, { once: true });
        options.signal = ctrl.signal;
      }

      return Promise.race([
        fetch(options.url, options),
        new Promise(function (_, reject) {
          if (options.timeout)
            setTimeout(function () {
              reject({ name: 'TimeoutError', code: 23 });
            }, options.timeout);
        })
      ]);
    }

    function fetchPath() {
      var ctrl      = HAS_SIGNAL && new AbortController(),
          abort     = function () { progress && ctrl.abort(); },
          progress  = true;

      initiateRequest(ctrl)
        .then(consumeStream)
        .then(function (response) {
          progress = false;
          return response;
        })
        .then(convertResponse)
        .then(consumeBody)
        .then(storeBody)
        .then(fireHandler)
        ['catch'](function (e) {
          progress = false;
          if (e.code === 23)
            cbs.timeout && cbs.timeout();
          if (ctrl && ctrl.signal.aborted || // Firefox abuses ABORT_ERR
              e.code === 23)
            hooks.loadend && hooks.loadend();
          else
            errorHandler(e);
        });

      if (ctrl)
        return abort;
      return raiseException.bind(null, 'An abort callback must be provided.');
    }

    function fireHandler(instance) {
      if (instance.ok || instance.status == 304)
        cbs.success && cbs.success(processedResponse);
      else if (cbs.error)
        cbs.error(processedResponse);
      hooks.loadend && hooks.loadend();
    }

    function storeBody(body) {
      processedResponse.body = body;
      return processedResponse.instance;
    }

    function consumeBody(response) {
      switch (options.responseType) {
        case 'text':
        case '':
          return response.text();
        case 'document':
          return response.text().then(function (str) {
            return createDocument(str);
          });
        case 'json':
          return response.json();
        case 'arraybuffer':
          return response.arrayBuffer();
        case 'blob':
          // PhantomJS didn't support blobs until version 2.0
          if (self.Response.prototype.blob) return response.blob();
          break;
        case 'formdata':
          // https://bugs.chromium.org/p/chromium/issues/detail?id=455103
          if (self.Response.prototype.formData) return response.formData();
      }
      return response.body || null;
    }

    function consumeStream(response) {
      if (!hooks.download)
        return response;
      var clone  = response.clone(),
          reader = response.body.getReader(),
          length = +response.headers.get('Content-Length'),
          aggregate;

      function processResult(result) {
        if (result.done)
          return clone;
        var chunk = result.value;

        aggregate = aggregate ? concatBufferSource(aggregate, chunk) : chunk;
        reportDownload(chunk, aggregate, length);

        return reader.read().then(processResult);
      }
      return reader.read().then(processResult);
    }

    function convertResponse(response) {
      processedResponse.instance   = response;
      processedResponse.headers    = HeadersToObject(response.headers);
      processedResponse.statusCode = response.status;
      processedResponse.statusText = response.statusText;
      processedResponse.url        = response.url;
      return response;
    }

    function processXHR(xhr) {
      processedResponse.instance   = xhr;
      processedResponse.headers    = typeof xhr.getResponseHeader == 'undefined' ? {} : getResponseHeaders(xhr);
      processedResponse.statusCode = xhr.status === 1223 ? 204 : xhr.status;
      processedResponse.statusText = xhr.status === 1223 ? 'No Content' : xhr.statusText;
      processedResponse.url        = xhr.responseURL;
      processedResponse.body       = getBody(xhr);
      return processedResponse;
    }

    function getBody(instance) {
      var response = getResponse(instance);

      switch (options.responseType) {
        case 'document':
        case 'msxml-document':
          if (typeof response == 'string')
            return createDocument(response);
          break;
        case 'json':
          // RFC 4627
          if (typeof response != 'object') {
            try {
              return self.JSON.parse(response);
            } catch (e) {}
          }
      }
      return response;
    }

    function createDocument(serializedDocument) {
      var progIDs        = ['MSXML2.DOMDocument.6.0',
                            'MSXML2.DOMDocument.5.0',
                            'MSXML2.DOMDocument.4.0',
                            'MSXML2.DOMDocument.3.0',
                            'MSXML2.DOMDocument',
                            'Microsoft.XMLDOM',
                            'MSXML.DOMDocument'],
          queryLanguage  = options.XSLPattern ? 'XSLPattern' : 'XPath',
          implementation = self.document && self.document.implementation,
          MIMEType       = getDocumentType(),
          doc            = null,
          parser, input, i;

      if (implementation && implementation.createLSParser) {
        parser = implementation.createLSParser(1, null);
        input = implementation.createLSInput();
        input.stringData = serializedDocument;
        try {
          return parser.parse(input);
        } catch (e) {}
      } else if (self.DOMParser) {
        // https://bugzilla.mozilla.org/show_bug.cgi?id=102699
        try {
          doc = (new DOMParser()).parseFromString(serializedDocument, MIMEType);
        } catch (e) {}
        // https://bugs.chromium.org/p/chromium/issues/detail?id=265379
        if (!doc && MIMEType === 'text/html')
          return createHTMLDocument(serializedDocument);
        if (doc && doc.getElementsByTagName('parsererror').length)
          return null;
      } else if (self.ActiveXObject) {
        for (i = 0; progIDs[i]; ++i) {
          try {
            doc = new ActiveXObject(progIDs[i]);
          } catch (e) { continue; }
          if (i < 3)
            // http://msdn.microsoft.com/en-us/library/ms767616(VS.85).aspx
            doc.setProperty('NewParser', true);
          if (i === 3)
            doc.setProperty('SelectionLanguage', queryLanguage);
          try {
            doc.setProperty('ProhibitDTD', false);
          } catch (e) {}
          doc.async = false;
          return doc.loadXML(serializedDocument) ? doc : null;
        }
      }
      return doc;
    }

    function createHTMLDocument(str) {
      var implementation = self.document.implementation,
          doc, doctype;

      if (implementation.createHTMLDocument)
        doc = implementation.createHTMLDocument(null, '', null);
      else {
        doctype = implementation.createDocumentType('html', '', '');
        doc = implementation.createDocument('', 'html', doctype);
      }
      try {
        doc.documentElement.innerHTML = str;
      } catch (e) {
        doc = new ActiveXObject('htmlfile');
        doc.open();
        doc.write(str);
        doc.close();
      }
      return doc;
    }

    function getDocumentType() {
      var value = options.responseMediaType || getHeader(processedResponse.headers, 'Content-Type'),
          type  = value && value.split(';', 1)[0];

      switch (type) {
        case 'text/html':
        case 'text/xml':
        case 'application/xml':
        case 'application/xhtml+xml':
        case 'image/svg+xml':
          return type;
        default:
          return 'text/xml';
      }
    }

    function getExposedHeader(name) {
      try {
        return processedResponse.instance.getResponseHeader(name);
      } catch (e) {}
    }

    function getResponseHeaders(xhr) {
      var headers        = {},
          list           = xhr.getAllResponseHeaders(),
          exposedHeaders = !list && getExposedHeader('Access-Control-Expose-Headers'),
          fields, field, len, index, name, value, i;

      // https://bugzilla.mozilla.org/show_bug.cgi?id=608735
      if (options.mode === 'cors' && list === null) {
        // https://www.w3.org/TR/cors/#simple-response-header
        headers['Cache-Control']    = xhr.getResponseHeader('Cache-Control');
        headers['Content-Language'] = xhr.getResponseHeader('Content-Language');
        headers['Content-Type']     = xhr.getResponseHeader('Content-Type');
        headers.Expires             = xhr.getResponseHeader('Expires');
        headers['Last-Modified']    = xhr.getResponseHeader('Last-Modified');
        headers.Pragma              = xhr.getResponseHeader('Pragma');

        if (exposedHeaders && exposedHeaders !== '*') {
          // HTTP header field values can be extended over multiple lines
          // by preceding each extra line with at least one space or horizontal tab
          exposedHeaders = exposedHeaders.replace(/\s+/g, '').split(',');
          for (i = 0, len = exposedHeaders.length; i < len; ++i) {
            name = exposedHeaders[i];
            value = getExposedHeader(name);
            if (value)
              headers[name] = value;
          }
        }
      } else if (list) {
        // https://tools.ietf.org/html/rfc7230#page-26
        // https://tools.ietf.org/html/rfc7230#page-35
        fields = list.replace(/\r?\n[\t ]+/g, ' ').split(/\r?\n/);
        len    = fields.length - 1;
        for (i = 0; i < len; ++i) {
          field = fields[i];
          index = field.indexOf(': ');
          if (index > 0) {
            name  = field.substring(0, index).toLowerCase();
            value = field.substring(index + 2);
            headers[name] = value;
          }
        }
      }
      return headers;
    }

    // https://support.microsoft.com/en-us/kb/834489
    // https://bugzilla.mozilla.org/show_bug.cgi?id=709991
    function stripAuth(url) {
      var credentials = url.split('//')[1].split('@')[0].split(':');

      if (!options.username) {
        options.username = credentials[0];
        options.password = credentials[1];
      }
      return url.replace(/\/\/[^/]+@/, '//');
    }

    function setURL(url) {
      url = url.split('#')[0];

      // https://bugs.webkit.org/show_bug.cgi?id=162345
      if (/\?$/.test(url))
        url = url.slice(0, -1);

      if (/^([^#?]+:)?\/\/[^/]+@/.test(url))
        url = stripAuth(url);

      options.url = url;
    }

    function processURL(url) {
      if (String.isString(url))
        setURL(url);
      else if (self.URL && Object.prototype.toString.call(url) === '[object URL]')
        url.href && setURL(url.href);
    }

    function deriveURL(base, path) {
      var absolute = isAbsolute(base),
          url      = (absolute ? base : self.location.href).split(/[#?]/)[0],
          parts    = (absolute ? url : deriveURL(url, base)).split('/'),
          segments = path.split('/');

      if (parts.length > 3)
        parts = parts.slice(0, parts.length - 1);
      if (/^\.\//.test(path))
        url = parts.join('/') + path.slice(1);
      else if (path.charAt(0) === '/')
        url = parts[0] + '//' + parts[2] + path;
      else {
        while (segments[0] === '..') {
          if (parts.length === 3)
            break;
          parts = parts.slice(0, parts.length - 1);
          segments = segments.slice(1);
        }
        url = parts.join('/') + '/' + segments.join('/');
      }
      return url;
    }

    function processInput(input) {
      if (!input) return;
      processURL(input);
      if (!options.url && input === Object(input)) {
        options = input;
        options.url && processURL(options.url);
      }
    }

    function getMethod() {
      var method = options.method && options.method.toUpperCase() || 'GET',
          documentElement = (options.body ? options.body.ownerDocument || options.body : 0).documentElement;

      if (/^(PROPPATCH|ORDERPATCH|ACL|REPORT|BIND|UNBIND|REBIND|UPDATE|LABEL|MERGE|MKREDIRECTREF|UPDATEREDIRECTREF)$/.test(method) &&
          !documentElement)
        raiseException('The ' + method + ' method requires an XML body.');
      return method;
    }

    function setOptions() {
      options.method      = getMethod();
      options.mode        = options.mode || 'same-origin';
      options.credentials = options.credentials || 'same-origin';
      options.headers     = options.headers || {};
      options.username    = options.username || null;
      options.password    = options.password || null;
      options.redirect    = options.redirect || 'follow';
      options.signal      = null;

      // https://bugzilla.mozilla.org/show_bug.cgi?id=484396
      options.url || setURL(self.location.href);

      if (options.responseType === 'msxml-document' && !SUPPORT_MSXML_DOCUMENT)
        options.responseType = 'document';
      else if (options.responseType === 'json' && SUPPORT_MOZ_JSON)
        options.responseType = 'moz-json';
    }

    request.done = function (onSuccess, onError) {
      cbs = typeof onSuccess == 'object' && onSuccess || {
        success: onSuccess,
        error:   onError
      };

      if (options.tunneling && !/^(POST|GET)$/.test(options.method))
        overrideMethod();
      if (options.parameters)
        addQueryString(options.parameters);
      if (options.username)
        setRequestHeader('Authorization', 'Basic ' + self.btoa(options.username + ':' + (options.password || '')));

      if (hooks.loadstart && hooks.loadstart() === false)
        return function () {};
      if (/^(moz|ms)/.test(options.responseType))
        return xhrPath();
      if (typeof self.fetch == 'function' && (HAS_SIGNAL || !cbs.abort) && (HAS_BODY || !hooks.download))
        return fetchPath();
      if (options.mode === 'cors' && self.document && (self.document.documentMode == 8 || self.document.documentMode == 9))
        return xdrPath();
      return xhrPath();
    };

    request.hook = function (name, handler) {
      hooks[name] = handler;

      return this;
    };

    request.pass = function (name, value) {
      var headers = options.headers;

      if (isHeaders(name))
        options.headers = name;
      else if (name === Object(name)) {
        if (isHeaders(headers))
          for (var key in name) headers.append(key, name[key]);
        else
          options.headers = assignHeaders({}, assignHeaders(headers, name));
      } else if (String.isString(name)) {
        if (isHeaders(headers))
          headers.set(name, value);
        else
          setHeader(name, value);
      }

      return this;
    };

    function addVerb(verb) {
      request[verb] = function (url) {
        var supportBody = !/^(get|head|delete)$/.test(verb),
            action      = supportBody ? 'send' : 'query',
            context     = {};

        if (isAbsolute(url))
          processURL(url);
        else if (String.isString(url))
          setURL(deriveURL(options.url, url));
        options.method = verb.toUpperCase();

        context[action] = function (data) {
          if (supportBody)
            options.body = data || options.body;
          else if (data) {
            addQueryString(options.parameters);
            addQueryString(data);
            delete options.parameters;
          }
          return {
            done: request.done,
            hook: request.hook
          };
        };
        context.done = request.done;
        context.hook = request.hook;

        return context;
      };
    }

    addVerb('post');
    addVerb('put');
    addVerb('patch');
    addVerb('get');
    addVerb('head');
    addVerb('delete');
    processInput(input);
    setOptions();

    return request;
  };
});