import {DOM, CSSTable} from '../dom';
import {Beacon} from '../../sensors';
import {Table} from './base';
import {BeaconEvent} from "./events";


export class BeaconTable extends Table<CSSTable> {
  tag: string;
  base: DOM;
  rows: Beacon[];
  table: CSSTable;

  Headers = ["Name", "MAC"];

  static eventTargetParent(e: MouseEvent): Element {
    let target = Table.check(e.target as Element);
    let tag = Table.check(target.tagName).toUpperCase();
    switch (tag) {
      case 'LI':
        return Table.check(target.parentElement);
      case "UL":
        return target;
      default:
        throw new Error(`Unexpected event source ${tag}`);
    }
  }

  constructor(title: string,klass: string,tag = "beacons") {
    super(tag,klass,title);
  }

  getNew(...args: any[]): CSSTable {
    return new CSSTable(...args);
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
    let ind = this.table.activeIndices;
    return ind.map((idx) => this.rows[idx]);
  }
}