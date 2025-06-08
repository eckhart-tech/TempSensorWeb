import { DOM } from "../dom";
import { BaseRecord, Beacon } from "../../sensors";
import {Table} from './base';
import {BeaconEvent} from "./events";




  function BeaconCell(beacon: Beacon) : DOM[] {
   return [
      new DOM('td').text(beacon.name).addClass('name').addClass('l'),
      new DOM('td').text(beacon.mac).addClass('mac').addClass('l'),
      new DOM('td').text(beacon.known ? 'Y' : 'N').addClass('c'),
      new DOM('td').text(beacon.count.toString()).addClass('r')
    ];
   /*
    let dom = new DOM('td');
    if (!beacon.known) {
      dom.addClass('unknown');
    }
    dom.appendAll([
      new DOM('ul').appendAll([
        new DOM('li').text(beacon.name).addClass('name'),
        new DOM('li').text(beacon.mac).addClass('mac')
      ]),
      new DOM('aside').text(beacon.known ? ' ' : 'unk')
    ]);
  return dom;
  */

}




function isValid(x : string|number|Element) : boolean {
  return !(x===null || x=== undefined || Number.isNaN(x));
}


function parseSafe(x: string): number {
  let nn = parseInt(x);
    if (!isValid(nn)) {
    throw new Error(`Bad tag value ${x}`);
  }
  return nn;
}

export class BeaconTable extends Table {
  tag: string;
  base: DOM;
  rows: Beacon[];

  Headers: string[] = ['Beacon Name','MAC Address','Is known?','N Records'];

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

  constructor(id: string, title: string, klass: string) {
    super(id,klass, title);
  }


  makeRow(row: BaseRecord): DOM[] {
    return BeaconCell(row as Beacon);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  callback(event: MouseEvent) {
    try {
      let row = BeaconTable.eventTargetParent(event);
      let index = parseSafe(new DOM(row).getAttr("index"));
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