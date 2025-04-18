import {ASRESTApi} from "./structure/restWrapper";
import {Beacon, Record} from "./records";

export { Beacons, Records };

class Beacons {

    constructor() {
        this.beacons = [];
        this._keys = [];
    }

    /**
     *
     * @returns {Promise<null>}
     */
    async load() {
        let loader = new ASRESTApi();
        let json = await loader.beacons();
        let m = new Map();
        Object.keys(json).forEach(key => {
            let k = key.toString();
            let v = json[key].toString();
            m.set(k,v);
        });
        this._keys = Array.from(m.keys()).toSorted();
        this.beacons = this._keys.map( k => new Beacon(m.get(k),k));
    }
    /**
     *
     * @returns {[string]}
     */
    get keys() {
        return this._keys;
    }

    get length() {
        return this.beacons.length;
    }



    /**
     *
     * @param {string} mac
     * @returns {Beacon}
     */
    get(mac) {
        let idx =  this.beacons.findIndex(b => b.mac === mac);
        if(idx<0) { return mac; }
        else { return this.beacons[idx]; }
    }

    /**
     *
     * @param {int} idx
     * @returns {Beacon}
     */
    at(idx) {
        return this.beacons[idx];
    }
}


/**
 * @property {[Record]} data;
 * @property {Map<string,Record>} sensors;
 */
class Records {

    constructor(
        days = 365.0
    ) {
        this.data = [];
        this.beaconData = new Map();
        this.days=days;
        this.loaded = false;
    }

    async load() {
        let loader = new ASRESTApi();
        let json = await loader.data();

        this.data = json.map((item) => new Record(item)).filter(
            (item) => item.valid
        );

        this.data.forEach(record => {
            let sensor = record.sensor;
            if (!this.beaconData.has(sensor)) {
                this.beaconData.set(sensor,[]);
            }
            this.beaconData.get(sensor).push(record);
        });
        this.loaded = true;
    }

    get list() {
        return Array.from(this.beaconData.keys());
    }

    recordsForBeacon(beacon) {
        if(this.beaconData.has(beacon)) {
            return this.beaconData.get(beacon);
        }
        else {
            return [];
        }
    }

    get raw() { return this.data; }
}

