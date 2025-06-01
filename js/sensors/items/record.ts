import { BaseRecord } from "./base";
import { convert } from "../../lib";



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
      this.mac = convert(x.mac).str;
      this.sensor = convert(x.sensor).str;
      this.timestamp = convert(x.timestamp).date;
      this.time = undefined;
      this.temperature = convert(x.temperature).num;
      this.humidity = convert(x.humidity).percent;
      this.battery = convert(x.battery).percent;
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