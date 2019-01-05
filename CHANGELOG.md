# Change Log

## [Unreleased][4]

### Fixed
* match the document's MIME type to a **parameter-less** Content-Type header
* `URL`
  * extract credentials in a cross-browser manner
  * strip the credentials

### Added
* TypeScript declaration file
* fetch
  * `timeout` callback
  * `timeout` option

### Changed
* verb methods accept paths as argument
* the query method appends
* plain object parameters serialization
  * array support
  * `undefined` properties get skipped
  * `null` properties emulate `name="isindex"`
* fetch
  * invalid JSON throws
  * `abort` becomes a no-op after completion

### Removed
* `caching` option

## [1.5.0][3] - 2018-09-25

### Fixed
* IE10+ support in the context of a web worker
* XDR Content-Type header is set in a timely manner

### Added
* jspm shortname
* hooks
* cancellation
* download monitoring
* XHR
  * timeout fallback
  * multipart option
  * caching option

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

## [1.0.0][2] - 2018-05-10

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
[2]: https://github.com/Mouvedia/cb-fetch/compare/d5c09ea...1.0.0?w=true
[3]: https://github.com/Mouvedia/cb-fetch/releases/tag/1.5.0
[4]: https://github.com/Mouvedia/cb-fetch/compare/1.5.0...HEAD