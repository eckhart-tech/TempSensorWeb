
import {Records} from '../../sensors/loader';
import {Record } from "../../sensors";

export enum Parameter {
  Temperature = 'temperature',
  Humidity = 'humidity',
  Battery = 'battery',
}

function getParameter(record: Record, parameter: Parameter) : number {
  return record[parameter];
}


class Bounds {
   min: number;
   max: number;
    constructor(items : number[]) {
        this.min = Math.min(...items);
        this.max = Math.max(...items);
    }

    static join(...bounds: Bounds[]) {
        let min = Math.min(...bounds.map(b => b.min));
        let max = Math.max(...bounds.map(b => b.max));
        return new Bounds([min, max]);
    }
}


}
interface RecordValue {
  x: number,
  y: number
}

type RecordItem = {
  label: string;
  data: RecordValue[];
}

class BeaconData {
  private beacon: string;
  private records: Record[];
   bounds: Bounds;
    /**
     *
     * @param {string} beacon
     * @param {Records} records
     */
    constructor(beacon: string,records: Records) {
        this.beacon=beacon;
        this.records=records.filter(beacon);
        this.bounds = new Bounds(this.records.map(r => r.timestamp.getTime() ));
    }

    format(parameter: Parameter) : RecordItem  {
        let values: RecordValue[] = this.records.map(record => {
          return {x: record.timestamp.getTime(), y: record[parameter] as number};
        });
        return {
            label: this.beacon,
            data: values
        };
    }
    
    
}

export class GraphDataSet {
  beacons: string[];
  private records: BeaconData[];
  bounds: Bounds;

    /**
     *
     * @param {Records} records
     * @param {[string]|null} beacons
     */
    constructor(records: Records, beacons : string[] | null =null) {
        this.beacons = (beacons===null) ? records.keys : beacons;
        this.records = this.beacons.map(beacon => new BeaconData(beacon,records));
        this.bounds = Bounds.join(...this.records.map(recs => recs.bounds));
    }

    dataSet(parameter: Parameter) {
        return this.records.map(records => records.format(parameter));
    }

    static unit(parameter: Parameter) : string {
        switch(parameter) {
            case Parameter.Temperature:
                return 'C';
            case Parameter.Battery:
            case Parameter.Humidity:
                return '%';
            default:
                return '';
        }
    }
}