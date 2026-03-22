import { DOM } from "../dom";
import { BaseRecord, BaseRecordSet, Beacon } from "../../sensors";
import {Table} from './base';
import {BeaconEvent, IndexedBeacon} from "./events";
import { isValid, safeParseInt } from "../../lib";




export const BeaconHeaders : string[] = ['Beacon Name','MAC Address','Is known?','N Records'];



export class BeaconTable extends Table {
  tag: string;
  base: DOM;
  rows: Beacon[];

  constructor(id: string, title: string, klass: string) {
    super(id,klass, title, BeaconHeaders);
  }

  static eventTargetParent(e: MouseEvent): Element {
    let target = e.target as Element;
    while(isValid(target)) {
      let tag = target.tagName?.toUpperCase();
      if(tag==='TR') {
        return target;
      }
      target = target.parentElement;
    }
    throw new Error(`Unexpected event source ${e.target}`);
  }

  makeRow(row: BaseRecord): DOM[] {
    let beacon = row as Beacon;
    return [
      new DOM('td').text(beacon.name).addClass('name').addClass('l'),
      new DOM('td').text(beacon.mac).addClass('mac').addClass('l'),
      new DOM('td').text(beacon.known ? 'Y' : 'N').addClass('c'),
      new DOM('td').text(beacon.count.toString()).addClass('r')
    ];
  }

  /**
   *
   * @param {MouseEvent} event
   */
  callback(event: MouseEvent) {
    try {
      let row = BeaconTable.eventTargetParent(event);
      let index = safeParseInt(new DOM(row).getAttr("index"));
      let clicked = this.rows[index];
      console.log(`Clicked on row ${index} : ${clicked.toString()}`);
      this.table.toggleRow(index);

      this.table.dom.fire(new BeaconEvent(this.active));
    } catch (e) {
      console.error(`Bad click : ${e.toString()}`);
    }
  }

  get active(): IndexedBeacon[] {
    let ind: number[] = this.table.activeIndices;
    return ind.map((idx) => {
      return { beacon: this.rows[idx].name, index: idx };
    });
  }
}