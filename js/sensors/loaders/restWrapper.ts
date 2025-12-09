import {HTTPRequest, HTTPMethod} from "./rest";



const baseURLS = ((obj) => Object.freeze(obj)) ({
    BASE : '/',
    DATA : '/data',
    BEACONS : '/beacons',
    SCHEMA : '/schema',
    RANGE : '/range'
});

const DevRootURL: string = "http://127.0.0.1:8080";
const LiveRootURL: string = "http://neptune.vm.tornadovps.net:8080";



export class ASRESTApi {
    device: string;
    name: string;
    start: number;
    url: string;

    constructor(
        device = LiveRootURL, //'http://127.0.0.1:8080',
        days = 365.0,
        name = "") {
        this.device = device;
        this.name = name;
        this.start=Date.now()- 24*3600.0*days;
        this.url = `${device}${baseURLS.BASE}`;
    }

    private makeURL(base = baseURLS.BASE, parameters = {}) {
        let root = `${this.device}${base}`;
        let pars = Object.keys(parameters).map(key => {
            // @ts-ignore
            let value= arguments[key];
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



    private async read(base= baseURLS.BASE) {
        let u = this.makeURL(base);
        return await (new HTTPRequest().handle(u,HTTPMethod.GET));
    }

    async data() {
        return await this.read(baseURLS.DATA);
    }

    async beacons() {
        return await this.read(baseURLS.BEACONS);
    }

    async range() {
      return await this.read(baseURLS.RANGE);
    }






}

