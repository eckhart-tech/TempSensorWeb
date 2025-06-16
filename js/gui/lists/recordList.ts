import { DOM } from "../dom";
import { BaseRecord, Record, Records } from "../../sensors";
import {Table} from './base';


export const RecordHeaders : string[] = [
  "Name",
  "MAC",
  "Time",
  "Temperature (C)",
  "Humidity (%)",
  "Battery (%)",
];


export class RecordTable extends Table {
  tag: string;
  base: DOM;
  rows: Record[];

  constructor(
    id: string,
    klass: string = "rec",
    title: string | null = null,
  ) {
    super(id,klass, title, RecordHeaders);
  }

  callback(event: MouseEvent) {}


  makeRow(row: BaseRecord): DOM[] {
    return (row as Record).array.map(d => new DOM('td').text(d));
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
    console.log(`Loaded ${this.tableRows.length} rows; ${visible} visible`);
  }
}