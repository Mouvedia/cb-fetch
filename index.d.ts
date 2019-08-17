export = request;
export as namespace request;

declare function request(url?: RequestURL): Methods
declare function request(options?: Partial<RequestOptions>): Methods

type RequestBody =
    | BodyInit
    | Document

type ResponseType =
    | XMLHttpRequestResponseType
    | 'formdata'
    | 'moz-chunked-arraybuffer'
    | 'moz-chunked-text'
    | 'moz-blob'
    | 'msxml-document'

type Parameters =
    | string
    | Record<string, string | string[] | null | undefined>
    | URLSearchParams

type RequestURL =
    | string
    | URL

type RequestHeaders =
    | Record<string, string>
    | Headers

interface RequestOptions {
    url: RequestURL
    method: string
    headers: RequestHeaders
    parameters: Parameters
    body: RequestBody
    credentials: RequestCredentials
    mode: 'cors' | 'no-cors' | 'same-origin'
    responseType: ResponseType
    responseMediaType: string
    timeout: number
    username: string
    password: string
    multipart: boolean
    tunneling: boolean
    XSLPattern: boolean
}

interface JSONArray extends Array<JSONValue> {}
type JSONValue = string | number | boolean | null | { [name: string]: JSONValue } | JSONArray
type Callback  = () => any
type Abort     = () => void

interface XDomainRequest {
         prototype:    XDomainRequest
         new():        XDomainRequest
         create():     XDomainRequest
         onprogress:   Callback
         onload:       Callback
         onerror:      Callback
         ontimeout:    Callback
readonly responseText: string
readonly contentType:  string
         timeout:      number
         open:         (method: 'GET' | 'POST', url: string) => void
         send:         (body?: string) => void
         abort:        Abort
}

interface AnonXMLHttpRequest extends XMLHttpRequest {}

interface NormalizedResponse  {
    body: JSONValue | Blob | Document | FormData | ReadableStream | ArrayBuffer
    headers: Record<string, string>
    instance: XMLHttpRequest | XDomainRequest | Response | AnonXMLHttpRequest
    statusCode: number
    statusText: string
    url: string
}

interface ProgressEvent {
    chunk: string | ArrayBuffer | Blob | Uint8Array | null
    aggregate:	string | ArrayBuffer | Blob | Uint8Array | null
    loaded: number
    total: number
    lengthComputable: boolean
}

type Complete = (response: NormalizedResponse) => any

interface Done {
    (onSuccess?: Complete, onError?: Complete): Abort
    (callbacks?: {
        success?: Complete
        error?:   Complete
        timeout?: Callback
        abort?:   (event?: Event) => any
    }): Abort
}

interface Pass<T> {
    (name: string, value: string): T
    (headers: RequestHeaders): T
}

interface Hook<T> {
    (
        name: 'loadstart',
        handler: () => boolean | void
    ): T
    (
        name: 'download',
        handler: (event: ProgressEvent) => any
    ): T
    (
        name: 'loadend',
        handler: Callback
    ): T
}

interface Common {
    pass: Pass<this>
    hook: Hook<this>
    done: Done
}

interface Querier extends Common {
    query: (parameters?: Parameters) => Common
}

interface Sender extends Common {
    send: (body?: RequestBody) => Common
}

interface Verb<T> {
    (url?: RequestURL): T
}

interface Methods extends Common {
    get: Verb<Querier>
    delete: Verb<Querier>
    head: Verb<Querier>
    post: Verb<Sender>
    put: Verb<Sender>
    patch: Verb<Sender>
}