import { DOM, DOMElement, DOMTableBase } from "../dom";
import {BaseRecord, BaseRecordSet} from "../../sensors";

export abstract class Table {
  tag: string;
  kind: string;
  body: string;
  base: DOM;
  rows: BaseRecord[];
  table: DOMTableBase;

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

  protected constructor(
    tag: string,
    kind: string,
    body: string,
    klass: string,
    title : string|null = null) {
    this.tag = tag;
    this.kind = kind;
    this.body=body;
    this.base = DOM.withID(this.tag);
    this.rows = [];
    this.table = null;
    this.Klass = klass;
    this.title = title;
  }

  abstract callback(event: MouseEvent): void;

  abstract makeHeader() : DOMElement|null;
  abstract makeRow(row: BaseRecord) : DOMElement;

  render(data: BaseRecordSet,reset=true): void {
    this.rows = data.items;
    let trs = this.rows.map((b) => this.makeRow(b));
    this.table = new DOMTableBase(
      this.kind,
      this.body,
      this.makeHeader(),
      trs,
      this.title,
      this.Klass
    );
    this.table.load();
    this.table.addListener((ev) => this.callback(ev as MouseEvent));
    if(reset) { this.base.empty(); }
    this.base.append(this.table.dom);
  }

  get tableRows(): DOM[] {
    return this.table.dataRows;
  }

  get activeRows(): DOM[] {
    return this.table.activeRows;
  }

  get activeIndices(): number[] {
    return this.table.activeIndices;
  }
}