interface HTTPOptions {
  method: string,
  cache: string,
  credentials?: string,
  headers: Headers,
  body?: string,
  mode?: string
}

export const HTTPMethod = ((obj) => Object.freeze(obj)) ( {
    GET : 'GET',
    HEADER : 'HEADER',
    PUT : 'PUT',
    POST : 'POST',
    PATCH : 'PATCH'
});

export class HTTPRequest {
  constructor() {}

  /**
   *
   * @returns {Headers}
   */
  headers(): Headers {
    return new Headers({
      Connection: "keep-alive",
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    });
  }


  private options(
    method: string = HTTPMethod.GET,
    data: object = undefined,
    cors: boolean = true
  ): RequestInit {
    let accept = method === HTTPMethod.POST ? "application/json" : "*/*";
    let hdr = this.headers();
    hdr.append("Accept", accept);
    let opts : RequestInit = {
      method: method,
      cache: "no-cache",
      headers: hdr
    };
    if(cors) {
      opts.mode = 'cors';
    }
    if (data !== undefined) {
      // @ts-ignore
      opts.body = JSON.stringify(data);
    }

    return opts;
  }


  async handle(
    url: URL,
    method: string = HTTPMethod.GET,
    data: object = undefined,
    cors: boolean = true
  ): Promise<any> {
    let opts = this.options(method, data, cors);
    const response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(`Network : ${response.status}`);
    }
    return response.json();
  }

  /**
   *
   * @param {URL} url
   * @returns {Promise<*>}
   */
  async get(url: URL): Promise<any> {
    return await this.handle(url, HTTPMethod.GET);
  }

  /**
   *
   * @param {URL} url
   * @param {object} data
   * @returns {Promise<*>}
   */
  async patch(url: URL, data: object = undefined): Promise<any> {
    let opts = this.options("PATCH");
    if (data !== undefined) {
        // @ts-ignore
      opts.body = JSON.stringify(data);
    }
    return await this.handle(url,HTTPMethod.PATCH, opts);
  }
}
