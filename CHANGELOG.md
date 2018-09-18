# Change Log

## [Unreleased][6]

### Fixed
* IE10+ support in the context of a web worker
* XDR Content-Type header is set in a timely manner

### Added
* jspm shortname
* hooks
* cancellation
* timeout fallback
* multipart option
* caching option
* download monitoring

### Changed
* `'msxml-document'` responseType falls back to `'document'` if not supported
* `'omit'` credentials mode support for older versions of Firefox and Opera
* advanced settings were folded into the options
* restrict the non-standard response types to XHR
* success callback is optional
* if AMD is the chosen format, `String.isString`'s module ID must be `'@string/isstring'`

### Removed
* `mozSystem` flag support
* undocumented signal option

## [1.0.0][5] - 2018-05-10

### Final Release
* normalized handling of credentials
* handle obsolete line folding during parsing of HTTP header field values
* support line feed as a line terminator
* all exceptions thrown while extracting exposed headers are now swallowed
* work around XDR same scheme restriction

### Release Candidate 2
* consistent handling of invalid JSON
* options and the processed response are now properly reset during the init phase

### Release Candidate 1
* WebDAV optimizations
* verb tunneling using custom HTTP header fields
* proper handling of XML parsing errors
* the `headers` property is now automatically populated with the exposed headers listed in the Access-Control-Expose-Headers HTTP response header

### Beta 2
* XDR
* timeout callback
* automatic document parsing
* XSL pattern query language option for Trident-based browsers
* response normalization
* YUI module
* XHR constructor parameter support for Gecko-powered browsers

## [0.9.0-alpha.4–9][1]
* automatically extract credentials from the URL
* `;` separator for the Cookie HTTP header field value in accordance with [RFC 2109](https://www.ietf.org/rfc/rfc2109.txt)
* URL instance support
* polymorphic done method

[1]: https://github.com/Mouvedia/cb-fetch/compare/b15a26f...d5c09ea
[5]: https://github.com/Mouvedia/cb-fetch/compare/d5c09ea...1.0.0?w=true
[6]: https://github.com/Mouvedia/cb-fetch/compare/1.0.0...HEAD