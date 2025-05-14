import { DOM, DOMElement } from "../dom";
import { BaseRecord, Beacon, Record } from "../../sensors";
import {Table} from './base';
import { ESSet } from "../../lib/XSet";

export class RecordCell extends DOMElement {

  readonly event: string = "click";

  constructor(record: Record) {
    super('tr');
    this.dom.appendAll(record.array.map(x => new DOM('td').text(x)));
  }
}

class RecordHeader extends DOMElement {
  constructor(fields: string[]) {
    super('tr');
    this.dom.appendAll(fields.map(x => new DOM('th').text(x)));
  }
}

export class RecordTable extends Table {
  tag: string;
  base: DOM;
  rows: Record[];
  allBeacons: ESSet<string>;

  Headers = [
    "Name",
    "MAC",
    "Time",
    "Temperature (C)",
    "Humidity (%)",
    "Battery (%)",
  ];

  constructor(
    tag = "records",
    klass: string = "rec",
    title: string | null = null,
  ) {
    super(tag,klass, title);
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