import { Record, Records } from "../../sensors";
import { RecordItem, RecordValue } from "./configuration";

enum _Parameter {
  Temperature = "temperature",
  Humidity = "humidity",
  Battery = "battery",
}

export class Parameter {
  readonly parameter: _Parameter;
  readonly units: string;
  readonly min: number;
  readonly max: number;

  constructor(parameter: _Parameter) {
    this.parameter = parameter;

    switch (parameter) {
      case _Parameter.Temperature:
        this.units = "C";
        break;
      case _Parameter.Battery:
      case _Parameter.Humidity:
        this.units = "%";
        break;
      default:
        this.units = "";
        break;
    }

    this.min = 0;
    this.max = 100;
  }

  toString(): string {
    return this.parameter;
  }

  static Temperature = new Parameter(_Parameter.Temperature);
  static Humidity = new Parameter(_Parameter.Humidity);
  static Battery = new Parameter(_Parameter.Battery);

  static All = [Parameter.Temperature, Parameter.Humidity, Parameter.Battery];
}

function getParameter(record: Record, parameter: Parameter): number {
  return record[parameter.parameter];
}

interface DataForBeacon {
  beacon: string;
  records: Record[];
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
  constructor(records: Records, beacons: string[] | null = null) {
    this.beacons = beacons === null ? records.keys : beacons;
    this.records = this.beacons.map((b) => {
      let recs = records.filter(b);
      return {
        beacon: b,
        records: recs,
      };
    });
    this.min = records.min;
    this.max = records.max;
  }

  dataSet(parameter: Parameter): RecordItem[] {
    return this.records.map((d) => {
      let values: RecordValue[] = d.records.map((r) => {
        return {
          x: r.timestamp.getTime(),
          y: r[parameter.parameter] as number,
        };
      });
      return {
        label: d.beacon,
        data: values,
      };
    });
  }
}
