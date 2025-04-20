
import {BaseRecord} from './bases';


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

    valid : boolean;
    mac : string;
    sensor : string;
    timestamp : Date;
    time: string;
    temperature : number;
    humidity : number;
    battery : number; 
    
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
        }
        catch(e) {
            console.error(`Error : ${e.toString()}`);
            this.valid = false;
        }
    }



    ordinal() {
        return this.timestamp.valueOf();
    }

    toString() : string { return ''; }

    get array(): string[] {
        return [this.sensor, this.mac, this.timestamp.toString(),
        this.temperature.toString(), this.humidity.toString(), this.battery.toString()];
    }





}

export class Beacon extends BaseRecord {
  /**
   *
   * @param {string} name
   * @param {string} mac
   */
   readonly name: string;
   readonly mac : string;
  constructor(name: string, mac: string) {
      super();
      this.name = name;
    this.mac = mac;
  }



  toString() {
    return `${this.name} [${this.mac}]'`;
  }

  get array() {
    return [this.name, this.mac];
  }
}
