

import {Record, Records } from "../../sensors";
import { RecordItem, RecordValue } from "./configuration";


export enum Parameter {
  Temperature = 'temperature',
  Humidity = 'humidity',
  Battery = 'battery',
}


export class ParameterInfo {
  readonly parameter: Parameter;
  readonly units: string;
  readonly min: number;
  readonly max: number;

  constructor(parameter : Parameter) {
    this.parameter=parameter;

      switch(parameter) {
        case Parameter.Temperature:
          this.units = 'C';
          break;
        case Parameter.Battery:
        case Parameter.Humidity:
          this.units = '%';
          break;
        default:
          this.units = '';
          break;
      }

    this.min=0;
      this.max=100;
  }
}


function getParameter(record: Record, parameter: Parameter) : number {
  return record[parameter];
}





interface DataForBeacon {
  beacon: string,
  records : Record[],
}

export class GraphDataSet {
  beacons: string[];
  private records: DataForBeacon[];
  min: Date;
  max: Date;


    /**
     *
     * @param {Records} records
     * @param {[string]|null} beacons
     */
    constructor(records: Records, beacons : string[] | null =null) {
        this.beacons = (beacons===null) ? records.keys : beacons;
        this.records = this.beacons.map( b => {
          let recs = records.filter(b);
          return {
            beacon : b,
            records: recs
          };
        });
        this.min = records.min;
        this.max  = records.max;
    }



    dataSet(parameter: Parameter) : RecordItem[] {
        return this.records.map(d => {
          let values: RecordValue[] = d.records.map(r => {
            return {x: r.timestamp.getTime(), y: r[parameter] as number};
          });
          return {
            label: d.beacon,
            data: values
          };
        });
    }


}