import { Beacon, Record, Records } from "../../sensors";
import { RecordItem } from "./base";
import { Point } from "chart.js";
import { IndexedBeacon } from "../lists";
import { Parameter} from './graphParameter';

interface DataForBeacon {
  beacon: string;
  index: number;
  records: Record[];
}

class ColourSet {
  private readonly colours: string[];

  constructor(...colours: string[]) {
    this.colours = colours;
  }

  get length() : number { return this.colours.length; }
  colour(idx : number) : string { return this.colours[idx%this.length]; }
}

 const Spectral10 = new ColourSet(
  "#9e0142",
  "#d53e4f",
  "#f46d43",
  "#fdae61",
  "#fee08b",
  "#e6f598",
  "#abdda4",
  "#66c2a5",
  "#3288bd",
  "#5e4fa2");

export class GraphDataSet {
  beacons: IndexedBeacon[];
  private records: DataForBeacon[];
  min: Date;
  minTime: number;
  max: Date;

  static millisecondsPerDay = 86400000;



  constructor(records: Records, beacons: IndexedBeacon[] | null = null,nDays : number | null) {
    this.beacons =
      beacons === null
        ? records.keys.map((n, id) => {
            return { beacon: n, index: id };
          })
        : beacons;
    this.records = this.beacons.map((b) => {
      let recs = records.filter(b.beacon);
      return {
        beacon: b.beacon,
        index: b.index,
        records: recs,
      };
    });

    this.min=records.min;
    this.max = records.max;

    if (nDays === null) {
      this.minTime = this.min.getTime();
    } else {
      let min = records.max.getTime() - GraphDataSet.millisecondsPerDay * nDays;
      this.minTime = Math.max(records.min.getTime(), min);
    }
  }

  dataSet(parameter: Parameter): RecordItem[] {
    return this.records.map((d) => {
      let values: Point[] = d.records.map((r) => {
        return {
          x: r.timestamp.getTime(),
          y: r[parameter.parameter] as number,
        };
      }).filter(r => r.x>=this.minTime);
      let colour = Spectral10.colour(d.index);
      return {
        label: d.beacon,
        data: values,
        backgroundColor: colour,
        borderColor: colour,
      };
    });
  }
}
