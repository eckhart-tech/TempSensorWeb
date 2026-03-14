import { Record, Records } from "../../sensors";
import { Point, PlotData, PlotDataSet } from "./base";
import { Parameter} from "./parameters";

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

  dataSet(parameter: Parameter): PlotDataSet {
    let plots = this.records.map((d) => {
      let values: Point[] = d.records.map((r) =>  new Point(r.timestamp.getTime(),
          r[parameter.parameter] as number));
      return new PlotData(d.beacon,values);
      });
    return new PlotDataSet(parameter.toString(),plots);
  }
}
