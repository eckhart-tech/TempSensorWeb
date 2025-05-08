
import { BaseRecord, BaseRecordSet } from "./bases";



class Valid {


    static asString(x : any) {
        if (x === null || x === undefined) {
            throw new Error('Not a String');
        }
        return x.toString();
    }


    static asNumber(x: any) {
        let y = parseFloat(x);
        if (Number.isNaN(y)) {
            throw new Error('Not a number');
        }
        return y;
    }

    static asPercentage(x: any) {
        let y = Valid.asNumber(x);
        if (y < 0.0 || y > 100.0) {
            throw new Error('Not a percentage');
        }
        return y;
    }

    static asDate(x: any) {
        let y = Valid.asNumber(x);
        let d = new Date(y*1000.0);
        if (Number.isNaN(d.valueOf())) {
            throw new Error('Not a date');
        }
        return d;
    }


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
    x = {}
  ) {
    super();
    this.valid = true;
    try {
      // @ts-ignore
      this.mac = Valid.asString(x.mac);
      // @ts-ignore
      this.sensor = Valid.asString(x.sensor);
      // @ts-ignore
      this.timestamp = Valid.asDate(x.timestamp);
      this.time = undefined;
      // @ts-ignore
      this.temperature = Valid.asNumber(x.temperature);
      // @ts-ignore
      this.humidity = Valid.asPercentage(x.humidity);
      // @ts-ignore
      this.battery = Valid.asPercentage(x.battery);
    } catch (e) {
      console.error(`Error : ${e.toString()}`);
      this.valid = false;
    }

  }

  get name(): string {
    return this.sensor;
  }


  ordinal() {
    return this.timestamp.valueOf();
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
  beaconData : Map<string,Record[]>;
  min: Date;
  max: Date;
  constructor(records: Record[] = []) {
    super();
    this.data = records;
    let times = records.map(r => r.timestamp.getTime());
    this.min = new Date(Math.min(...times));
    this.max = new Date(Math.max(...times));

    this.beaconData = new Map();

    this.data.forEach(record => {
      let sensor = record.sensor;
      if (!this.beaconData.has(sensor)) {
        this.beaconData.set(sensor,[]);
      }
      this.beaconData.get(sensor).push(record);
    });
  }

  get items() { return this.data; }



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

