import {HTTPRequest, HTTPMethod} from "./rest";

export { ASRESTApi };

const baseURLS = ((obj) => Object.freeze(obj)) ({
    BASE : '/',
    DATA : '/data',
    BEACONS : '/beacons',
    SCHEMA : '/schema'
});



class ASRESTApi {

    constructor(
        device = 'http://127.0.0.1:8080',
        days = 365.0,
        name = "") {
        this.device = device;
        this.name = name;
        this.start=Date.now()- 24*3600.0*days;
        this.url = `${device}${baseURLS.BASE}`;
    }

    #makeURL(base = baseURLS.BASE, parameters = {}) {
        let root = `${this.device}${base}`;
        let pars = Object.keys(parameters).map(key => {
            let value = arguments[key];
            return [key, value.toString()];
        });
        if(pars.length===0) {
            return new URL(root);
        }
        else {
            let params = new URLSearchParams(pars);
            return new URL(`${root}?${params}`);
        }
    }



    async #read(base= baseURLS.BASE) {
        let u = this.#makeURL(base);
        return await (new HTTPRequest().handle(u,HTTPMethod.GET));
    }

    async data() {
        return await this.#read(baseURLS.DATA);
    }

    async beacons() {
        return await this.#read(baseURLS.BEACONS);
    }






}

