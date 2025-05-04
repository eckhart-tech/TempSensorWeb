import {DOM, DOMTable} from "../dom";
import {BaseRecord, BaseRecordSet} from "../../sensors";
import {ESSet} from "../../lib/XSet";

export abstract class Table<TAB extends DOMTable> {
  tag: string;
  base: DOM;
  rows: BaseRecord[];
  table: TAB;

  abstract Headers: string[];
  Klass: string;
  title : string | null;

  /**
   * @template {string|number|Element} T
   * @param {T} x
   * @returns {T}
   */
  static check<T>(x: T): T {
    if (x === null || x === undefined || Number.isNaN(x)) {
      throw new Error("undefined");
    }
    return x;
  }

  static eventTargetParent(e: MouseEvent): Element {
    let target = Table.check(e.target as Element);
    let tag = Table.check(target.tagName).toUpperCase();
    switch (tag) {
      case "TD":
        return Table.check(target.parentElement);
      case "TR":
        return target;
      default:
        throw new Error(`Unexpected event source ${tag}`);
    }
  }

  protected constructor(tag: string,klass: string,title : string|null = null) {
    this.tag = tag;
    this.base = DOM.withID(this.tag);
    this.rows = [];
    this.table = null;
    this.Klass = klass;
    this.title = title;
  }



  abstract callback(event: MouseEvent): void;
  abstract getNew(...args: any[]): TAB;

  render(data: BaseRecordSet,reset=true): void {
    this.rows = data.items;
    let trs = this.rows.map((b) => b.array);
    this.table = this.getNew(this.Headers, trs, this.title, this.Klass);
    this.table.load();
    this.table.addListener((ev) => this.callback(ev as MouseEvent));
    if(reset) { this.base.empty(); }
    this.base.append(this.table.dom);
  }

  get tableRows(): DOM[] {
    return this.table.dataRows;
  }
}