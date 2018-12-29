export = request;
export as namespace request;

declare function request(options?: Partial<request.RequestOptions>): request.Methods
declare function request(url?: request.RequestURL): request.Methods

declare namespace request {

    type RequestBody =
        | string
        | Blob
        | Document
        | FormData
        | ReadableStream
        | BufferSource
        | URLSearchParams

    type Type =
        |             'arraybuffer'
        | 'moz-chunked-arraybuffer'
        |             'blob'
        |         'moz-blob'
        |             'document'
        |       'msxml-document'
        |             'formdata'
        |             'json'
        |             'text'
        | 'moz-chunked-text'

    type Parameters =
        | string
        | Record<string, string | string[] | null | undefined>
        | URLSearchParams

    type RequestURL =
        | string
        | URL

    interface RequestOptions {
        url: RequestURL
        method: string
        headers: Record<string, string> | Headers
        parameters: Parameters
        body: RequestBody
        credentials: 'include' | 'omit' | 'same-origin'
        mode: 'cors' | 'no-cors' | 'same-origin'
        responseType: Type
        responseMediaType: string
        timeout: number
        username: string
        password: string
        multipart: boolean
        tunneling: boolean
        XSLPattern: boolean
    }

    type Instance =
        | XMLHttpRequest
        | XDomainRequest
        | Response

    interface JSONArray extends Array<JSONValue> {}
    type JSONValue = string | number | boolean | null | { [name: string]: JSONValue } | JSONArray;

    interface NormalizedResponse  {
        body: JSONValue | Blob | Document | FormData | ReadableStream | ArrayBuffer
        headers: Record<string, string>
        instance: Instance
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

    interface Complete {
        (response: NormalizedResponse): any
    }

    interface Abort {
        (): void
    }

    interface Done {
        (onSuccess?: Complete, onError?: Complete): Abort
        (callbacks?: {
            success?: Complete
            error?:   Complete
            timeout?: () => any
            abort?:   () => any
        }): Abort
    }

    interface Tail {
        hook: Hook
        done: Done
    }

    interface Hook {
        (
            name: 'loadstart',
            handler: () => boolean | void
        ): Tail
        (
            name: 'download',
            handler: (event: ProgressEvent) => any
        ): Tail
        (
            name: 'loadend',
            handler: () => any
        ): Tail
    }

    interface Querier extends Tail {
        query: (parameters: Parameters) => Tail
    }

    interface Sender extends Tail {
        send: (body: RequestBody) => Tail
    }

    interface Verb<T> {
        (url?: RequestURL): T
    }

    interface Methods extends Tail {
        get: Verb<Querier>
        delete: Verb<Querier>
        head: Verb<Querier>
        post: Verb<Sender>
        put: Verb<Sender>
        patch: Verb<Sender>
    }

}

// 1dacb54fbde2c2af772326981e6d753f76b1955a
interface XDomainRequest {
         prototype:    XDomainRequest;
         new():        XDomainRequest;
         create():     XDomainRequest;
         onprogress(): any;
         onload():     any;
         onerror():    any;
         ontimeout():  any;
readonly responseText: string;
readonly contentType:  string;
         timeout:      number;
         open:         (method: 'GET' | 'POST', url: string) => void;
         send:         (body?: string) => void;
         abort:        () => void;
}