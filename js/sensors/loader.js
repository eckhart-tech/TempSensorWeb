import {ASRESTApi} from "./structure/restWrapper";
import {Record} from "./records";

export { Beacons, Records };

class Beacons {

    constructor() {
        this.beacons=new Map();
    }

    /**
     *
     * @returns {Promise<null>}
     */
    async load() {
        let loader = new ASRESTApi();
        let json = await loader.beacons();
        Object.keys(json).forEach(key => {
            let k = key.toString();
            let v = json[key].toString();
            this.beacons.set(k,v);
        });
    }
    /**
     *
     * @returns {[string]}
     */
    get keys() {
        return Array.from(this.beacons.keys());
    }



    /**
     *
     * @param {string} mac
     * @returns {string}
     */
    get(mac) {
        if(this.beacons.has(mac)) {
            return this.beacons.get(mac);
        }
        else {
            return mac;
        }
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

