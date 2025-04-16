export { HTTPRequest, HTTPMethod };

const HTTPMethod = ((obj) => Object.freeze(obj)) ( {
    GET : 'GET',
    HEADER : 'HEADER',
    PUT : 'PUT',
    POST : 'POST',
    PATCH : 'PATCH'
});

class HTTPRequest {

    constructor() {}

    /**
     *
     * @returns {Headers}
     */
    headers() {
        return new Headers({
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip, deflate, br"
        });
    }

    /**
     *
     * @param {string} method
     * @param {object} data
     * @returns {object}
     */
    #options(method = HTTPMethod.GET, data = undefined) {
        let accept = (method === HTTPMethod.POST) ? "application/json" : "*/*";
        let hdr = this.headers();
        hdr.append("Accept", accept);
        let opts = {
            method: method,
            cache: "no-cache",
            credentials: "same-origin",
            headers: hdr
        };
        if (data!==undefined) {
            opts.body = JSON.stringify(data);
        }

        return opts;
    }

    /**
     *
     * @param {URL} url
     * @param {string} method
     * @param {object} data
     * @returns {Promise<any>}
     */
    async handle(url, method = HTTPMethod.GET, data = undefined) {
        let opts = this.#options(method,data);
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
    async get(url) {
        return await this.handle(url, HTTPMethod.GET);
    }

    /**
     *
     * @param {URL} url
     * @param {object} data
     * @returns {Promise<*>}
     */
    async patch(url, data = undefined) {
        let opts = this.options("PATCH");
        if (data!==undefined) {
            opts.body = JSON.stringify(data);
        }
        return await this.handle(url, opts);
    }

}
