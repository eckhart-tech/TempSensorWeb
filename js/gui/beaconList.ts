import {DOM, DOMTable} from './dom';
import {Beacons} from '../sensors/loader';
import {Beacon} from '../sensors/records';

export { BeaconTable };

/**
 * @template {string|number|Element} T
 * @param {T} x
 * @returns {T}
 */
function check<T>(x: T): T {
  if (x === null || x === undefined || Number.isNaN(x)) {
    throw new Error("undefined");
  }
  return x;
}

/**
 * @extends Event
 */
export class BeaconEvent extends Event {
    /**
     *  @param {Beacon[]} beacons
     */
    readonly active : Beacon[];

    constructor(beacons : Beacon[] = []) {
        super('beacon-list', {bubbles: true});
        this.active = beacons;
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'beacon-list': BeaconEvent;
    }
}



class BeaconTable {
  tag: string;
  base: DOM;
  rows: Beacon[];
  table: DOMTable;
  constructor(tag = "beacons") {
    this.tag = tag;
    this.base = DOM.withID(this.tag);
    // @ts-ignore
    this.rows = [];
    this.table = null;
  }

  /**
   *
   * @param {MouseEvent} e
   * @returns {Element}
   */
  static eventTargetParent(e: MouseEvent): Element {
    let target = check(e.target as Element);
    let tag = check(target.tagName).toUpperCase();
    switch (tag) {
      case "TD":
        return check(target.parentElement);
      case "TR":
        return target;
      default:
        throw new Error(`Unexpected event source ${tag}`);
    }
  }

  /**
   *
   * @param {MouseEvent} event
   */
  callback(event: MouseEvent) {
    try {
      let row = BeaconTable.eventTargetParent(event);
      let index = check(parseInt(new DOM(row).getAttr("index")));
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

  /**
   *
   * @param {Beacons} data
   */
  render(data: Beacons) {
    this.rows = data.beacons;
    let trs = this.rows.map((b) => b.array);
    this.table = new DOMTable(["Name", "MAC"], trs, "bcn");
    let t = this.table
      .render()
      .addEventListener("click", (ev) => this.callback(ev as MouseEvent));
    this.base.empty().append(t);
  }
}