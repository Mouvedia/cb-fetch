# Change Log

## [1.0.0-rc.0][3]
* proper handling of XML parsing errors
* the `headers` property is now automatically populated with the exposed headers listed in the Access-Control-Expose-Headers HTTP response header

## [1.0.0-beta.2][2]
* XDR
* timeout callback
* automatic document parsing
* XSL pattern query language option for Trident-based browsers
* response normalization
* YUI module
* minification
* XHR constructor parameter support for Gecko-powered browsers

## [0.9.0-alpha.4–9][1]
* automatically extract credentials from the URL
* `;` separator for the Cookie HTTP header field value in accordance with [RFC 2109](https://www.ietf.org/rfc/rfc2109.txt)
* URL instance support
* polymorphic done method

[1]: https://github.com/Mouvedia/cb-fetch/compare/b15a26f...d5c09ea
[2]: https://github.com/Mouvedia/cb-fetch/releases/tag/1.0.0-beta.2
[3]: https://github.com/Mouvedia/cb-fetch/releases/tag/1.0.0-rc.0