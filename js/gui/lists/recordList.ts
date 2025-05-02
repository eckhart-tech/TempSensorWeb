import {DOM, DOMTable, SelectableDOMTable} from '../dom';
import { BaseRecordSet, Beacon, Record } from "../../sensors";
import {Table} from './base';
import {BeaconEvent} from "./events";
import { XSet } from "./XSet";





export class RecordTable extends Table<DOMTable> {
  tag: string;
  base: DOM;
  rows: Record[];
  table: DOMTable;
  allBeacons: XSet<string>;


  Headers = [
    "Name",
    "MAC",
    "Time",
    "Temperature (C)",
    "Humidity (%)",
    "Battery (%)",
  ];
  Klass = "rec";


  constructor(tag = "records") {
    super(tag);
    //this.knownBeacons = knownBeacons;
    //this.anomalousBeacons = new Set();
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

    this.tableRows.forEach((row, idx) => {
      let b = this.rows[idx].sensor;

      visible += RecordTable.selectClass(
        row,
        "hide",
        displayAll || active.has(b),
      );
    });
    console.log(
      `Loaded ${this.tableRows.length} rows; ${visible} visible`,
    );
  }
}