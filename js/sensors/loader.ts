import {ASRESTApi} from "./structure/restWrapper";
import {BaseRecord, BaseRecordSet} from "./bases";
import {Beacon, Record} from "./records";




export class Beacons extends BaseRecordSet {
  beacons: Beacon[];
  private _keys: string[];
  constructor() {
    super();
    this.beacons = [];
    this._keys = [];
  }

  get items() {
    return this.beacons;
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async load(): Promise<void> {
    let loader = new ASRESTApi();
    let json = await loader.beacons();
    let m = new Map();
    Object.keys(json).forEach((key) => {
      let k = key.toString();
      let v = json[key].toString();
      m.set(k, v);
    });
    this._keys = (Array.from(m.keys()) as string[]).toSorted();
    this.beacons = this._keys.map((k) => new Beacon(m.get(k), k));
  }
  /**
   *
   * @returns {string[]}
   */
  get keys(): string[] {
    return this._keys;
  }



  /**
   *
   * @param {string} mac
   * @returns {Beacon}
   */
  get(mac: string): Beacon {
    let idx = this.beacons.findIndex((b) => b.mac === mac);
    if (idx < 0) {
      return new Beacon(mac, mac);
    } else {
      return this.beacons[idx];
    }
  }

  /**
   *
   * @param {number} idx
   * @returns {Beacon}
   */
  at(idx: number): Beacon {
    return this.beacons[idx];
  }

  filter(key: string): BaseRecord[] {
    return [];
  }
}



export class Records extends BaseRecordSet {

    data : Record[];
    beaconData : Map<string,Record[]>;
    days : number;
    loaded : boolean;
    constructor(
        days : number = 365.0
    ) {
        super();
        this.data = [];
        this.beaconData = new Map();
        this.days=days;
        this.loaded = false;
    }

    get items() { return this.data; }

    async load() {
        let loader = new ASRESTApi();
        let json = await loader.data();

        this.data = json.map((item: object) => new Record(item)).filter(
            (r: Record) => r.valid
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

    get keys(): string[] {
        return Array.from(this.beaconData.keys());
    }

    filter(key: string): Record[] {
        if(this.beaconData.has(key)) {
            return this.beaconData.get(key);
        }
        else {
            return [];
        }
    }

}

