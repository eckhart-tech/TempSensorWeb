import { DOM, DOMElement } from "../dom";
import { BaseRecord, Beacon } from "../../sensors";
import {Table} from './base';
import {BeaconEvent} from "./events";
import { TableUnit } from "../dom/elements/tableBase";


export class BeaconCell extends DOMElement {

  readonly event: string = "click";

  constructor(beacon: Beacon) {
    super('li');
    if (!beacon.known) {
      this.dom.addClass('unknown');
    }
    this.dom.append(new DOM('dl').appendAll([
      new DOM('dt').text('name'),
      new DOM('dd').text(beacon.name),
      new DOM('dt').text('MAC'),
      new DOM('dd').text(beacon.mac)
    ]));
    this.dom.append(new DOM('aside').text(beacon.known? '.' : '!'));
  }
}



export class BeaconTable extends Table {
  tag: string;
  base: DOM;
  rows: Beacon[];

  Headers = ["Name", "MAC", ""];

  static eventTargetParent(e: MouseEvent): Element {
    let target = Table.check(e.target as Element);
    let tag = Table.check(target.tagName).toUpperCase();
    switch (tag) {
      case "LI":
        return Table.check(target.parentElement);
      case "UL":
        return target;
      default:
        throw new Error(`Unexpected event source ${tag}`);
    }
  }

  constructor(title: string, klass: string, tag = "beacons") {
    super(tag, 'nav','ul',klass, title);
  }

  makeHeader(): DOMElement | null {
    return null;
  }

  makeRow(row: BaseRecord): DOMElement {
    return new BeaconCell(row as Beacon);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  callback(event: MouseEvent) {
    try {
      let row = BeaconTable.eventTargetParent(event);
      let index = BeaconTable.check(parseInt(new DOM(row).getAttr("index")));
      let clicked = this.rows[index];
      console.log(`Clicked on row ${index} : ${clicked.toString()}`);
      this.table.toggleRow(index);

      this.table.dom.fire(new BeaconEvent(this.active));
    } catch (e) {
      console.error(`Bad click : ${e.toString()}`);
    }
  }

  get active() {
    let ind: number[] = this.table.activeIndices;
    return ind.map((idx) => this.rows[idx]);
  }
}