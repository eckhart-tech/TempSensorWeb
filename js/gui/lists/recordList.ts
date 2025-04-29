import {DOM, DOMTable, SelectableDOMTable} from '../dom';
import { BaseRecordSet, Beacon, Record } from "../../sensors";
import {Table} from './base';
import {BeaconEvent} from "./events";


export class RecordTable extends Table<DOMTable> {
  tag: string;
  base: DOM;
  rows: Record[];
  table: DOMTable;
  allBeacons: Set<string>;
  knownBeacons: Set<string>;

  Headers = [
    "Name",
    "MAC",
    "Time",
    "Temperature (C)",
    "Humidity (%)",
    "Battery (%)",
  ];
  Klass = "rec";
  private anomalousBeacons: Set<string>;

  constructor(knownBeacons: Set<string>, tag = "records") {
    super(tag);
    this.allBeacons = new Set();
    this.knownBeacons = knownBeacons;
    this.anomalousBeacons = new Set();
  }

  getNew(...args: any[]): DOMTable {
    return new DOMTable(...args);
  }

  callback(event: MouseEvent) {
    try {
      let row = RecordTable.eventTargetParent(event);
      let index = RecordTable.check(parseInt(new DOM(row).getAttr("index")));
      console.log(`Clicked on row ${index}`);
    } catch (e) {
      console.error(`Bad click : ${e.toString()}`);
    }
  }

  render(data: BaseRecordSet) {
    super.render(data);
    let beaconNames = this.rows.map((r) => r.sensor);
    this.allBeacons = new Set(beaconNames);
    this.anomalousBeacons = new Set(
      beaconNames.filter((b) => !this.knownBeacons.has(b)),
    );
  }



  reset() {
    this.tableRows.forEach((row) => row.removeClass("hide"));
  }

  static selectClass(row: DOM, klass: string, selector: boolean) {
    selector ? row.removeClass(klass) : row.addClass(klass);
    return selector ? 1 : 0;
  }

  filter(active: Set<string>) {
    console.log("Filtering with", active);

    let displayAll = active.size === 0;
    let visible: number = 0;
    let anomalous: number = this.tableRows.length;
    this.tableRows.forEach((row, idx) => {
      let b = this.rows[idx].sensor;

      visible += RecordTable.selectClass(
        row,
        "hide",
        displayAll || active.has(b),
      );
      anomalous -= RecordTable.selectClass(
        row,
        "anomaly",
        !this.anomalousBeacons.has(b),
      );
    });
    console.log(
      `Loaded ${this.tableRows.length} rows; ${visible} visible, ${anomalous} anomalous`,
    );
  }
}