import {DOM, DOMTable} from '../dom';
import { Record } from "../../sensors";
import {Table} from './base';
import { ESSet } from "../../lib/XSet";

export class RecordTable extends Table<DOMTable> {
  tag: string;
  base: DOM;
  rows: Record[];
  table: DOMTable;
  allBeacons: ESSet<string>;


  Headers = [
    "Name",
    "MAC",
    "Time",
    "Temperature (C)",
    "Humidity (%)",
    "Battery (%)",
  ];



  constructor(tag = "records",klass : string = "rec", title : string | null = null) {
    super(tag,klass,title);
  }

  getNew(...args: any[]): DOMTable {
    return new DOMTable(...args);
  }

  callback(event: MouseEvent) {

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