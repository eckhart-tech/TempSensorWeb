
import { BaseRecord, BaseRecordSet } from "./bases";
import { Beacon } from "./beacons";
import { ESSet } from "../lib/XSet";
import { InitListDict } from "../lib/InitListDict";



function asString(x : any) : string {
        if (x === null || x === undefined) {
            throw new Error('Not a String');
        }
        return x.toString();
    }


function asNumber(x: any) : number {
        let y = parseFloat(x);
        if (Number.isNaN(y)) {
            throw new Error('Not a number');
        }
        return y;
    }

function asPercentage(x: any) : number {
        let y = asNumber(x);
        if (y < 0.0 || y > 100.0) {
            throw new Error('Not a percentage');
        }
        return y;
    }

function asDate(x: any) : Date {
        let y = asNumber(x);
        let d = new Date(y*1000.0);
        if (Number.isNaN(d.valueOf())) {
            throw new Error('Not a date');
        }
        return d;
}


interface JSONRecord {
  mac? : any,
  sensor?: any,
  timestamp?: any,
  temperature?: any,
  humidity?: any,
  battery?: any
}

export class Record extends BaseRecord {

  valid: boolean;
  mac: string;
  sensor: string;
  timestamp: Date;
  time: string;
  temperature: number;
  humidity: number;
  battery: number;


  constructor(
    x : JSONRecord = {}
  ) {
    super();
    this.valid = true;
    try {
      this.mac = asString(x.mac);
      this.sensor = asString(x.sensor);
      this.timestamp = asDate(x.timestamp);
      this.time = undefined;
      this.temperature = asNumber(x.temperature);
      this.humidity = asPercentage(x.humidity);
      this.battery = asPercentage(x.battery);
    } catch (e) {
      console.error(`Error : ${e.toString()}`);
      this.valid = false;
    }

  }

  get name(): string {
    return this.sensor;
  }




  toString(): string {
    return '';
  }

  get array(): string[] {
    return [this.sensor, this.mac, this.timestamp.toLocaleString(),
      this.temperature.toFixed(2), this.humidity.toFixed(2), this.battery.toFixed(2)];
  }
}

  export class Records extends BaseRecordSet {

  data : Record[];
  beacons : Beacon[];

  beaconData : InitListDict<string,Record>;
  min: Date;
  max: Date;
  constructor(records: Record[] = [],beacons: Beacon[] = []) {
    super();
    this.data = records;
    let times = records.map(r => r.timestamp.getTime());
    this.min = new Date(Math.min(...times));
    this.max = new Date(Math.max(...times));

    this.beacons = [];
    this.beaconData = new InitListDict();

    this.data.forEach(record => {
      this.beaconData.set(record.sensor,record);
    });

    let bNames = new ESSet(beacons.map(b => b.name));
    let extraNames = new ESSet(this.beaconData.keys).difference(bNames);
    this.beacons = [...extraNames].map(n => {
      return new Beacon(n, n, false);
    });
  }

  get items() { return this.data; }
  get count() : Map<string,number> {
    return this.beaconData.map(rs => rs.length);
  }


  get keys(): string[] {
    return this.beaconData.keys;
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

