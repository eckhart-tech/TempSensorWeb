import {DOM, DOMTable} from '../dom';
import {Beacon} from '../../sensors';
import {Table} from './base';
import {BeaconEvent} from "./events";


export class BeaconTable extends Table {
  tag: string;
  base: DOM;
  rows: Beacon[];
  table: DOMTable;

  Headers = ["Name", "MAC"];
  Klass = "bcn";

  constructor(tag = "beacons") {
    super(tag);
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
      let ind = this.table.activeIndices;
      let active = ind.map((idx) => this.rows[idx]);
      this.table.dom.fire(new BeaconEvent(active));
    } catch (e) {
      console.error(`Bad click : ${e.toString()}`);
    }
  }


}